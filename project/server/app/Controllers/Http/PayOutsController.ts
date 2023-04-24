import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BankAccount from 'App/Models/BankAccount'
import CashInHand from 'App/Models/CashInHand'
import PayOut from 'App/Models/PayOut'
import PayOutInvoice from 'App/Models/PayOutInvoice'
import PurchaseOrder from 'App/Models/PurchaseOrder'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class PayOutsController {
    public async getInvoiceBySupplierId({ request, response }: HttpContextContract) {
        try {
            let id = request.params().id
            let data = await PurchaseOrder.query()
                .where('supplier_id', id)
                .where('status', 'PURCHASE_DONE')
                .whereNot('payment_status', 'Paid')
                .select('id', 'purchase_date', 'payment_status', 'total_amount', 'balance')
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async index({ request, response }: HttpContextContract) {
        try {
            let data = await PayOut.listing(request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    public async show({ request, response }: HttpContextContract) {
        try {
            let id = request.params().id
            let data = await PayOut.query().preload('supplier').where('id', id).first()
            let invoices = await PayOutInvoice.query()
                .preload('purchaseorder')
                .where('pay_out_id', id)
            return response.json({ data: data, invoices: invoices })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            await this.save(ctx)
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
        }
    }

    public async update(ctx) {
        try {
            let payout = ctx.request.payout as PayOut
            await this.save(ctx, payout)
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
        }
    }

    private async save(
        { request, auth, response }: HttpContextContract,
        record: PayOut | null = null
    ) {
        try {
            let data = request.only([
                'supplier_id',
                'bank_account_id',
                'payout_date',
                'notes',
                'invoices',
            ])
            let rules = {
                supplier_id: 'required|numeric',
                bank_account_id: 'required',
                payout_date: 'required|date',
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
            let total_amt = 0
            let bank_acc = await BankAccount.findOrFail(data.bank_account_id)
            if (record === null && data.invoices) {
                total_amt = data.invoices.reduce((sum, obj) => sum + obj.amount, 0)
                for (let index = 0; index < data.invoices.length; index++) {
                    const el = data.invoices[index]

                    let po = await PurchaseOrder.query().where('id', el.id).first()
                    if (po === null) {
                        return response.badRequest({
                            message: `PurchaseOrder: ${el.id} Not Found!`,
                        })
                    } else {
                        if (Math.abs(Number(po.balance)) < Math.abs(Number(el.amount))) {
                            return response.badRequest({
                                message: `${el.amount} exceeds balance ${po.balance}`,
                            })
                        } else {
                            po.balance -= el.amount
                            if (po.balance < 0.9) {
                                po.balance = 0
                            }
                            po.payment_status = po.balance === 0 ? 'PAID' : 'PARTIALLY_PAID'

                            await po.log(auth.user, {
                                message: `Amount: <strong>${el.amount}</strong> was <strong>${po.payment_status}</strong> for Purchase Order: <strong>${po.id}</strong>`,
                                type: 'ACTION',
                            })
                        }
                    }
                    await po.save()
                }
            }

            let payout = record as any
            if (record === null) {
                payout = new PayOut()
                payout.amount = total_amt
                payout.no_of_invoices = data.invoices.length
            }
            each(data, (value, key) => {
                payout[key] = value
            })
            payout = await payout.save()
            if (bank_acc!.account_type === 'Cash In Hand') {
                let cash_in_hands = new CashInHand()
                cash_in_hands.type = 'Pay Out'
                cash_in_hands.pay_out_id = payout.id
                cash_in_hands.supplier_id = payout.supplier_id
                cash_in_hands.adjustment_date = payout.pay_in_date
                cash_in_hands.amount = payout.amount
                await cash_in_hands.save()
                await cash_in_hands.log(auth.user, {
                    message: `Pay out:<strong>${payout.id}</strong> with amount <strong>${payout.amount}</strong>`,
                })
            }
            let payout_invoices: any[] = []
            if (record === null && data.invoices) {
                for (let index = 0; index < data.invoices.length; index++) {
                    const el = data.invoices[index]
                    let payoutinvoice = await PayOutInvoice.query()
                        .where('purchase_order_id', el.id)
                        .where('pay_out_id', payout.id)
                        .first()
                    if (payoutinvoice === null) {
                        payoutinvoice = new PayOutInvoice()
                    }
                    payoutinvoice.pay_out_id = payout.id
                    payoutinvoice.purchase_order_id = el.id
                    payoutinvoice.amount = el.amount

                    payoutinvoice = await payoutinvoice.save()
                    payout_invoices.push(payoutinvoice.id)
                }
            }

            return response.json({
                message: `Pay Out ${record === null ? 'Added' : 'Updated'} Successfully`,
                payout_id: payout.id,
                payout_invoices: payout_invoices,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
