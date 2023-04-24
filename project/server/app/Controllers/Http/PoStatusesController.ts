import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PoStatus from 'App/Models/PoStatus'
import Validator from 'validatorjs'

export default class PoStatusesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await PoStatus.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await PoStatus.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let postatus = ctx.request.postatus as PoStatus
        return await this.save(ctx, postatus)
    }

    public async destroy(ctx) {
        try {
            let postatus = ctx.request.postatus as PoStatus
            await postatus.delete()
            if (postatus.$isDeleted) {
                return ctx.response.json({ message: 'Status Deleted' })
            } else {
                return ctx.response.json({ message: 'Status Deletion Failed' })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge })
        }
    }

    private async save({ request, response }: HttpContextContract, record: PoStatus | null = null) {
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
            let po_status = record
            if (record === null) {
                po_status = new PoStatus()
            }
            po_status!.name = data.name.toUpperCase().replace(' ', '_')
            po_status!.color = data.color
            po_status = await po_status!.save()
            return response.json({
                message: ` Status ${record === null ? 'Added' : 'Updated'}!`,
                id: po_status.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
