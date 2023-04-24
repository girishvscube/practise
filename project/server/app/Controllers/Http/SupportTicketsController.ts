import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {
    ISSUE_TYPE,
    PRIORITY_LEVEL,
    SUPPORT_TICKET_STATUS,
} from 'App/Helpers/supportTicket.constants'
import { fileUploadToS3 } from 'App/Helpers/upload'
// import Order from 'App/Models/Order'
import SupportTicket from 'App/Models/SupportTicket'
import { DateTime } from 'luxon'
import { schema } from '@ioc:Adonis/Core/Validator'
import Validator from 'validatorjs'
import Notification from 'App/Models/Notification'
import RoleModule from 'App/Models/RoleModule'
const { each } = require('lodash')

export default class SupportTicketsController {
    /**
     * @param response
     */
    public async statusDropdown({ response }: HttpContextContract) {
        return response.json(SUPPORT_TICKET_STATUS)
    }

    /**
     * @param response
     */
    public async priorityDropdown({ response }: HttpContextContract) {
        return response.json(PRIORITY_LEVEL)
    }

    /**
     * @param response
     */
    public async issueTypeDropdown({ response }: HttpContextContract) {
        return response.json(ISSUE_TYPE)
    }

    /**
     * Support Ticket: total, open, closed, unassigned
     * @param request
     * @param response
     */
    public async count({ request, response }: HttpContextContract) {
        try {
            let data = await SupportTicket.count(request.qs())
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param request
     * @param response
     */
    public async index({ request, response }: HttpContextContract) {
        try {
            let data = await SupportTicket.listing(request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async reassignTicketRequest({ request, response, auth }) {
        try {
            const supportticket = request.supportticket as SupportTicket
            const rules: any = {
                notes: 'required|max:500',
            }
            const data = request.only(['notes'])

            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            supportticket.is_reassign_requested = true
            supportticket.status = 'EXE_CANCELLED'
            supportticket.reassign_notes = data.notes
            supportticket.sales_id = null
            supportticket.reassign_date = DateTime.now()

            await supportticket.save()

            await supportticket.log(auth.user, {
                message: `request for support ticket re-assign`,
                type: 'ACTION',
            })
            await supportticket.log(auth.user, { message: data.notes, type: 'NOTE' })

            response.json({ message: 'Re-assign requested is created!' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param request
     * @param response
     */
    public async show({ request, response }) {
        try {
            let data = await SupportTicket.query()
                .preload('assigned_user', (q) => q.select('*'))
                .preload('created_user', (q) => q.select('*'))
                .preload('order', (q) => q.preload('customer', (q) => q.select('*')).select('*'))
                .where('id', request.params().id)
                .first()

            if (!data) {
                return response.notFound({ message: `Purchase order Not Found` })
            }
            data.logs = await data.getLogs()

            return response.json({ support_ticket: data })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async store(ctx: HttpContextContract) {
        return this.save(ctx)
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        let data = ctx.request.supportticket
        return this.save(ctx, data)
    }

    /**
     * @param ctx
     */
    public async updateStatus({ request, response, auth }) {
        try {
            let record = request.supportticket as SupportTicket
            let data = request.only(['status', 'sales_id'])
            let rules = {
                status: 'required',
                notes: 'string|max:500',
            }
            if (data.status === 'OPEN') {
                rules['sales_id'] = 'required|numeric'
            }

            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let roleModule = await RoleModule.query().where('slug', 'support').first()

            await Notification.create({
                module_id: roleModule!.id,
                assignee: auth.user!.id,
                message: `Ticket #${record.id} was assigned to you by ${auth.user!.name}`,
                reference_id: record.id,
                notify_to: data.sales_id,
            })

            each(data, (value, key) => {
                record[key] = value
            })

            await record.save()

            if (data.notes) {
                await record.log(auth.user, { message: data.notes, type: 'NOTE' })
            }

            await record.log(auth.user, {
                message: `<strong>${auth.user.name}</strong> modified the status to <span>${data.status}</span>`,
                type: 'STATUS',
            })

            return response.json({ message: `Status changed to ${data.status}` })
        } catch (exception) {
            return response.internalServerError({ mesasge: exception.message })
        }
    }

    private async save(
        { request, auth, response }: HttpContextContract,
        record: SupportTicket | null = null
    ) {
        try {
            let data = request.only([
                'customer_name',
                'order_id',
                'issue_type',
                'phone',
                'more_info',
                'sales_id',
                'priority',
                'image',
            ]) as SupportTicket
            let rules = {
                customer_name: 'required',
                order_id: 'required|numeric',
                issue_type: 'required',
                phone: 'required|max:10',
                priority: 'required',
            }

            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let imgSchema = schema.create({
                image_file: schema.file.optional({
                    size: '10mb',
                    extnames: ['jpeg', 'jpg', 'jfif'],
                }),
            })

            let payload = await request.validate({ schema: imgSchema })
            if (payload.image_file) {
                data.image = await fileUploadToS3(payload.image_file!.extname, payload.image_file)
            }

            // data.image = await uploadBase64File(data.image)

            let supportTicket: any = record
            if (record === null) {
                supportTicket = new SupportTicket()
                supportTicket.status = 'Unassigned'
            }
            each(data, (value, key) => {
                supportTicket[key] = value
            })

            supportTicket.created_by = auth.user!.id

            await supportTicket.save()
            return response.json({
                message: `Support Ticket ${record ? 'Updated' : 'Created'} Successfully`,
                id: supportTicket.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
