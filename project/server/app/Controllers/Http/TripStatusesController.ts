import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TripStatus from 'App/Models/TripStatus'
import Validator from 'validatorjs'

export default class TripStatusesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await TripStatus.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await TripStatus.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let tripstatus = ctx.request.tripstatus as TripStatus
        return await this.save(ctx, tripstatus)
    }

    public async destroy(ctx) {
        try {
            let tripstatus = ctx.request.tripstatus as TripStatus
            await tripstatus.delete()
            if (tripstatus.$isDeleted) {
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
        record: TripStatus | null = null
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
            let trip_status = record
            if (record === null) {
                trip_status = new TripStatus()
            }
            trip_status!.name = data.name.toUpperCase().replace(' ', '_')
            trip_status!.color = data.color
            trip_status = await trip_status!.save()
            return response.json({
                message: ` Status ${record === null ? 'Added' : 'Updated'}!`,
                id: trip_status.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
