import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TimeSlot from 'App/Models/TimeSlot'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class TimeSlotsController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await TimeSlot.listing()
            return response.json(data)
        } catch (exception) {
            response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await TimeSlot.query().where('id', request.params().id)
            return response.json(data)
        } catch (exception) {
            response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { timeslot } = ctx.request
        return this.save(ctx, timeslot)
    }

    public async destroy({ request, response }: HttpContextContract) {
        try {
            let timeslot = request.params().timeslot as TimeSlot
            await timeslot.delete()
            if (timeslot.$isDeleted) {
                return response.json({ message: 'Timeslot deleted!' })
            } else {
                return response.internalServerError({
                    message: 'Something went wrong while deleting timeslot',
                })
            }
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    private async save({ request, response }: HttpContextContract, record: TimeSlot | null = null) {
        try {
            let data = request.only(['start', 'end']) as TimeSlot
            let rules = {
                start: 'required',
                end: 'required',
            }
            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let time_slot: any = record
            if (record === null) {
                time_slot = new TimeSlot()
            }
            each(data, (value, key) => {
                time_slot[key] = value
            })
            await time_slot.save()
            response.json({
                message: `Time Slot ${record ? 'Updated' : 'Created'} Successfully`,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
