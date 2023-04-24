import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Trip from './Trip'
import Order from './Order'
import PurchaseOrder from './PurchaseOrder'
import moment from 'moment'
import Model from './Model'
import TripSoOrder from './TripSoOrder'
import Bowser from './Bowser'

export default class TripScheduleLog extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public trip_id: number
    @column()
    public so_id: number
    @column()
    public po_id: number
    @column()
    public type: string
    @column.dateTime()
    public start_time: DateTime
    @column.dateTime()
    public end_time: DateTime
    @column()
    public odometer_start: string
    @column()
    public odometer_end: string
    @column()
    public status: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Trip, { foreignKey: 'trip_id' })
    public trip: BelongsTo<typeof Trip>

    @belongsTo(() => Order, { foreignKey: 'so_id' })
    public order: BelongsTo<typeof Order>

    @belongsTo(() => PurchaseOrder, { foreignKey: 'po_id' })
    public purchaseOrder: BelongsTo<typeof PurchaseOrder>

    /** 
        @param id bowser_id 
    */
    static async listingById(id: number, query_string: Record<string, any>) {
        let { start_date = '', end_date = '', page = 1 } = query_string
        let limit = 10
        let query = Trip.query()
            .preload('purchase_order', (q) => q.select('no_of_order_linked'))
            .preload('driver', (q) => q.select('name'))
            .where('bowser_id', id)
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
        }
        // .where('trip_id', id)
        return await query.orderBy('id', 'desc').paginate(page, limit)
    }
    static async count(id: number) {
        let trip = await Trip.query().preload('purchase_order').where('id', id).first()
        let trip_so = await TripSoOrder.query()
            .leftJoin('orders as o', 'o.id', 'trip_so_orders.so_id')
            .sum('o.fuel_qty as fuel_qty')
            .where('trip_id', id)
            .where('o.status', 'DELIVERED')
        let bowser = await Bowser.query().where('id', trip!.purchase_order.bowser_id).first()

        return {
            ordered: trip!.purchase_order.fuel_qty,
            delivered: trip_so[0].$extras.fuel_qty,
            left: bowser!.fuel_left,
        }
    }

    static async listingByTripId(id: number) {
        let query = this.query()
            .preload('order', (q) => q.preload('customer'))
            .preload('trip')
            .where('trip_id', id)
            .where('type', 'so')
        return await query
    }

    static async listingByBowserId(id: number, query_string: Record<string, any>) {
        let { page = 1, start_date = null, end_date = null } = query_string
        const limit = 10
        let query = this.query()
            .innerJoin('trips as t', 't.id', '=', 'trip_schedule_logs.trip_id')
            .innerJoin('purchase_orders as po', 'po.id', '=', 'trip_schedule_logs.po_id')
            .innerJoin('bowsers as b', 'b.id', '=', 'po.bowser_id')
            .leftJoin('bowser_drivers as bd', 'bd.bowser_id', '=', 'b.id')
            .leftJoin('users as u', 'u.id', '=', 'bd.user_id')
            .where('po.bowser_id', id)
            .where('bd.status', '=', 'Assigned')
        let total_count = await this.query()
            .where('po.bowser_id', id)
            .where('bd.status', '=', 'Assigned')
            .count('id as count')
            .first()

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
        }
        let record = await query
            .select(
                'trip_schedule_logs.id',
                'trip_schedule_logs.trip_id',
                'trip_schedule_logs.start_time',
                'trip_schedule_logs.end_time',
                'trip_schedule_logs.so_id',
                'trip_schedule_logs.po_id',
                'trip_schedule_logs.type',
                'trip_schedule_logs.odometer_start',
                'trip_schedule_logs.odometer_end',
                'trip_schedule_logs.status',
                't.status as trip_status',
                'b.fuel_left as fuel_left',
                'u.name as driver_name'
            )
            .paginate(page, limit)

        return { data: record, total_count: total_count!.$extras.count }
    }
}
