import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import OrderStatus from 'App/Models/OrderStatus'
import Validator from 'validatorjs'

export default class OrderStatusesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await OrderStatus.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await OrderStatus.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let orderstatus = ctx.request.orderstatus as OrderStatus
        return await this.save(ctx, orderstatus)
    }

    public async destroy(ctx) {
        try {
            let orderstatus = ctx.request.orderstatus as OrderStatus
            await orderstatus.delete()
            if (orderstatus.$isDeleted) {
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
        record: OrderStatus | null = null
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
            let order_status = record
            if (record === null) {
                order_status = new OrderStatus()
            }
            order_status!.name = data.name.toUpperCase().replace(' ', '_')
            order_status!.color = data.color
            order_status = await order_status!.save()
            return response.json({
                message: ` Status ${record === null ? 'Added' : 'Updated'}!`,
                id: order_status.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
