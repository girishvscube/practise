import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LeadStatus from 'App/Models/LeadStatus'
import Validator from 'validatorjs'

export default class LeadStatusesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await LeadStatus.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await LeadStatus.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let leadstatus = ctx.request.leadstatus as LeadStatus
        return await this.save(ctx, leadstatus)
    }

    public async destroy(ctx) {
        try {
            let leadstatus = ctx.request.leadstatus as LeadStatus
            await leadstatus.delete()
            if (leadstatus.$isDeleted) {
                return ctx.response.json({ message: 'Status Deleted' })
            } else {
                return ctx.response.json({ message: 'Status Deletion Failed' })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: LeadStatus | null = null
    ) {
        try {
            let data = request.only(['name', 'color'])
            let rules = {
                name: 'required',
                color: 'string',
            }
            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            let lead_status = record
            if (record === null) {
                lead_status = new LeadStatus()
            }
            lead_status!.name = data.name.toUpperCase().replace(' ', '_')
            lead_status!.color = data.color
            lead_status = await lead_status!.save()
            return response.json({
                message: ` Status ${record === null ? 'Added' : 'Updated'}!`,
                id: lead_status.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
