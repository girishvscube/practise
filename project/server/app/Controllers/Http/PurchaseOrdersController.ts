import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { PO_STATUS } from 'App/Helpers/purchaseorder.constants'
import Bowser from 'App/Models/Bowser'
import Order from 'App/Models/Order'
import PurchaseOrder from 'App/Models/PurchaseOrder'
import PurchaseSalesOrder from 'App/Models/PurchaseSalesOrder'
import Trip from 'App/Models/Trip'
import moment from 'moment'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class PurchaseOrdersController {
    public async statusDropdown({ response }: HttpContextContract) {
        return response.json(PO_STATUS)
    }

    public async count({ request, response }: HttpContextContract) {
        try {
            let data = await PurchaseOrder.count(request.qs())
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
            let data = await PurchaseOrder.listing(request.qs())
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
            let purchaseOrder: any = await PurchaseOrder.query()
                .preload('bowser', (query) => query.select('*'))
                .preload('supplier', (query) => query.select('*'))
                // .preload('supplier_payment_term', (query) => query.select('*'))
                .where('id', request.param('id'))
                .first()

            if (!purchaseOrder) {
                return response.notFound({ message: `Purchase order Not Found` })
            }
            purchaseOrder.logs = await purchaseOrder.getLogs()
            return response.json(purchaseOrder)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { purchaseorder } = ctx.request
        return this.save(ctx, purchaseorder)
    }

    /**
     * @param ctx
     */
    public async supplierConfirmation({ request, response, auth }) {
        const purchaseorder = request.purchaseorder as PurchaseOrder
        purchaseorder.is_order_confirmed = true
        purchaseorder.status = 'PO_CONFIRMED'
        await purchaseorder.save()
        await Trip.saveTrip(purchaseorder.id)
        await Promise.all([
            purchaseorder.log(auth.user, { message: `Updated PO as Confirmed`, type: 'ACTION' }),
            purchaseorder.log(auth.user, {
                message: `<strong>${auth.user.name}</strong> modified the status to <span>PO_CONFIRMED</span>`,
                type: 'STATUS',
            }),
        ])
        return response.json({ message: 'PO Confirmed By Supplier' })
    }

    /**
     * @param ctx
     */
    public async updateStatus({ request, response, auth }) {
        const { purchaseorder } = request
        let data = request.body()
        const rules: any = {
            status: 'required',
            notes: 'string|max:500',
        }
        const validation = new Validator(data, rules)

        if (validation.fails()) {
            return response.badRequest(validation.errors.errors)
        }
        purchaseorder.status = data.status
        if (data.notes) {
            await purchaseorder.log(auth.user, { message: data.notes, type: 'NOTE' })
        }
        await purchaseorder.log(auth.user, {
            message: `<strong>${auth.user.name}</strong> modified the status to <span>${data.status}</span>`,
            type: 'STATUS',
        }),
            await purchaseorder.save()
        return response.json({
            message: `Purchase Order status changed to ${data.status}`,
        })
    }

    public async listOfAssossiatedOrdersByPoId({ request, response }: HttpContextContract) {
        try {
            let id = parseInt(request.params().id)
            let data = await PurchaseSalesOrder.query()
                .preload('order')
                .preload('purchase_order')
                .where('po_id', id)
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async assosiateSO({ request, response }: HttpContextContract) {
        let data = request.only(['so_ids'])
        let id = request.params().id
        if (data.so_ids && data.so_ids.length > 0) {
            let fuel_val = await this.checkIsFuelAvailable(id, data.so_ids)
            if (fuel_val.is_fuel_available) {
                // let fuel_left = 0
                // for (let index = 0; index < data.so_ids.length; index++) {
                //     const element = data.so_ids[index]
                //     let order = await Order.query().where('id', element).first()
                //     fuel_left += +order!.fuel_qty
                // }
                // if (fuel_val.fuel_left < fuel_left) {
                //     return response.send({ message: 'Fuel limit exceeds' })
                // }
                for (let index = 0; index < data.so_ids.length; index++) {
                    const element = data.so_ids[index]
                    let pso = await PurchaseSalesOrder.query().where('so_id', element).first()
                    if (pso && pso.po_id !== +id) {
                        return response.badRequest({
                            message: `Order:${element} is already linked to another Purchase Order`,
                        })
                    }
                    if (pso === null) {
                        pso = new PurchaseSalesOrder()
                    }
                    pso.so_id = element
                    pso.po_id = id
                    await pso.save()
                    let order = await Order.findOrFail(pso.so_id)
                    order.status = 'PO_LINKED'
                    await order.save()
                }
                return response.json({ message: 'Order Linked Successfully' })
            } else {
                return response.badRequest({
                    message: `fuel is exceeding by ${Math.abs(fuel_val.fuel_left)}L`,
                })
            }
        } else {
            response.badRequest({ message: 'so_ids needed!' })
        }
    }

    public async listOfConfirmedSO({ request, response }: HttpContextContract) {
        try {
            let { order_type = '', time_slot = '', start_date = '', end_date = '' } = request.qs()
            let query = Order.query()
                .leftJoin('purchase_sales_orders as pso', 'pso.so_id', 'orders.id')
                .where('orders.is_order_confirmed', true)
                .where('orders.is_order_cancelled', false)
                .whereNull('pso.po_id')

            if (start_date && end_date) {
                let start = moment(start_date)
                    .utcOffset('+05:30')
                    .startOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')
                let end = moment(end_date)
                    .utcOffset('+05:30')
                    .endOf('day')
                    .format('YYYY-MM-DD HH:mm:ss')
                query.where('orders.created_at', '>=', start)
                query.where('orders.created_at', '<=', end)
            }

            if (order_type) {
                query.where('orders.order_type', order_type)
            }
            if (time_slot) {
                query.where('orders.time_slot', 'LIKE', `%${time_slot}%`)
            }

            let data = await query.select(
                'orders.id',
                'orders.created_at',
                'orders.order_type',
                'orders.fuel_qty',
                'orders.delivery_date',
                'orders.time_slot'
            )
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async deletePOS({ request, response }) {
        let purchasesalesorder = request.purchasesalesorder as PurchaseSalesOrder
        let order = await Order.findOrFail(purchasesalesorder.so_id)
        order.status = 'ORDER_CONFIRMED'
        await purchasesalesorder.delete()
        if (purchasesalesorder.$isDeleted) {
            return response.json({ message: 'Order is unlinked from Purchase Order' })
        } else {
            return response.internalServerError({
                message: 'Something went wrong while unlinking order',
            })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: PurchaseOrder | null = null
    ) {
        try {
            const data = request.only([
                'supplier_id',
                'bowser_id',
                'fuel_qty',
                'purchase_date',
                'price_per_litre',
                'additional_notes',
            ]) as PurchaseOrder
            const rules: any = {
                supplier_id: 'required|numeric',
                bowser_id: 'required|numeric',
                fuel_qty: 'required|numeric',
                purchase_date: 'required|date',
                price_per_litre: 'required|numeric',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            if (record === null) {
                let bowser = await Bowser.query()
                    .where('id', data.bowser_id)
                    .where('status', 'Available')
                    .first()
                if (!bowser)
                    return response.badRequest({
                        message: 'Bowser not found or already in assigned to another order!',
                    })
                if (data.fuel_qty > bowser!.fuel_capacity - bowser!.fuel_left) {
                    return response.badRequest({ message: 'Bowser capacity exceeding' })
                }
                bowser!.status = 'On Hold'
                await bowser!.save()
            }

            data.total_amount = data.fuel_qty * data.price_per_litre
            data.balance = data.total_amount

            let purchaseorder: any = record
            if (record === null) {
                purchaseorder = new PurchaseOrder()
            }
            each(data, (value, key) => {
                purchaseorder[key] = value
            })
            purchaseorder = await purchaseorder.save()
            response.json({
                message: `Purchase Order ${record ? 'Updated' : 'Created'} Successfully`,
                id: purchaseorder.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async checkIsFuelAvailable(po_id: number, so_ids: number[]) {
        let fuel_qty = 0
        let pos = await PurchaseSalesOrder.query()
            .preload('order', (q) => q.select('fuel_qty'))
            .where('po_id', po_id)

        fuel_qty = pos.reduce(function (accumulator, curValue) {
            return accumulator + +curValue.order.fuel_qty
        }, 0)

        for (let index = 0; index < so_ids.length; index++) {
            const id = so_ids[index]
            let order = await Order.query().where('id', id).first()
            fuel_qty += +order!.fuel_qty
        }
        let po = await PurchaseOrder.query().where('id', po_id).first()
        return {
            is_fuel_available: fuel_qty <= po!.fuel_qty ? true : false,
            fuel_left: po!.fuel_qty - fuel_qty,
        }
    }
}
