"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Encryption_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Encryption"));
const utils_1 = global[Symbol.for('ioc.use')]("App/Helpers/utils");
const UserSession_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserSession"));
const moment_1 = __importDefault(require("moment"));
const Permission_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Permission"));
const RoleModule_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/RoleModule"));
class AuthController {
    async login({ auth, request, response, location, device }) {
        try {
            const { email, password } = request.all();
            const rules = {
                email: 'required|max:150|email',
                password: 'required|min:8|max:14',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            const user = await User_1.default.query().where('email', email).preload('role').first();
            if (!user) {
                return response.badRequest({
                    message: 'No registered user found for the given email',
                });
            }
            if (user && !user.is_active) {
                return response.badRequest({
                    message: 'User is disabled to login Please contact admin',
                });
            }
            if (!(await Hash_1.default.verify(user.password, password))) {
                return response.badRequest({ message: 'Invalid credentials' });
            }
            let modules = await RoleModule_1.default.query().where({});
            let user_permissions = await Permission_1.default.query()
                .preload('module')
                .where({ role_id: user?.role_id });
            user_permissions = user_permissions.map(y => {
                let module = modules.find(x => x.id === y.module_id);
                return {
                    module: module?.name,
                    is_read: y.is_read,
                    is_write: y.is_write,
                    is_delete: y.is_delete,
                    is_update: y.is_update,
                    slug: module?.slug,
                    parent_id: module?.parent_id
                };
            });
            const token = await auth.use('api').generate(user, {
                expiresIn: user.is_new_user ? '20m' : '12hours',
            });
            let obj = {
                name: user.name,
                email: user.email,
                role: user.role.slug,
                token: token,
                id: user.id,
                new_user: user.is_new_user ? true : false,
                user_permissions: user_permissions
            };
            await UserSession_1.default.create({
                user_id: user.id,
                device_info: device,
                location: location,
                user_ip: request.ip(),
                is_logged_out: false,
                signin_at: (0, moment_1.default)().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
            });
            return response.json(obj);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async forgotPassword({ request, response }) {
        try {
            const { email } = request.all();
            const rules = {
                email: 'required|max:150|email',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            const user = await User_1.default.query().where('email', email).first();
            if (!user) {
                return response.badRequest({
                    message: 'No registered user found for the given email',
                });
            }
            if (user && !user.is_active) {
                return response.badRequest({ message: 'User is disabled, Please contact admin' });
            }
            let token = (0, utils_1.generateRandomToken)(32);
            user.reset_token = token;
            await user.save();
            let encryptedToken = Encryption_1.default.encrypt(`${user.email}___${token}`);
            let url = process.env.FRONTEND_URL + '/reset-password?token=' + encryptedToken;
            Mail_1.default.sendLater((message) => {
                message
                    .from('noreply@scube.me')
                    .to(user.email)
                    .subject('ATD : Reset Password ')
                    .htmlView('forgot_password', { url: url, user: user });
            });
            return response.json({ message: 'Reset instructions sent to email!.' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async resetPassword({ request, response }) {
        try {
            const { token, password } = request.all();
            const rules = {
                password: 'required|min:8|max:14|confirmed',
                token: 'required|string',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let tokenDecrypt = Encryption_1.default.decrypt(token);
            if (!tokenDecrypt) {
                return response.badRequest({ message: 'Invalid token' });
            }
            const [email, reset_token] = String(tokenDecrypt).split('___');
            if (!email || !reset_token) {
                return response.badRequest({ message: 'Invalid token' });
            }
            const user = await User_1.default.query()
                .where('email', email)
                .where('reset_token', reset_token)
                .first();
            if (!user) {
                return response.badRequest({
                    message: `Either token is expired or email isn't registered`,
                });
            }
            if (user && !user.is_active) {
                return response.badRequest({ message: 'User is disabled, Please contact admin' });
            }
            user.password = password;
            user.is_new_user = false;
            user.reset_token = null;
            await user.save();
            return response.json({ message: 'Password has been reset successfully.' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async updatePassword({ auth, request, response }) {
        try {
            const { password } = request.all();
            const rules = {
                password: 'required|min:8|max:14|confirmed',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            const user = auth.user;
            if (!user.is_new_user) {
                return response.badRequest({ message: `User not allowed to update the password` });
            }
            user.password = password;
            user.is_new_user = false;
            await user.save();
            await user.load('role');
            const token = await auth.use('api').generate(user, {
                expiresIn: '12hours',
            });
            let obj = {
                name: user.name,
                email: user.email,
                role: user.role.slug,
                token: token,
                id: user.id,
                new_user: false,
            };
            return response.json(obj);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async logout({ auth, response }) {
        try {
            let userSession = await UserSession_1.default.query()
                .where('user_id', auth.user.id)
                .andWhere('is_logged_out', false)
                .first();
            if (userSession) {
                userSession.is_logged_out = true;
                userSession.last_access_on = (0, moment_1.default)()
                    .utcOffset('+05:30')
                    .format('YYYY-MM-DD HH:mm:ss');
                await userSession.save();
            }
            await auth.use('api').revoke();
            return response.send({ message: 'User token revoked successfully.' });
        }
        catch (exception) {
            return response.unauthorized({ message: 'Token not found' });
        }
    }
}
exports.default = AuthController;
//# sourceMappingURL=AuthController.js.map