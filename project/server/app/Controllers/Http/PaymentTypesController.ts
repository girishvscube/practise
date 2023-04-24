import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PaymentType from 'App/Models/PaymentType'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class PaymentTypesController {
    /**
     * @param response
     * @returns PaymentType[]
     */
    public async index({ response }: HttpContextContract) {
        try {
            let data = await PaymentType.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await PaymentType.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let paymenttype = ctx.request.paymenttype as PaymentType
        return await this.save(ctx, paymenttype)
    }

    public async destroy(ctx) {
        try {
            let paymenttype = ctx.request.paymenttype as PaymentType
            if (paymenttype.name === 'Bank Transfer' || paymenttype.name === 'Cash') {
                return ctx.response.badRequest({
                    messge: `Type: ${paymenttype.name} cannot be deleted`,
                })
            }
            await paymenttype.delete()
            if (paymenttype.$isDeleted) {
                return ctx.response.json({ message: `Type: ${paymenttype.name} is deleted` })
            } else {
                return ctx.response.badRequest({ message: 'Failed to delete' })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
        }
    }

    private async save({ request, response }, record: PaymentType | null = null) {
        let data = request.only(['name'])

        let rules = {
            name: 'required',
        }

        const validation = new Validator(request.all(), rules)
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors)
        }

        let payment_type = record
        if (payment_type === null) {
            payment_type = new PaymentType()
        }

        each(data, (value, key) => {
            payment_type![key] = value
        })

        payment_type = await payment_type.save()
        return response.json({
            message: `Payment Type ${record === null ? 'Added' : 'Updated'} Successfully`,
            id: payment_type.id,
        })
    }
}
