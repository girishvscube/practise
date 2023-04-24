import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import Bowser from './Bowser'
import moment from 'moment'
import Model from './Model'

export default class PurchaseOrder extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public supplier_id: number
    @column()
    public bowser_id: number
    @column()
    public fuel_qty: number
    @column.dateTime()
    public purchase_date: DateTime
    @column()
    public price_per_litre: number
    @column()
    public total_amount: number
    @column()
    public balance: number
    @column()
    public additional_notes: string
    @column()
    public status: string
    @column()
    public payment_status: string
    @column()
    public is_order_confirmed: boolean
    @column()
    public no_of_order_linked: number
    @column()
    public is_order_delivered: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Supplier, { foreignKey: 'supplier_id' })
    public supplier: BelongsTo<typeof Supplier>

    @belongsTo(() => Bowser, { foreignKey: 'bowser_id' })
    public bowser: BelongsTo<typeof Bowser>

    /**
     * @param query_string
     * PO: total fuel_qty, delivery quantity, po raise, po purchase
     */
    static async count(query_string: Record<string, any>) {
        let { start_date = '', end_date = '' } = query_string
        let query = this.query()
        let query1 = this.query()
        let query2 = this.query()
        let query3 = this.query()

        query.sum('fuel_qty as fuel_qty')
        query1.sum('fuel_qty as fuel_delivered').where('status', 'Purchase Done')
        query2.count('id as po_raised').where('status', 'PO Raised')
        query3.count('id as po_done').where('status', 'Purchase Done')

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
            query3.where('created_at', '>=', start)
            query3.where('created_at', '<=', end)
        }

        let total_fuel_qty = await query
        let fuel_delivered = await query1
        let po_raised = await query2
        let po_done = await query3

        return {
            total_fuel_qty: total_fuel_qty[0].fuel_qty,
            fuel_delivered: fuel_delivered[0].$extras.fuel_delivered,
            po_raised: po_raised[0].$extras.po_raised,
            po_done: po_done[0].$extras.po_done,
        }
    }

    static async getListBySupplierId(id: number, query_string: Record<string, any>) {
        let { page = 1, start_date = null, end_date = null } = query_string

        const limit = 10
        let total_count = await this.query().count('id as count').where('supplier_id', id).first()
        let query = this.query().where('supplier_id', id)
        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.where('purchase_date', '>=', start)
            query.where('purchase_date', '<=', end)
        }

        let data = await query.preload('supplier', (q) => q.select('*')).paginate(page, limit)
        return { data: data, total_count: total_count!.$extras.count }
    }

    static async listing(query_string: Record<string, any>) {
        let {
            page = 1,
            start_date = null,
            end_date = null,
            status = null,
            search_key = null,
        } = query_string
        const limit = 10
        let total_count = await this.query().count('id as count').first()
        let query = this.query().innerJoin('suppliers as s', 's.id', 'purchase_orders.supplier_id')
        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.whereBetween('purchase_orders.created_at', [start, end])
            // query.where('purchase_orders.created_at', '<=', end)
        }
        if (status) {
            query.where('status', status)
        }
        query.preload('supplier', (supplier) => {
            supplier.select('name')
            //     supplier.where('name', 'like', `%${search_key}%`)
        })
        if (search_key) {
            query.where('s.name', 'like', `%${search_key}%`)
        }
        let data = await query
            .select(
                'purchase_orders.id',
                'purchase_orders.created_at',
                'purchase_orders.purchase_date',
                'purchase_orders.supplier_id',
                'purchase_orders.fuel_qty',
                'purchase_orders.no_of_order_linked',
                'purchase_orders.status',
                'purchase_orders.payment_status'
            )
            // .preload('supplier', (q) => q.select('name'))
            .paginate(page, limit)
        return { data: data, total_count: total_count!.$extras.count }
    }

    static async purchaseBillStats(query_string: Record<string, any>) {
        let { start_date = null, end_date = null } = query_string

        let query = this.query().count('id as count').where('purchase_orders.is_order_confirmed', 1) // all confirmed

        let query1 = this.query() // paid
            .count('id as count')
            .where('is_order_confirmed', 1)
            .where('payment_status', 'Paid')
        let query2 = this.query() // unpaid
            .count('id as count')
            .where('is_order_confirmed', 1)
            .whereNot('payment_status', '=', 'Paid')

        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.where('purchase_orders.purchase_date', '>=', start)
            query.where('purchase_orders.purchase_date', '<=', end)
            query1.where('purchase_orders.purchase_date', '>=', start)
            query1.where('purchase_orders.purchase_date', '<=', end)
            query2.where('purchase_orders.purchase_date', '>=', start)
            query2.where('purchase_orders.purchase_date', '<=', end)
        }
        let total = await query.first()
        let paid = await query1.first()
        let unpaid = await query2.first()

        return {
            total: total!.$extras.count,
            paid: paid!.$extras.count,
            unpaid: unpaid!.$extras.count,
        }
    }
    static async purchaseBillList(query_string: Record<string, any>) {
        let {
            page = 1,
            start_date = null,
            end_date = null,
            status = null,
            search_key = null,
        } = query_string

        const limit = 10
        let total_count = await this.query().count('id as count').first()

        let query = this.query()
            .leftJoin('suppliers as s', 's.id', 'purchase_orders.supplier_id')
            .preload('supplier', (q) => q.select('name'))
            .select('purchase_orders.id')
            .select('purchase_orders.supplier_id')
            .select('purchase_orders.supplier_id')
            .select('purchase_orders.bowser_id')
            .select('purchase_orders.total_amount')
            .select('purchase_orders.balance')
            // .select('purchase_orders.status')
            .select('purchase_orders.payment_status')
            .select('purchase_orders.purchase_date')
            .where('status', 'PURCHASE_DONE')

        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.where('purchase_orders.purchase_date', '>=', start)
            query.where('purchase_orders.purchase_date', '<=', end)
        }
        if (search_key) {
            query.orWhere('purchase_orders.id', 'LIKE', `%${search_key}%`)
            query.orWhere('s.name', 'LIKE', `%${search_key}%`)
        }
        if (status) {
            query.where('purchase_orders.payment_status', status)
        }
        let data = await query.orderBy('id', 'desc').paginate(page, limit)
        return { data: data, total_count: total_count!.$extras.count }
    }
}
