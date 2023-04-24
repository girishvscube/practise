import Validator from 'validatorjs'
const { each } = require('lodash')
import { generateRandomToken, sendTempPassword } from 'App/Helpers/utils'
import User from 'App/Models/User'
import Role from 'App/Models/Role'
import UserSession from 'App/Models/UserSession'
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { toS3 } from 'App/Helpers/upload'
import Hash from '@ioc:Adonis/Core/Hash'
import Log from 'App/Models/Log'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import moment from 'moment'

export default class UserController {
    /**
     * USERS LIST
     * @param request
     * @param response
     */
    public async index({ request, response }) {
        try {
            const users = await User.listing(request)
            const [total_users] = await User.query().count('* as total')
            return response.send({
                status: true,
                data: users,
                total_users: total_users.$extras['total'],
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * USER CREATE
     * @param ctx
     */
    public async store(ctx) {
        return this.save(ctx)
    }

    /**
     * USER UPDATE
     * @param ctx
     */
    public async update(ctx) {
        const { user } = ctx.request
        return this.save(ctx, user)
    }

    public async save({ request, response, auth }, record: any = null) {
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
        ])
        const rules: any = {
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
        }

        if (request.body().role_id) {
            let role: any = await Role.query().where('id', request.body().role_id).first()
            if (role && ['sales_manager', 'sales_executive'].includes(role.slug)) {
                rules['bank_details'] = 'required'
                rules['bank_details.bank_name'] = 'required|string|max:100'
                rules['bank_details.account_no'] = 'required|integer'
                rules['bank_details.account_name'] = 'required|string|max:100'
                rules['bank_details.ifsc_code'] = 'required|string|max:11'
            }
        }
        let body = request.body()
        if (body.bank_details) {
            body.bank_details = JSON.parse(body.bank_details)
        }
        const validation = new Validator(body, rules)

        if (validation.fails()) {
            return response.badRequest(validation.errors.errors)
        }

        const uploadSchema = schema.create({
            // profile image
            user_image: schema.file.optional({
                size: '5mb',
                extnames: ['jpeg', 'jpg'],
            }),
            // driving license
            user_dl_image: schema.file.optional({
                size: '5mb',
                extnames: ['pdf'],
            }),
            // bank check
            user_check_image: schema.file.optional({
                size: '5mb',
                extnames: ['pdf'],
            }),
        })

        const payload = await request.validate({ schema: uploadSchema })

        if (payload.user_image) {
            const fileName = `${cuid()}.${payload.user_image.extname}`
            await payload.user_image.move(Application.tmpPath('uploads'), {
                name: fileName,
            })
            data['image'] = await toS3(Application.tmpPath('uploads') + '/' + fileName)
        }

        if (payload.user_dl_image) {
            const fileName = `${cuid()}.${payload.user_dl_image.extname}`
            await payload.user_dl_image.move(Application.tmpPath('uploads'), {
                name: fileName,
            })
            data['dl_image'] = await toS3(Application.tmpPath('uploads') + '/' + fileName)
        }

        if (payload.user_check_image) {
            const fileName = `${cuid()}.${payload.user_check_image.extname}`
            await payload.user_check_image.move(Application.tmpPath('uploads'), {
                name: fileName,
            })
            data['bank_details']['check_image'] = await toS3(
                Application.tmpPath('uploads') + '/' + fileName
            )
        }

        const images: any = []
        // additional supported documents
        if (request.files('images')) {
            const docs = request.files('images', {
                size: '5mb',
                extnames: ['pdf'],
            })
            for (let i = 0; i < docs.length; i++) {
                if (docs[i].isValid) {
                    const fileName = `${cuid()}.${docs[i].extname}`
                    await docs[i].move(Application.tmpPath('uploads'), {
                        name: fileName,
                    })

                    let url = await toS3(Application.tmpPath('uploads') + '/' + fileName)
                    images.push({ label: JSON.parse(request.body().labels)[i], url: url })
                }
            }
        }

        if (images.length) {
            data['images'] = images
        }

        if (request.body().old_files && record) {
            let old_files = JSON.parse(request.body().old_files)
            data['images'] = [
                ...(Array.isArray(data['images']) ? data['images'] : []),
                ...old_files,
            ]
        }

        const existingUserByEmail = await User.query().where('email', data.email).first()

        let user: any = record
        let tempPassword = ''
        if (record === null) {
            user = new User()
            tempPassword = generateRandomToken(9)
            user.password = tempPassword
        }

        if (existingUserByEmail && existingUserByEmail.id !== user.id) {
            if (existingUserByEmail.email.toLowerCase() === data.email.toLowerCase()) {
                return response.badRequest({
                    message: 'User already exists for given email address.',
                })
            }
        }

        if (record) {
            delete data.email
        }

        if (typeof data.bank_details === 'string') {
            data.bank_details = JSON.parse(data.bank_details)
        }

        each(data, (value, key) => {
            user[key] = value
        })

        await user.save()
        // need to trigger email
        if (!record) {
            sendTempPassword(user, tempPassword)
        }

        if (record) {
            await user.log(auth.user, {
                message: `updated the user details`,
                type: 'ACTION',
            })
        }
        return response.json({ message: `User ${record ? 'Updated' : 'Created'} Successfully` })
    }

    /**
     * @param request
     * @param response
     */
    public async show({ request, response }) {
        try {
            let user: any = await User.query()
                .preload('role', (query) => {
                    query.select('name')
                })
                .where('id', request.param('id'))
                .first()

            if (!user) {
                return response.notFound({ message: `User Not Found` })
            }

            let session = await UserSession.query()
                .where('user_id', user.id)
                .orderBy('id', 'desc')
                .first()

            // user.logs = await user.getLogs()
            user.session = session
            return response.json(user)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * USER ENABLE AND DISABLE
     * @param request
     * @param response
     */
    public async updateStatus({ request, response, auth }) {
        try {
            const { status } = request.body()
            const user = request.user
            user.is_active = status == true ? 1 : 0
            await user.save()
            await user.log(auth.user, {
                message: `updated status as ${status ? 'ACTIVE' : 'INACTIVE '}`,
                type: 'ACTION',
            })
            return response.json({ message: 'Status Update Successfully' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param request
     * @param response
     */
    public async usersDropdown({ request, response }) {
        const { module = '' }: { module: string } = request.qs()
        let names: string[] = []
        if (module === 'leads' || module === 'customers' || module === 'sales') {
            names = [...names, ...['Sales Executive', 'Sales Manager', 'Admin']]
        }

        if (module === 'fleet_management') {
            names = [...names, ...['Driver']]
        }
        let users: any = await User.dropdown(names)
        return response.json(users)
    }

    /**
     * CHANGE USER PASSWORD
     * @param request
     * @param response
     */
    async changePassword({ auth, request, response }) {
        try {
            const user = auth.user
            const rules = {
                password: 'required|min:8|max:14|confirmed',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            const { password } = request.all()

            if (await Hash.verify(user.password, password)) {
                return response.badRequest({ message: 'New password not same as old password!' })
            }

            user.password = password
            await user.save()
            await auth.use('api').revoke()
            return response.send({ message: 'Password Updated successfully.' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * UPDATE USER PROFILE
     * @param request
     * @param response
     */
    async updateProfile({ auth, request, response }) {
        try {
            const user = auth.user
            const rules = {
                name: 'required|max:150',
                phone: 'required|max:10|max:10',
            }

            const { name, phone } = request.all()

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            const uploadSchema = schema.create({
                user_image: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg'],
                }),
            })

            const payload = await request.validate({ schema: uploadSchema })

            if (payload.user_image) {
                const fileName = `${cuid()}.${payload.user_image.extname}`
                await payload.user_image.move(Application.tmpPath('uploads'), {
                    name: fileName,
                })
                user['image'] = await toS3(Application.tmpPath('uploads') + '/' + fileName)
            }

            user.name = name
            user.phone = phone
            await user.save()
            return response.send({ message: 'Profile Updated successfully.' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * GET AUTH USER PROFILE
     * @param request
     * @param response
     */
    async getAuthProfile({ auth, response }) {
        try {
            const user = auth.user
            let obj = {
                name: user.name,
                email: user.email,
                phone: user.phone,
                image: user.image,
            }
            return response.json(obj)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async getLogs({ request, response }: HttpContextContract) {
        try {
            let { page = 1, start_date = '', end_date = '' } = request.qs()
            const limit = 10
            let query = Log.query().where('user_id', request.params().id)

            if (start_date && end_date) {
                let start = moment(start_date)
                    .utcOffset('+05:30')
                    .startOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')
                let end = moment(end_date)
                    .utcOffset('+05:30')
                    .endOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')
                query.where('created_at', '>=', start)
                query.where('created_at', '<=', end)
            }
            let data = await query
            .preload('user', (query) => {
                query.select('id', 'name', 'image')
            })
            .orderBy('id', 'desc')
            .paginate(page, limit)
            return response.json(data)
        } catch (excepiton) {
            return response.internalServerError({ message: excepiton.message })
        }
    }
}
