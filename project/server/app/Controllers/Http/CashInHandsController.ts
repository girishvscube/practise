import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ADJUSTMENT_TYPE } from 'App/Helpers/cashInHand.constants'
import CashInHand from 'App/Models/CashInHand'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class CashInHandsController {
    public async dropdown({ response }: HttpContextContract) {
        return response.json(ADJUSTMENT_TYPE)
    }
    public async count({ request, response }: HttpContextContract) {
        try {
            let data = await CashInHand.count(request.qs())
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    public async index({ request, response }: HttpContextContract) {
        try {
            let data = await CashInHand.listing(request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let cashinhand = await CashInHand.query()
                .preload('customer', (q) => q.select('*'))
                .preload('expense', (q) => q.select('*'))
                .preload('supplier', (q) => q.select('*'))
                .where('id', request.params().id)
                .first()
            cashinhand!.logs = await cashinhand!.getLogs()
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let cashinhand = ctx.request.cashinhand as CashInHand
        return await this.save(ctx, cashinhand)
    }

    private async save(
        { request, auth, response }: HttpContextContract,
        record: CashInHand | null = null
    ) {
        try {
            let data = request.only(['type', 'amount', 'adjustment_date'])
            let rules = {
                type: 'required',
                amount: 'required|numeric',
                adjustment_date: 'required|date',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let cashInHand = record
            if (cashInHand === null) {
                cashInHand = new CashInHand()
            }
            each(data, (value, key) => {
                cashInHand![key] = value
            })
            if (data.type === 'Cash Decrease' || data.type === 'Pay Out') {
                cashInHand.amount = -data.amount
            }

            cashInHand = await cashInHand.save()
            cashInHand.log(auth.user, {
                message: `Amount: <strong>${data.amount}</strong> </spam>${data.type}</spam> was ${
                    record === null ? 'Added' : 'Updated'
                }`,
                type: 'INFO',
            })
            return response.json({
                message: `${data.type} ${record === null ? 'Added' : 'Updated'}`,
                id: cashInHand.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
