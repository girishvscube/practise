import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FuelCapacity from 'App/Models/FuelCapacity'
import Validator from 'validatorjs'

export default class FuelCapacitiesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await FuelCapacity.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await FuelCapacity.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let fuelcapacity = ctx.request.fuelcapacity as FuelCapacity
        return await this.save(ctx, fuelcapacity)
    }

    public async destroy(ctx) {
        try {
            let fuelcapacity = ctx.request.fuelcapacity as FuelCapacity
            await fuelcapacity.delete()
            if (fuelcapacity.$isDeleted) {
                return ctx.response.json({ message: 'Fuel Capacity Record Deleted' })
            } else {
                return ctx.response.json({ message: 'Fuel Capacity Record Deletion Failed' })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: FuelCapacity | null = null
    ) {
        try {
            let data = request.only(['name', 'capacity'])
            let rules = {
                name: 'required',
                capacity: 'required|numeric',
            }
            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            let fuel_capacity = record
            if (record === null) {
                fuel_capacity = new FuelCapacity()
            }
            fuel_capacity!.name = data.name
            fuel_capacity!.capacity = data.capacity
            fuel_capacity = await fuel_capacity!.save()
            return response.json({
                message: ` Fuel Capacity ${record === null ? 'Added' : 'Updated'}!`,
                id: fuel_capacity.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
