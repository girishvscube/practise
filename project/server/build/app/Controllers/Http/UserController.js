"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
const utils_1 = global[Symbol.for('ioc.use')]("App/Helpers/utils");
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const Role_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Role"));
const UserSession_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/UserSession"));
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const upload_1 = global[Symbol.for('ioc.use')]("App/Helpers/upload");
const Hash_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Hash"));
const Log_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Log"));
const moment_1 = __importDefault(require("moment"));
class UserController {
    async index({ request, response }) {
        try {
            const users = await User_1.default.listing(request);
            const [total_users] = await User_1.default.query().count('* as total');
            return response.send({
                status: true,
                data: users,
                total_users: total_users.$extras['total'],
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return this.save(ctx);
    }
    async update(ctx) {
        const { user } = ctx.request;
        return this.save(ctx, user);
    }
    async save({ request, response, auth }, record = null) {
        let data = request.only([
            'name',
            'email',
            'phone',
            'address',
            'city',
            'state',
            'pincode',
            'role_id',
            'image',
            'images',
            'bank_details',
            'dl_image',
        ]);
        const rules = {
            'name': 'required|max:150',
            'email': 'required|max:150|email',
            'phone': 'required|max:15',
            'role_id': 'required',
            'address': 'required|max:500|string',
            'city': 'required|string|max:50',
            'state': 'required|string|max:50',
            'pincode': 'required|string|max:6',
            'image': 'string',
            'images': 'array',
            'images.*.url': 'string',
            'images.*.label': 'string',
        };
        if (request.body().role_id) {
            let role = await Role_1.default.query().where('id', request.body().role_id).first();
            if (role && ['sales_manager', 'sales_executive'].includes(role.slug)) {
                rules['bank_details'] = 'required';
                rules['bank_details.bank_name'] = 'required|string|max:100';
                rules['bank_details.account_no'] = 'required|integer';
                rules['bank_details.account_name'] = 'required|string|max:100';
                rules['bank_details.ifsc_code'] = 'required|string|max:11';
            }
        }
        let body = request.body();
        if (body.bank_details) {
            body.bank_details = JSON.parse(body.bank_details);
        }
        const validation = new validatorjs_1.default(body, rules);
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors);
        }
        const uploadSchema = Validator_1.schema.create({
            user_image: Validator_1.schema.file.optional({
                size: '5mb',
                extnames: ['jpeg', 'jpg'],
            }),
            user_dl_image: Validator_1.schema.file.optional({
                size: '5mb',
                extnames: ['pdf'],
            }),
            user_check_image: Validator_1.schema.file.optional({
                size: '5mb',
                extnames: ['pdf'],
            }),
        });
        const payload = await request.validate({ schema: uploadSchema });
        if (payload.user_image) {
            const fileName = `${(0, Helpers_1.cuid)()}.${payload.user_image.extname}`;
            await payload.user_image.move(Application_1.default.tmpPath('uploads'), {
                name: fileName,
            });
            data['image'] = await (0, upload_1.toS3)(Application_1.default.tmpPath('uploads') + '/' + fileName);
        }
        if (payload.user_dl_image) {
            const fileName = `${(0, Helpers_1.cuid)()}.${payload.user_dl_image.extname}`;
            await payload.user_dl_image.move(Application_1.default.tmpPath('uploads'), {
                name: fileName,
            });
            data['dl_image'] = await (0, upload_1.toS3)(Application_1.default.tmpPath('uploads') + '/' + fileName);
        }
        if (payload.user_check_image) {
            const fileName = `${(0, Helpers_1.cuid)()}.${payload.user_check_image.extname}`;
            await payload.user_check_image.move(Application_1.default.tmpPath('uploads'), {
                name: fileName,
            });
            data['bank_details']['check_image'] = await (0, upload_1.toS3)(Application_1.default.tmpPath('uploads') + '/' + fileName);
        }
        const images = [];
        if (request.files('images')) {
            const docs = request.files('images', {
                size: '5mb',
                extnames: ['pdf'],
            });
            for (let i = 0; i < docs.length; i++) {
                if (docs[i].isValid) {
                    const fileName = `${(0, Helpers_1.cuid)()}.${docs[i].extname}`;
                    await docs[i].move(Application_1.default.tmpPath('uploads'), {
                        name: fileName,
                    });
                    let url = await (0, upload_1.toS3)(Application_1.default.tmpPath('uploads') + '/' + fileName);
                    images.push({ label: JSON.parse(request.body().labels)[i], url: url });
                }
            }
        }
        if (images.length) {
            data['images'] = images;
        }
        if (request.body().old_files && record) {
            let old_files = JSON.parse(request.body().old_files);
            data['images'] = [
                ...(Array.isArray(data['images']) ? data['images'] : []),
                ...old_files,
            ];
        }
        const existingUserByEmail = await User_1.default.query().where('email', data.email).first();
        let user = record;
        let tempPassword = '';
        if (record === null) {
            user = new User_1.default();
            tempPassword = (0, utils_1.generateRandomToken)(9);
            user.password = tempPassword;
        }
        if (existingUserByEmail && existingUserByEmail.id !== user.id) {
            if (existingUserByEmail.email.toLowerCase() === data.email.toLowerCase()) {
                return response.badRequest({
                    message: 'User already exists for given email address.',
                });
            }
        }
        if (record) {
            delete data.email;
        }
        if (typeof data.bank_details === 'string') {
            data.bank_details = JSON.parse(data.bank_details);
        }
        each(data, (value, key) => {
            user[key] = value;
        });
        await user.save();
        if (!record) {
            (0, utils_1.sendTempPassword)(user, tempPassword);
        }
        if (record) {
            await user.log(auth.user, {
                message: `updated the user details`,
                type: 'ACTION',
            });
        }
        return response.json({ message: `User ${record ? 'Updated' : 'Created'} Successfully` });
    }
    async show({ request, response }) {
        try {
            let user = await User_1.default.query()
                .preload('role', (query) => {
                query.select('name');
            })
                .where('id', request.param('id'))
                .first();
            if (!user) {
                return response.notFound({ message: `User Not Found` });
            }
            let session = await UserSession_1.default.query()
                .where('user_id', user.id)
                .orderBy('id', 'desc')
                .first();
            user.session = session;
            return response.json(user);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async updateStatus({ request, response, auth }) {
        try {
            const { status } = request.body();
            const user = request.user;
            user.is_active = status == true ? 1 : 0;
            await user.save();
            await user.log(auth.user, {
                message: `updated status as ${status ? 'ACTIVE' : 'INACTIVE '}`,
                type: 'ACTION',
            });
            return response.json({ message: 'Status Update Successfully' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async usersDropdown({ request, response }) {
        const { module = '' } = request.qs();
        let names = [];
        if (module === 'leads' || module === 'customers' || module === 'sales') {
            names = [...names, ...['Sales Executive', 'Sales Manager', 'Admin']];
        }
        if (module === 'fleet_management') {
            names = [...names, ...['Driver']];
        }
        let users = await User_1.default.dropdown(names);
        return response.json(users);
    }
    async changePassword({ auth, request, response }) {
        try {
            const user = auth.user;
            const rules = {
                password: 'required|min:8|max:14|confirmed',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            const { password } = request.all();
            if (await Hash_1.default.verify(user.password, password)) {
                return response.badRequest({ message: 'New password not same as old password!' });
            }
            user.password = password;
            await user.save();
            await auth.use('api').revoke();
            return response.send({ message: 'Password Updated successfully.' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async updateProfile({ auth, request, response }) {
        try {
            const user = auth.user;
            const rules = {
                name: 'required|max:150',
                phone: 'required|max:10|max:10',
            };
            const { name, phone } = request.all();
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            const uploadSchema = Validator_1.schema.create({
                user_image: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg'],
                }),
            });
            const payload = await request.validate({ schema: uploadSchema });
            if (payload.user_image) {
                const fileName = `${(0, Helpers_1.cuid)()}.${payload.user_image.extname}`;
                await payload.user_image.move(Application_1.default.tmpPath('uploads'), {
                    name: fileName,
                });
                user['image'] = await (0, upload_1.toS3)(Application_1.default.tmpPath('uploads') + '/' + fileName);
            }
            user.name = name;
            user.phone = phone;
            await user.save();
            return response.send({ message: 'Profile Updated successfully.' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async getAuthProfile({ auth, response }) {
        try {
            const user = auth.user;
            let obj = {
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
            };
            return response.json(obj);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async getLogs({ request, response }) {
        try {
            let { page = 1, start_date = '', end_date = '' } = request.qs();
            const limit = 10;
            let query = Log_1.default.query().where('user_id', request.params().id);
            if (start_date && end_date) {
                let start = (0, moment_1.default)(start_date)
                    .utcOffset('+05:30')
                    .startOf('day')
                    .format('YYYY-MM-DD HH:mm:ss');
                let end = (0, moment_1.default)(end_date)
                    .utcOffset('+05:30')
                    .endOf('day')
                    .format('YYYY-MM-DD HH:mm:ss');
                query.where('created_at', '>=', start);
                query.where('created_at', '<=', end);
            }
            let data = await query
                .preload('user', (query) => {
                query.select('id', 'name', 'image');
            })
                .orderBy('id', 'desc')
                .paginate(page, limit);
            return response.json(data);
        }
        catch (excepiton) {
            return response.internalServerError({ message: excepiton.message });
        }
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map