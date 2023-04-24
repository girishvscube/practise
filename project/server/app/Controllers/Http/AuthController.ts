import User from 'App/Models/User'
import Validator from 'validatorjs'
import Hash from '@ioc:Adonis/Core/Hash'
import Mail from '@ioc:Adonis/Addons/Mail'
import Encryption from '@ioc:Adonis/Core/Encryption'
import { generateRandomToken } from 'App/Helpers/utils'
import UserSession from 'App/Models/UserSession'
import moment from 'moment'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'
import RoleModule from 'App/Models/RoleModule'

export default class AuthController {
    /**
     * USER LOGIN
     * @param request
     * @param response
     * @param auth
     */
    async login({ auth, request, response, location, device }) {
        try {
            const { email, password } = request.all()

            const rules = {
                email: 'required|max:150|email',
                password: 'required|min:8|max:14',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            const user = await User.query().where('email', email).preload('role').first()

            if (!user) {
                return response.badRequest({
                    message: 'No registered user found for the given email',
                })
            }

            if (user && !user.is_active) {
                return response.badRequest({
                    message: 'User is disabled to login Please contact admin',
                })
            }

            if (!(await Hash.verify(user.password, password))) {
                return response.badRequest({ message: 'Invalid credentials' })
            }


            let modules = await RoleModule.query().where({})
            let user_permissions: any = await Permission.query()
                .preload('module')
                .where({ role_id: user?.role_id })

            user_permissions = user_permissions.map(y => {
                let module = modules.find(x => x.id === y.module_id)
                return {
                    module: module?.name,
                    is_read: y.is_read,
                    is_write: y.is_write,
                    is_delete: y.is_delete,
                    is_update: y.is_update,
                    slug: module?.slug,
                    parent_id: module?.parent_id
                }
            })
                
            const token = await auth.use('api').generate(user, {
                expiresIn: user.is_new_user ? '20m' : '12hours',
            })
            let obj = {
                name: user.name,
                email: user.email,
                role: user.role.slug,
                token: token,
                id: user.id,
                new_user: user.is_new_user ? true : false,
                user_permissions:user_permissions
            }
            await UserSession.create({
                user_id: user.id,
                device_info: device,
                location: location,
                user_ip: request.ip(),
                is_logged_out: false,
                signin_at: moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss'),
            })
            return response.json(obj)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * FORGOT PASSWORD
     * @param request
     * @param response
     */
    async forgotPassword({ request, response }) {
        try {
            const { email } = request.all()

            const rules = {
                email: 'required|max:150|email',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            const user = await User.query().where('email', email).first()

            if (!user) {
                return response.badRequest({
                    message: 'No registered user found for the given email',
                })
            }

            if (user && !user.is_active) {
                return response.badRequest({ message: 'User is disabled, Please contact admin' })
            }

            let token = generateRandomToken(32)

            user.reset_token = token
            await user.save()
            let encryptedToken = Encryption.encrypt(`${user.email}___${token}`)
            let url = process.env.FRONTEND_URL + '/reset-password?token=' + encryptedToken
            Mail.sendLater((message) => {
                message
                    .from('noreply@scube.me')
                    .to(user.email)
                    .subject('ATD : Reset Password ')
                    .htmlView('forgot_password', { url: url, user: user })
            })

            return response.json({ message: 'Reset instructions sent to email!.' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * UPDATE PASSWORD USING FORGOT PASSWORD
     * @param request
     * @param response
     */
    async resetPassword({ request, response }) {
        try {
            const { token, password } = request.all()

            const rules = {
                password: 'required|min:8|max:14|confirmed',
                token: 'required|string',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            let tokenDecrypt = Encryption.decrypt(token)

            if (!tokenDecrypt) {
                return response.badRequest({ message: 'Invalid token' })
            }
            const [email, reset_token] = String(tokenDecrypt).split('___')

            if (!email || !reset_token) {
                return response.badRequest({ message: 'Invalid token' })
            }

            const user = await User.query()
                .where('email', email)
                .where('reset_token', reset_token)
                .first()

            if (!user) {
                return response.badRequest({
                    message: `Either token is expired or email isn't registered`,
                })
            }

            if (user && !user.is_active) {
                return response.badRequest({ message: 'User is disabled, Please contact admin' })
            }

            user.password = password
            user.is_new_user = false
            user.reset_token = null

            await user.save()
            return response.json({ message: 'Password has been reset successfully.' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * UPDATE USER PASSWORD ON FIRST TIME LOGIN
     * @param request
     * @param response
     */
    async updatePassword({ auth, request, response }) {
        try {
            const { password } = request.all()

            const rules = {
                password: 'required|min:8|max:14|confirmed',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            const user = auth.user
            if (!user.is_new_user) {
                return response.badRequest({ message: `User not allowed to update the password` })
            }
            user.password = password
            user.is_new_user = false
            await user.save()

            await user.load('role')
            const token = await auth.use('api').generate(user, {
                expiresIn: '12hours',
            })

            let obj = {
                name: user.name,
                email: user.email,
                role: user.role.slug,
                token: token,
                id: user.id,
                new_user: false,
            }
            return response.json(obj)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * REVOKE USER ACCESS TOKEN ON LOGOUT
     * @param request
     * @param response
     */
    async logout({ auth, response }: HttpContextContract) {
        try {
            let userSession = await UserSession.query()
                .where('user_id', auth.user!.id)
                .andWhere('is_logged_out', false)
                .first()
            if (userSession) {
                userSession.is_logged_out = true
                userSession.last_access_on = moment()
                    .utcOffset('+05:30')
                    .format('YYYY-MM-DD HH:mm:ss')
                await userSession.save()
            }
            await auth.use('api').revoke()
            return response.send({ message: 'User token revoked successfully.' })
        } catch (exception) {
            return response.unauthorized({ message: 'Token not found' })
        }
    }
}
