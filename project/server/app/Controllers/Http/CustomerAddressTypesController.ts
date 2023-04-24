import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CustomerAddressType from 'App/Models/CustomerAddressType'
import Validator from 'validatorjs'

export default class CustomerAddressTypesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await CustomerAddressType.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await CustomerAddressType.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let customeraddresstype = ctx.request.customeraddresstype as CustomerAddressType
        return await this.save(ctx, customeraddresstype)
    }

    public async destroy(ctx) {
        let customeraddresstype = ctx.request.customeraddresstype as CustomerAddressType
        await customeraddresstype.delete()
        if (customeraddresstype.$isDeleted) {
            customeraddresstype.log(ctx.auth.user, {
                message: 'Address Type Deleted!',
                type: 'ACTION',
            })
            return ctx.response.json({ message: 'Address Type Deleted!' })
        } else {
            customeraddresstype.log(ctx.auth.user, {
                message: 'Address Type Deletion Failed!',
                type: 'ACTION',
            })
            return ctx.response.json({ message: 'Address Type Deletion Failed!' })
        }
    }

    private async save(
        { request, auth, response }: HttpContextContract,
        record: CustomerAddressType | null = null
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
            let customer_address_type = record
            if (record === null) {
                customer_address_type = new CustomerAddressType()
            }
            customer_address_type!.name = data.name
            customer_address_type = await customer_address_type!.save()
            customer_address_type.log(auth.user, {
                message: `Address Type ${record === null ? 'Added' : 'Updated'}!`,
                type: 'INFO',
            })

            return response.json({
                message: `Address Type ${record === null ? 'Added' : 'Updated'}!`,
                id: customer_address_type.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
