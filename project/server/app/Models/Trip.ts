import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import PurchaseOrder from './PurchaseOrder'
import moment from 'moment'
import TripScheduleLog from './TripScheduleLog'
import Bowser from './Bowser'
import Model from './Model'
import User from './User'

export default class Trip extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public po_id: number
    @column.dateTime()
    public start_time: DateTime
    @column.dateTime()
    public end_time: DateTime
    @column.dateTime()
    public actual_end_time: DateTime
    @column.dateTime()
    public po_arrival_time: DateTime
    @column()
    public status: string
    @column()
    public driver_id: number
    @column()
    public bowser_id: number
    @column()
    public distance_travelled: number
    @column()
    public fuel_left_at_end: number

    @belongsTo(() => Bowser, { foreignKey: 'bowser_id' })
    public bowser: BelongsTo<typeof Bowser>
    @belongsTo(() => PurchaseOrder, { foreignKey: 'po_id' })
    public purchase_order: BelongsTo<typeof PurchaseOrder>
    @belongsTo(() => User, { foreignKey: 'driver_id' })
    public driver: BelongsTo<typeof User>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    /**
     * @param query_string
     * TRIP: total, completed, not scheduled
     */
    static async count(query_string: Record<string, any>) {
        let { start_date = '', end_date = '' } = query_string
        let query = this.query()
        let query1 = this.query()
        let query2 = this.query()
        query.count('id as count')
        query1.count('id as count').where('status', 'Trip Completed')
        query2.count('id as count').where('status', 'Not Scheduled')

        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.where('created_at', '>=', start)
            query.where('created_at', '<=', end)
            query1.where('created_at', '>=', start)
            query1.where('created_at', '<=', end)
            query2.where('created_at', '>=', start)
            query2.where('created_at', '<=', end)
        }

        let total = await query
        let completed = await query1
        let not_scheduled = await query2

        return {
            total: total[0].$extras.count,
            completed: completed[0].$extras.count,
            not_scheduled: not_scheduled[0].$extras.count,
        }
    }

    // static async listing(query_string: Record<string, any>) {
    //     const {
    //         page = 1,
    //         bowser_id = null,
    //         status = null,
    //         start_date = null,
    //         end_date = null,
    //         search_key = null,
    //     } = query_string
    //     const limit = 10
    //     let query = this.query()
    //     let total_count = await this.query().count('id as count').first()

    //     if (status) {
    //         query.where('status', status)
    //     }

    //     if (start_date && end_date) {
    //         let start = moment(start_date)
    //             .utcOffset('+05:30')
    //             .startOf('day')
    //             .format('YYYY-MM-DD HH:mm:ss')
    //         let end = moment(end_date)
    //             .utcOffset('+05:30')
    //             .endOf('day')
    //             .format('YYYY-MM-DD HH:mm:ss')
    //         query.where('start_time', '>=', start)
    //         query.where('start_time', '<=', end)
    //     }

    //     if (bowser_id) {
    //         query.where('bowser_id', bowser_id)
    //     }
    //     let data = await query
    //         .preload('bowser', (bowser_query) => {
    //             if (search_key) bowser_query.where('name', 'LIKE', `%${search_key}%`)
    //             bowser_query.select('name', 'fuel_capacity')
    //         })
    //         .preload('purchase_order', (po_query) => {
    //             po_query.preload('supplier', (q) =>
    //                 q.select('name', 'address', 'city', 'state', 'pincode')
    //             )
    //             po_query.select('*')
    //         })
    //         .select('*')
    //         .paginate(page, limit)
    //     return { data: data, total_count: total_count!.$extras.count }
    // }

    static async listing(query_string: Record<string, any>) {
        const {
            page = 1,
            bowser_id = null,
            status = null,
            start_date = null,
            end_date = null,
            search_key = null,
        } = query_string
        const limit = 10
        let query = this.query()
        let total_count = await this.query().count('id as count').first()
        let trips: TripObj[] = []

        if (status) {
            query.where('status', status)
        }

        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.where('start_time', '>=', start)
            query.where('start_time', '<=', end)
        }

        if (bowser_id) {
            query.where('bowser_id', bowser_id)
        }
        let data = await query
            .preload('bowser', (bowser_query) => {
                if (search_key) bowser_query.where('name', 'LIKE', `%${search_key}%`)
                bowser_query.select('name', 'fuel_left')
            })
            .preload('purchase_order', (po_query) => {
                po_query.preload('supplier', (q) =>
                    q.select('name', 'address', 'city', 'state', 'pincode')
                )
                po_query.select('*')
            })
            .select('*')
            .paginate(page, limit)

        for (let index = 0; index < data.length; index++) {
            let trip: TripObj = {
                all_orders: null,
                bowser_name: '',
                delivered_fuel: 0,
                id: 0,
                no_orders_delivered: 0,
                no_orders_linked: 0,
                po_id: 0,
                remaining_fuel: 0,
                trip_end_time: null,
                trip_start_time: null,
                trip_status: '',
            }
            const element = data[index]
            trip.bowser_name = element.bowser.name
            trip.id = element.id
            trip.no_orders_linked = element.purchase_order.no_of_order_linked
            trip.no_orders_delivered = 0
            trip.po_id = element.po_id
            trip.trip_end_time = element.actual_end_time
            trip.trip_start_time = element.start_time
            trip.trip_status = element.status
            trip.remaining_fuel = element.bowser.fuel_left
            trip.delivered_fuel = 0
            let pos = await TripScheduleLog.query()
                .preload('order', (q) => q.preload('customer'))
                .preload('purchaseOrder', (q) => q.preload('supplier'))
                .where('trip_id', element.id)
            let orders: OrderDetailsObj[] = []
            for (let index = 0; index < pos.length; index++) {
                const element = pos[index]
                let order: OrderDetailsObj = {
                    created_at:
                        element.type === 'po'
                            ? element.purchaseOrder.createdAt
                            : element.order.createdAt,
                    delivery_location:
                        element.type === 'po'
                            ? {
                                  city: element.purchaseOrder.supplier.city,
                                  address: element.purchaseOrder.supplier.address,
                                  pincode: element.purchaseOrder.supplier.pincode,
                              }
                            : JSON.parse(element.order.customer_delivery_details),
                    fuel_qty:
                        element.type === 'po'
                            ? element.purchaseOrder.fuel_qty
                            : element.order.fuel_qty,
                    id: element.type === 'po' ? element.po_id : element.so_id,
                    name:
                        element.type === 'po'
                            ? element.purchaseOrder.supplier.name
                            : element.order.customer.company_name,
                    purchase_or_delivery_date:
                        element.type === 'po'
                            ? element.purchaseOrder.purchase_date
                            : element.order.delivery_date,
                    status:
                        element.type === 'po' ? element.purchaseOrder.status : element.order.status,
                    total_amount:
                        element.type === 'po'
                            ? element.purchaseOrder.total_amount
                            : element.order.grand_total,
                    type: element.type,
                }
                trip.delivered_fuel =
                    element.type === 'so'
                        ? element.order.is_order_delivered
                            ? trip.delivered_fuel + element.order.fuel_qty
                            : trip.delivered_fuel + 0
                        : trip.delivered_fuel + 0
                trip.no_orders_delivered =
                    element.type === 'so'
                        ? element.order.is_order_delivered
                            ? trip.no_orders_delivered + 1
                            : trip.no_orders_delivered + 0
                        : trip.no_orders_delivered + 0
                orders.push(order)
            }
            trip.all_orders = orders
            trips.push(trip)
        }
        return { data: trips, meta: data.getMeta(), total_count: total_count!.$extras.count }
    }

    static async saveTrip(po_id: number) {
        try {
            let checkTrip = await Trip.query().where('po_id', po_id).first()
            if (checkTrip) {
                return
            }
            let trip = new Trip()
            trip.po_id = po_id
            let po = await PurchaseOrder.find(trip.po_id)
            trip.bowser_id = po!.bowser_id
            trip = await trip.save()
            let bowser = await Bowser.find(po!.bowser_id)
            bowser!.last_trip_id = trip.id
            bowser!.fuel_left = bowser!.fuel_left + po!.fuel_qty
            await bowser!.save()
            let tripScheduleLog = new TripScheduleLog()
            tripScheduleLog.trip_id = trip.id
            tripScheduleLog.po_id = trip.po_id
            tripScheduleLog.type = 'po'
            tripScheduleLog.status = 'NOT_STARTED'
            await tripScheduleLog.save()
        } catch (exception) {
            throw new Error(exception.message)
        }
    }
}

interface TripObj {
    id: number
    po_id: number
    bowser_name: string
    trip_start_time: DateTime | null
    trip_end_time: DateTime | null
    no_orders_linked: number
    no_orders_delivered: number
    remaining_fuel: number
    delivered_fuel: number
    trip_status: string
    all_orders: OrderDetailsObj[] | null
}

interface OrderDetailsObj {
    id: number
    type: string
    created_at: DateTime
    name: string
    fuel_qty: number
    total_amount: number
    delivery_location: any
    purchase_or_delivery_date: DateTime
    status: string
}
