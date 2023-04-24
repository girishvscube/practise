import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LeadSource from 'App/Models/LeadSource'
import Validator from 'validatorjs'

export default class LeadSourcesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await LeadSource.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await LeadSource.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let leadsource = ctx.request.leadsource as LeadSource
        return await this.save(ctx, leadsource)
    }

    public async destroy(ctx) {
        try {
            let leadsource = ctx.request.leadsource as LeadSource
            await leadsource.delete()
            if (leadsource.$isDeleted) {
                return ctx.response.json({ message: 'Source Deleted ' })
            } else {
                return ctx.response.json({ message: 'Source Deletion Failed' })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: LeadSource | null = null
    ) {
        try {
            let data = request.only(['name'])
            let rules = {
                name: 'required',
            }
            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            let lead_source = record
            if (record === null) {
                lead_source = new LeadSource()
            }
            lead_source!.name = data.name
            lead_source = await lead_source!.save()
            return response.json({
                message: ` Source ${record === null ? 'Added' : 'Updated'}!`,
                id: lead_source.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
