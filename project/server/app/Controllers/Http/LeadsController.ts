import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LEAD_SOURCE } from 'App/Helpers/leadSource'
import { LEAD_STATUS } from 'App/Helpers/leadStatus'
import Lead from 'App/Models/Lead'
import User from 'App/Models/User'
import Validator from 'validatorjs'
const { each } = require('lodash')
import moment from 'moment'

export default class LeadsController {
    /**
     * Count of lead: total, converted, not interested
     * @param request
     * @param response
     */
    public async count({ request, response }: HttpContextContract) {
        try {
            let data = await Lead.count(request.qs())
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param response
     */
    public async options({ response }: HttpContextContract) {
        return response.json({ status: LEAD_STATUS, source: LEAD_SOURCE })
    }

    /**
     * @ctx
     */
    public async index({ request, response, auth }) {
        try {
            let user: any = await User.query().where('id', auth.user.id).preload('role').first()
            let data = await Lead.listing(request, user)
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    /**
     * @param request
     * @param response
     */
    public async show({ request, response }) {
        try {
            let lead: any = await Lead.query()
                .preload('user', (query) => {
                    query.select('name')
                })
                .preload('userObj', (query) => {
                    query.select('name as created_by')
                })
                .where('id', request.param('id'))
                .first()

            if (!lead) {
                return response.notFound({ message: `Lead Not Found` })
            }

            lead.logs = await lead.getLogs()

            return response.json(lead)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { lead } = ctx.request
        return this.save(ctx, lead)
    }

    /**
     * @param ctx
     */
    public async updateStatus({ request, response, auth }) {
        try {
            const lead = request.lead as Lead
            const data = request.only(['status', 'assigned_to', 'callback_time', 'notes'])

            const rules: any = {
                status: 'required',
                notes: 'required|max:500',
            }

            if (data.status === 'CALL_BACK') {
                rules['callback_time'] = 'required|date'
            }

            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            lead.status = data.status

            await lead.save()
            await Promise.all([
                lead.log(auth.user, { message: data.notes, type: 'NOTE' }),
                lead.log(auth.user, {
                    message: `<strong>${auth.user.name}</strong> modified the status to <span>${data.status}</span>`,
                    type: 'STATUS',
                }),
            ])

            return response.json({ message: `Status changed to ${lead.status}` })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async reassignLeadRequest({ request, response, auth }) {
        try {
            const lead = request.lead as Lead
            const rules: any = {
                notes: 'required|max:500',
            }
            const data = request.only(['notes'])

            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            lead.is_reassign_req = true
            lead.status = 'EXE_CANCELLED'
            lead.re_assign_notes = data.notes
            lead.assigned_to = null
            lead.re_assign_date = moment().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss')

            await lead.save()

            await lead.log(auth.user, { message: `request for lead re-assign`, type: 'ACTION' })
            await lead.log(auth.user, { message: data.notes, type: 'NOTE' })

            response.json({ message: 'Re-assign requested is created!' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async assignLead({ request, response, auth }) {
        try {
            const lead = request.lead as Lead
            const data = request.only(['assigned_to'])
            const rules = {
                assigned_to: 'required|numeric',
            }

            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let user = await User.find(request.body().assigned_to)
            if (!user) {
                return response.badRequest({ message: 'Sales Executive Doesnt exists' })
            }
            lead.assigned_to = request.body().assigned_to
            lead.is_reassign_req = false
            lead.status = 'ASSIGNED'
            lead.re_assign_notes = ''
            lead.re_assign_date = null
            await lead.save()

            await lead.log(auth.user, {
                message: `assigned to ${user.name}`,
                type: 'ACTION',
            })

            response.json({ message: `Lead is assigned to ${user.name}.` })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    private async save({ request, response, auth }, record: Lead | null = null) {
        try {
            const data = request.only([
                'company_name',
                'company_phone',
                'email',
                'contact_person_name',
                'contact_person_phone',
                'industry_type',
                'fuel_usage_per_month',
                'source',
                'assigned_to',
                'address',
                'city',
                'state',
                'pincode',
                'is_reassign_req',
                'callback_time',
            ]) as Lead
            const rules: any = {
                company_name: 'required|max:100',
                company_phone: 'required|max:10|min:10',
                email: 'email|max:225',
                contact_person_name: 'required|max:100',
                contact_person_phone: 'max:10|min:10',
                industry_type: 'required|string',
                fuel_usage_per_month: 'numeric',
                source: 'required',
                address: 'max:500',
                city: 'max:50',
                state: 'max:100',
                pincode: 'max:6|min:6',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            if (auth) data.status = data.assigned_to ? 'ASSIGNED' : 'UN_ASSIGNED'

            let lead: any = record
            if (record === null) {
                lead = new Lead()
                lead.created_by = auth.user.id
            }
            each(data, (value, key) => {
                if (value) lead[key] = value
            })
            await lead.save()
            response.json({
                message: `Lead ${record ? 'Updated' : 'Created'} Successfully`,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
