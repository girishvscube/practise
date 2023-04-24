import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ParkingStation from 'App/Models/ParkingStation'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class ParkingStationsController {
    /**
     * @response
     */
    public async dropdown({ response }: HttpContextContract) {
        try {
            let data = await ParkingStation.dropdown()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    /**
     * @request
     * @response
     */
    public async index({ request, response }: HttpContextContract) {
        try {
            let data = await ParkingStation.listing(request.qs())
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
            let parkingstation: any = await ParkingStation.query()
                .where('id', request.param('id'))
                .first()
                .then((serialize) => serialize?.toJSON())

            if (!parkingstation) {
                return response.notFound({ message: `Parking Station Not Found` })
            }

            return response.json(parkingstation)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { parkingstation } = ctx.request
        return this.save(ctx, parkingstation)
    }

    /**
     * @param ctx
     */
    public async updateStatus(ctx) {
        const { parkingstation } = ctx.request
        let data = ctx.request.body()
        const rules: any = {
            is_active: 'required|boolean',
        }
        const validation = new Validator(data, rules)
        if (validation.fails()) {
            return ctx.response.badRequest(validation.errors.errors)
        }
        parkingstation.is_active = data.is_active
        await parkingstation.save()
        return ctx.response.json({
            message: `Parking Station is ${data.is_active ? 'Restored' : 'Deleted'}`,
        })
    }

    private async save(
        { request, response }: HttpContextContract,
        record: ParkingStation | null = null
    ) {
        try {
            const data = request.only([
                'station_name',
                'capacity',
                'address',
                'city',
                'pincode',
                'state',
            ]) as ParkingStation
            const rules: any = {
                station_name: 'required|max:150',
                capacity: 'required|numeric',
                address: 'required|max:255',
                city: 'required',
                pincode: 'required|numeric|min:100000|max:999999',
                state: 'required',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let parkingstation: any = record
            if (record === null) {
                parkingstation = new ParkingStation()
            }
            each(data, (value, key) => {
                parkingstation[key] = value
            })
            await parkingstation.save()
            response.json({
                message: `Parking Station ${record ? 'Updated' : 'Added'} Successfully`,
            })
        } catch (exception) {
            if (exception.message && exception.message.includes('ER_DUP_ENTRY')) {
                return response.internalServerError({
                    message: 'Parking Station name already present!',
                })
            }
            return response.internalServerError({ message: exception.message })
        }
    }
}
