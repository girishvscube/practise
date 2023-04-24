import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomerType from 'App/Models/CustomerType'
import Validator from 'validatorjs'

export default class CustomerTypesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await CustomerType.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await CustomerType.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let customertype = ctx.request.customertype as CustomerType
        return await this.save(ctx, customertype)
    }

    public async destroy(ctx) {
        try {
            let customertype = ctx.request.customertype as CustomerType
            await customertype.delete()
            if (customertype.$isDeleted) {
                return ctx.response.json({ message: 'Type Deleted' })
            } else {
                return ctx.response.json({ message: 'Type Deletion failed' })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: CustomerType | null = null
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
            let customer_type = record
            if (record === null) {
                customer_type = new CustomerType()
            }
            customer_type!.name = data.name
            customer_type = await customer_type!.save()
            return response.json({
                message: ` Type ${record === null ? 'Added' : 'Updated'}!`,
                id: customer_type.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
