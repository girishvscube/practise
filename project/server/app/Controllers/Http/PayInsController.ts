import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BankAccount from 'App/Models/BankAccount'
import CashInHand from 'App/Models/CashInHand'
import Order from 'App/Models/Order'
import PayIn from 'App/Models/PayIn'
import PayInInvoice from 'App/Models/PayInInvoice'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class PayInsController {
    public async getInvoiceByCustId({ request, response }: HttpContextContract) {
        let id = request.params().id
        let data = await Order.query()
            .preload('customer')
            .where('customer_id', id)
            .where('status', 'DELIVERED')
            .whereNot('payment_status', 'PAID')
        return response.json(data)
    }

    public async index({ request, response }: HttpContextContract) {
        try {
            let data = await PayIn.listing(request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let id = request.params().id
            let data = await PayIn.query()
                .preload('customer', (q) => q.select('*'))
                .where('id', id)
                .first()

            let listOfInvoice = await PayInInvoice.query()
                .preload('payin', (q) => q.select('*'))
                .preload('order', (q) => q.select('*'))
                .where('pay_in_id', id)

            return response.json({
                payin: data,
                payin_invoices: listOfInvoice,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            return await this.save(ctx)
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
        }
    }

    public async update(ctx) {
        try {
            let payin = ctx.request.payin as PayIn
            return await this.save(ctx, payin)
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
        }
    }

    private async save(
        { request, auth, response }: HttpContextContract,
        record: PayIn | null = null
    ) {
        let data = request.only([
            'customer_id',
            'bank_account_id',
            'pay_in_date',
            'notes',
            'invoices',
        ]) as any
        let rules = {
            customer_id: 'required|numeric',
            bank_account_id: 'required',
            pay_in_date: 'required|date',
        }

        if (record === null) {
            rules['invoices'] = 'required|array'
            rules['invoices.*.id'] = 'required|numeric'
            rules['invoices.*.amount'] = 'required|numeric'
        }

        const validation = new Validator(request.all(), rules)
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors)
        }

        let bank_acc = await BankAccount.findOrFail(data.bank_account_id)
        let total_amt = 0
        if (data.invoices) {
            for (let index = 0; index < data.invoices.length; index++) {
                const el = data.invoices[index]
                let order = await Order.query().where('id', el.id).first()
                if (order === null) {
                    return response.badRequest({ message: `${el.id} is not present!` })
                } else {
                    order.balance -= el.amount
                    if (order.balance < 0.9) {
                        order.balance = 0
                    }
                    order.payment_status = order.balance === 0 ? 'PAID' : 'PARTIALLY_PAID'
                    total_amt += el.amount
                    order = await order.save()
                    await order.log(auth.user, {
                        message: `Amount: <strong>${el.amount}</strong> was <strong>${order.payment_status}</strong> for Order: <strong>${order.id}</strong>`,
                    })
                }
            }
        }
        let payin = record as any
        if (record === null) {
            payin = new PayIn()
            payin.no_of_invoices = data.invoices.length
            payin.amount = total_amt
        }

        each(data, (value, key) => {
            payin[key] = value
        })

        payin = await payin.save()
        if (bank_acc!.account_type === 'Cash In Hand' && record === null) {
            let cash_in_hands = new CashInHand()
            cash_in_hands.type = 'Pay In'
            cash_in_hands.pay_in_id = payin.id
            cash_in_hands.customer_id = payin.customer_id
            cash_in_hands.adjustment_date = payin.pay_in_date
            cash_in_hands.amount = payin.amount
            await cash_in_hands.save()
            await cash_in_hands.log(auth.user, {
                message: `Pay in:<strong>${payin.id}</strong> with amount <strong>${payin.amount}</strong>`,
            })
        }

        let payin_invoices: any[] = []

        if (record === null) {
            for (let index = 0; index < data.invoices.length; index++) {
                const el = data.invoices[index]
                let payinInvoice = await PayInInvoice.query()
                    .where('order_id', el.id)
                    .where('pay_in_id', payin.id)
                    .first()
                if (payinInvoice === null) {
                    payinInvoice = new PayInInvoice()
                }
                payinInvoice.pay_in_id = payin.id
                payinInvoice.order_id = el.id
                payinInvoice.amount = el.amount

                payinInvoice = await payinInvoice.save()
                payin_invoices.push(payinInvoice.id)
            }
        }

        return response.json({
            message: `Pay In ${record === null ? 'Added' : 'Updated'} Successfully`,
            payin_id: payin.id,
            payin_invoices: payin_invoices,
        })
    }
}
