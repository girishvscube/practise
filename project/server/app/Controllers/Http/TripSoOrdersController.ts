import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Order from 'App/Models/Order'
import OrderPoc from 'App/Models/OrderPoc'
import PurchaseOrder from 'App/Models/PurchaseOrder'
import PurchaseSalesOrder from 'App/Models/PurchaseSalesOrder'
import Trip from 'App/Models/Trip'
import TripScheduleLog from 'App/Models/TripScheduleLog'
import TripSoOrder from 'App/Models/TripSoOrder'
import { DateTime } from 'luxon'
import Validator from 'validatorjs'

export default class TripSoOrdersController {
    public async getAllConfirmedOrders({ request, response }: HttpContextContract) {
        try {
            let data = await Order.confirmedOrder(request.qs(), request.params().id)
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param request
     * @param response
     */
    public async index({ request, response }: HttpContextContract) {
        try {
            let data = await TripSoOrder.listing(request.params().id)
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let id = request.params().id //trip id
            let trip = await Trip.query()
                .preload('purchase_order', (query) => {
                    query
                        .preload('bowser', (sub_query) =>
                            sub_query
                                .preload('driver', (u_query) => {
                                    u_query.select('name')
                                })
                                .preload('parkingstation', (u_query) => {
                                    u_query.select('station_name')
                                })
                                .select(
                                    'last_driver_id',
                                    'name',
                                    'parking_station_id',
                                    'registration_no',
                                    'fuel_capacity',
                                    'fuel_left'
                                )
                        )
                        .preload('supplier', (sup_query) => {
                            sup_query.select('name', 'address', 'city', 'state', 'pincode')
                        })
                        .select(
                            'created_at',
                            'purchase_date',
                            'fuel_qty',
                            'supplier_id',
                            'bowser_id'
                        )
                })
                .preload('driver')
                .where('id', id)
                .select(
                    'created_at',
                    'po_id',
                    'id',
                    'driver_id',
                    'start_time',
                    'end_time',
                    'po_arrival_time',
                    'status'
                )
                .first()

            if (!trip) {
                return response.notFound({ message: `Bowser Not Found` })
            }

            let tripSoOrder: SO[] = []
            let count: any
            let tsl = await TripScheduleLog.query()
                .where('po_id', trip.po_id)
                .andWhere('type', 'po')
                .first()
            if (tsl!.status === 'NOT_STARTED') {
                let tSoOrder = await TripSoOrder.query()
                    .preload('order', (query) => {
                        query.preload('customer').select('*')
                    })
                    .where('trip_id', id)
                for (let index = 0; index < tSoOrder.length; index++) {
                    const element = tSoOrder[index]
                    let order_poc = await OrderPoc.query()
                        .preload('customer_poc')
                        .where('order_id', element.so_id)
                        .first()
                    let soObj: SO = {
                        actual_start_time: null,
                        actual_time_of_delivery: null,
                        company_name: element.order.customer.company_name,
                        customer_id: element.order.customer_id,
                        customer_delivery_detail: JSON.parse(
                            element.order.customer_delivery_details
                        ),
                        est_delivery_time: element.schedule_time,
                        fuel_qty: element.order.fuel_qty,
                        id: null,
                        order_id: element.so_id,
                        payment_term: element.order.payment_type,
                        phone: order_poc!.customer_poc.phone,
                        status: 'NOT_STARTED',
                    }
                    tripSoOrder.push(soObj)
                }
            } else {
                let tSoOrder = await TripSoOrder.query()
                    .preload('order', (query) => {
                        query.preload('customer').select('*')
                    })
                    .where('trip_id', id)
                let tslOrder = await TripScheduleLog.listingByTripId(id)
                for (let index = 0; index < tslOrder.length; index++) {
                    const element = tslOrder[index]
                    let order_poc = await OrderPoc.query()
                        .preload('customer_poc')
                        .where('order_id', element.so_id)
                        .first()
                    let soObj: SO = {
                        actual_start_time: element!.start_time,
                        actual_time_of_delivery: element!.end_time,
                        company_name: element.order.customer.company_name,
                        customer_id: element.order.customer_id,
                        customer_delivery_detail: JSON.parse(
                            element.order.customer_delivery_details
                        ),
                        est_delivery_time: tSoOrder[index]!.schedule_time,
                        fuel_qty: element.order.fuel_qty,
                        id: element.id,
                        order_id: element.so_id,
                        payment_term: element.order.payment_type,
                        phone: order_poc!.customer_poc.phone,
                        status: element.status,
                    }
                    tripSoOrder.push(soObj)
                }
            }
            count = await TripScheduleLog.count(id)
            trip!.logs = await trip!.getLogs()

            let po: PO = {
                actual_start_time: tsl!.start_time,
                actual_time_of_delivery: tsl!.end_time,
                delivery_detail: `${trip.purchase_order.supplier.address}, ${trip.purchase_order.supplier.city}, ${trip.purchase_order.supplier.state} ${trip.purchase_order.supplier.pincode}`,
                est_delivery_time: trip.po_arrival_time,
                fuel_qty: trip.purchase_order.fuel_qty,
                id: tsl!.id,
                payment_term: 'N/A',
                poc_phone: trip.purchase_order.supplier.phone,
                status: tsl!.status,
                supplier_id: trip.purchase_order.supplier_id,
                supplier_name: trip.purchase_order.supplier.name,
            }

            return response.json({
                count: count,
                trip: trip,
                schedule_trip: {
                    start_time: trip.start_time,
                    po: po,
                    orders: tripSoOrder,
                    end_time: trip.end_time,
                },
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    // public async store({ request, response }: HttpContextContract) {
    //     try {
    //         let id = request.params().id
    //         let data = request.only(['so_ids'])
    //         let rules = {
    //             so_ids: 'required|array',
    //         }
    //         const validation = new Validator(data, rules)
    //         if (validation.fails()) {
    //             return response.badRequest(validation.errors.errors)
    //         }
    //         let query = TripSoOrder.query().where('trip_id', id)
    //         data.so_ids.forEach((e) => {
    //             query.orWhere('so_id', '=', e)
    //         })
    //         let tripSoOrderQuery = await query
    //         // check if Order present
    //         if (tripSoOrderQuery.length > 0) {
    //             return response.badRequest({
    //                 message: `${
    //                     tripSoOrderQuery.length === 1 ? 'Order is' : 'Orders are'
    //                 } already linked`,
    //             })
    //         }

    //         // save orders
    //         data.so_ids.forEach(async (e) => {
    //             let tripSoOrder = new TripSoOrder()
    //             tripSoOrder.so_id = e
    //             tripSoOrder.trip_id = id
    //             let tripschedulelog = new TripScheduleLog()
    //             tripschedulelog.so_id = e
    //             tripschedulelog.trip_id = id
    //             tripschedulelog.type = 'so'
    //             await tripSoOrder.save()
    //             await tripschedulelog.save()
    //         })

    //         return response.json({ message: 'orders linked successfully' })
    //     } catch (exception) {
    //         return response.internalServerError({ message: exception.message })
    //     }
    // }

    public async destroy({ request, response }) {
        try {
            let tripSoOrder = request.tripsoorder as TripSoOrder
            let trip = await Trip.find(tripSoOrder.trip_id)
            if (trip?.status === 'IN_TRANSIT') {
                return response.badRequest({
                    message: 'Trip has already started, Cannot delete order',
                })
            } else {
                await tripSoOrder.delete()
                let tripschedulelog = await TripScheduleLog.findBy('so_id', tripSoOrder.so_id)
                await tripschedulelog!.delete()
                return response.json({ message: 'Order removed from the trip' })
            }
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async update(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    private async save({ request, response }: HttpContextContract) {
        try {
            let id = request.params().id
            let data = request.only(['start_time', 'end_time', 'po_arrival_time', 'orders'])
            let rules = {
                'start_time': 'required|date',
                'po_arrival_time': 'required|date',
                'orders': 'array',
                'orders.*.so_id': 'numeric',
                'orders.*.schedule_time': 'date',
                'end_time': 'required|date',
            }

            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let trip = await Trip.findOrFail(id)
            if (trip.status === 'IN_TRANSIT') {
                return response.badRequest('Cannot reschedule on going trip')
            }
            trip.start_time = data.start_time
            trip.end_time = data.end_time
            trip.po_arrival_time = data.po_arrival_time
            trip.status = 'SCHEDULED'
            let trip_orders_list: any[] = []

            //   SUM FUEL_QTY AND CHECK WITH PO_FUEL_QTY
            let total_fuel = 0
            let po = await PurchaseOrder.query().preload('bowser').where('id', trip.po_id).first()
            if (data.orders) {
                for (let index = 0; index < data.orders.length; index++) {
                    const order_id = data.orders[index]
                    let order = await Order.findOrFail(order_id.so_id)
                    total_fuel += Number(order.fuel_qty)
                }
                if (total_fuel > po!.bowser.fuel_left) {
                    return response.badRequest({ message: `Fuel limit exceeds!` })
                }
            }

            // CHECK ORDER AND DELETE OR UPDATE ASSOCIATED_ORDER IN PO ACCORDINGLY
            // let deleted_orders: number[] = []
            let present_orders: any[] = []
            let new_order: any[] = []
            let pos = await PurchaseSalesOrder.query().where('po_id', trip.po_id)
            for (let index = 0; index < data.orders.length; index++) {
                const element = data.orders[index]
                let order = pos.find((e) => e.so_id === element.so_id)
                if (order) {
                    present_orders.push(order.so_id)
                } else {
                    new_order.push(element)
                }
            }

            // delete removed orders
            if (present_orders.length !== pos.length) {
                for (var i = pos.length - 1; i >= 0; i--) {
                    for (var j = 0; j < present_orders.length; j++) {
                        if (pos[i].so_id === present_orders[j]) {
                            pos.splice(i, 1)
                        }
                    }
                }
                for (let index = 0; index < pos.length; index++) {
                    const element = pos[index]
                    let tripSoOrder = await TripSoOrder.findBy('so_id', element.so_id)
                    if (tripSoOrder) {
                        await tripSoOrder.delete()
                    }
                    await element.delete()
                }
            }

            // add new orders
            for (let index = 0; index < new_order.length; index++) {
                const element = new_order[index]
                let pos = new PurchaseSalesOrder()
                pos.po_id = trip.po_id
                pos.so_id = element.so_id
                await pos.save()
            }

            // AFTER EVERY CHECK IS COMPLETE
            for (let index = 0; index < data.orders.length; index++) {
                const e = data.orders[index]
                let tripSoOrder = await TripSoOrder.query().where('so_id', e.so_id).first()

                if (tripSoOrder === null) {
                    tripSoOrder = new TripSoOrder()
                } else if (tripSoOrder!.trip_id !== trip.id) {
                    return response.badRequest({
                        message: 'Order is already linked with another PO',
                    })
                }

                tripSoOrder.so_id = e.so_id
                tripSoOrder.trip_id = trip.id
                tripSoOrder.schedule_time = e.schedule_time
                tripSoOrder.priority = index + 1
                tripSoOrder = await tripSoOrder.save()

                trip_orders_list.push({ trip_so_id: tripSoOrder.id, so_id: tripSoOrder.so_id })
            }
            trip = await trip.save()
            return response.json({
                message: 'Trip scheduled successfully! ',
                trip_id: trip.id,
                trip_orders_list: trip_orders_list,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}

interface PO {
    id: number
    est_delivery_time: DateTime
    actual_start_time: DateTime | null
    actual_time_of_delivery: DateTime | null
    status: string
    supplier_id: number
    supplier_name: string
    fuel_qty: number
    delivery_detail: any
    poc_phone: string
    payment_term: 'N/A'
}

interface SO {
    order_id: number
    id: number | null
    est_delivery_time: DateTime
    actual_time_of_delivery: DateTime | null
    actual_start_time: DateTime | null
    status: string
    customer_id: number
    company_name: string
    fuel_qty: number
    customer_delivery_detail: string // supplier
    phone: string // supplier
    payment_term: string
}
