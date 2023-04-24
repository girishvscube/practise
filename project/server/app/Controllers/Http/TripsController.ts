import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TRIP_STATUS } from 'App/Helpers/trip.constants'
import Trip from 'App/Models/Trip'
import Validator from 'validatorjs'

export default class TripsController {
    /**
     * @param response
     */
    public async dropdown({ response }: HttpContextContract) {
        return response.json(TRIP_STATUS)
    }
    /**
     * **TRIP**: total, completed, not scheduled
     * @request
     * @response
     */
    public async count({ request, response }: HttpContextContract) {
        try {
            let data = await Trip.count(request.qs())
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
            let data = await Trip.listing(request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async updateStatus({ request, response, auth }) {
        try {
            let trip = request.trip as Trip
            let { status, notes } = request.body()

            const rules: any = {
                status: 'required',
                notes: 'string|max:500',
            }
            const validation = new Validator(request.body(), rules)

            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            trip.status = status
            await trip.save()
            if (notes) {
                await trip.log(auth.user, { message: notes, type: 'NOTE' })
            }
            await trip.log(auth.user, {
                message: `<strong>${auth.user.name}</strong> modified the status to <span>${status}</span>`,
                type: 'STATUS',
            })
            return response.json({ message: `Status changed to ${status}` })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
