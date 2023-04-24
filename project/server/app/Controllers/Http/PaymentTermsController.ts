import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PaymentTerm from 'App/Models/PaymentTerm'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class PaymentTermsController {
    /**
     * @param request
     * @param response
     */
    public async index({ response }: HttpContextContract) {
        try {
            let data = await PaymentTerm.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await PaymentTerm.query().where('id', request.params().id).first()
            return response.json(data)
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
     * @param ctx
     */
    public async update(ctx) {
        const { paymentterm } = ctx.request
        return this.save(ctx, paymentterm)
    }

    private async save(
        { request, response }: HttpContextContract,
        record: PaymentTerm | null = null
    ) {
        try {
            let data = request.only(['name', 'rules']) as PaymentTerm
            let rules = {
                name: 'required|max:50',
                rules: 'required',
            }
            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let payment_term: any = record
            if (record === null) {
                payment_term = new PaymentTerm()
            }
            each(data, (value, key) => {
                payment_term[key] = value
            })
            await payment_term.save()
            response.json({
                message: `Payment Term ${record ? 'Updated' : 'Created'} Successfully`,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
