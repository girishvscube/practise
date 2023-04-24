import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import moment from 'moment'
import Customer from './Customer'
import User from './User'
import Model from './Model'
import Trip from './Trip'
import PurchaseSalesOrder from './PurchaseSalesOrder'
import Database from '@ioc:Adonis/Lucid/Database'

export default class Order extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public customer_id: number

    @column({
        prepare: (value: string) => JSON.stringify(value),
        serialize: (value: string) => {
            return value && typeof value === 'string' ? JSON.parse(value) : value
        },
    })
    public customer_delivery_details: any

    @column()
    public order_type: string
    @column.dateTime()
    public delivery_date: DateTime
    @column()
    public time_slot: any
    @column()
    public fuel_qty: number
    @column()
    public sales_executive_id: number
    @column()
    public status: string
    @column()
    public discount_type: string
    @column()
    public discount: number
    @column()
    public per_litre_cost: number
    @column()
    public total_amount: number
    @column()
    public delivery_charges: number
    @column()
    public grand_total: number
    @column()
    public balance: number
    @column.dateTime()
    public due_date: DateTime
    @column.dateTime()
    public last_date: DateTime
    @column()
    public payment_type: string
    @column()
    public payment_rules: string
    @column()
    public payment_status: string
    @column()
    public additional_notes: string
    @column()
    public is_order_confirmed: boolean
    @column()
    public is_order_cancelled: boolean
    @column()
    public is_order_delivered: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Customer, { foreignKey: 'customer_id' })
    public customer: BelongsTo<typeof Customer>
    @belongsTo(() => User, { foreignKey: 'sales_executive_id' })
    public user: BelongsTo<typeof User>

    static async listing(query_string: Record<string, any>) {
        try {
            let {
                page = 1,
                start_date = null,
                end_date = null,
                status = '',
                sales_executive_id = '',
                search_key = '',
            } = query_string
            const limit = 10
            let total_count = await this.query().count('id as count').first()
            let query = this.query()

            if (search_key) {
                query = query.where((query) => {
                    query
                        .orWhere('orders.id', 'LIKE', `%${search_key}%`)
                        .orWhere('customers.company_name', 'LIKE', `%${search_key}%`)
                        .orWhere('customers.phone', 'LIKE', `%${search_key}%`)
                        .orWhere('customers.email', 'LIKE', `%${search_key}%`)
                })
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
                query.where('orders.created_at', '>=', start)
                query.where('orders.created_at', '<=', end)
            }

            if (status) {
                query.where('orders.status', status)
            }
            if (sales_executive_id) {
                query.where('orders.sales_executive_id', sales_executive_id)
            }

            let record = await query
                .join('customers', (query) => {
                    query.on('customers.id', '=', 'orders.customer_id')
                })
                .preload('customer', (query) => {
                    query.select('id', 'company_name', 'phone', 'email')
                })
                .preload('user', (query) => {
                    query.select('id', 'name', 'phone', 'email')
                })
                .select(
                    'orders.id',
                    'orders.customer_id',
                    'orders.created_at',
                    'orders.delivery_date',
                    'orders.time_slot',
                    'orders.sales_executive_id',
                    'orders.fuel_qty',
                    'orders.status',
                    'orders.payment_status',
                    'orders.customer_delivery_details',
                    'orders.is_order_confirmed',
                    'orders.is_order_cancelled'
                )
                .orderBy('orders.id', 'desc')
                .paginate(page, limit)
            let orderList: OrderObj[] = []
            for (let index = 0; index < record.length; index++) {
                const element = record[index]
                let orderObj: OrderObj = {
                    created_at: element.createdAt,
                    customer: element.customer,
                    customer_delivery_details: JSON.parse(element.customer_delivery_details),
                    customer_id: element.customer_id,
                    delivery_date: element.delivery_date,
                    fuel_qty: element.fuel_qty,
                    id: element.id,
                    payment_status: element.payment_status,
                    sale_executive_id: element.sales_executive_id,
                    status: element.status,
                    time_slot: element.time_slot,
                    user: element.user,
                    is_order_confirmed:element.is_order_confirmed
                }
                orderList.push(orderObj)
            }
            return {
                total_count: total_count!.$extras.count,
                data: { meta: record.getMeta(), data: orderList },
            }
        } catch (exception) {
            throw exception
        }
    }

    /**
     *
     * @param id cutomer_id
     * @param query_string filter: start and end date, page
     */
    static async getOrdersByCustomerId(id: number, query_string: Record<string, any>) {
        let { page = 1, start_date = null, end_date = null } = query_string
        const limit = 10
        let query = this.query()
        let statsQuery = ``
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
            statsQuery = `and created_at >= '${start}' and created_at <= '${end}'`
        }

        let total_count = await this.query().count('id as count').where('customer_id', id).first()
        let list = await query
            .where('customer_id', id)
            .select(
                'id',
                'customer_id',
                'created_at',
                'delivery_date',
                'fuel_qty',
                'status',
                'payment_status',
                'grand_total'
            )
            .orderBy('id', 'desc')
            .paginate(page, limit)

        let [[[count]], [[paidOrders]]] = await Promise.all([
            Database.rawQuery(
                `SELECT count(id) as total_orders  from orders where customer_id = ${id} ${statsQuery}`
            ),
            Database.rawQuery(
                `SELECT  sum(total_amount) as total_amount from orders where customer_id = ${id} and payment_status = "PAID" ${statsQuery}`
            ),
        ])
        return {
            data: list,
            total_orders: count.total_orders || 0,
            total_order_amount: paidOrders.total_amount || 0,
            total_count: total_count!.$extras.count,
        }
    }

    static async count(query_string: Record<string, any>) {
        let { start_date = '', end_date = '' } = query_string
        let query = this.query() //total
        let query1 = this.query() //delivered
        let query2 = this.query() //In progress
        let query3 = this.query() // sum of fuel_qty

        query.count('orders.id as count')
        query1.count('orders.id as count').andWhere('status', 'DELIVERED')
        query2
            .count('id as count')
            .andWhereNot('status', 'DELIVERED')
            .andWhereNot('status', 'ORDER_CANCELLED')
        query3.sum('fuel_qty as fuel_qty').andWhere('status', 'DELIVERED')

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

        let totalCount = await query
        let deliveredCount = await query1
        let inProgressCount = await query2
        let sumFuelQty = await query3

        return {
            total: totalCount[0].$extras,
            delivered: deliveredCount[0].$extras,
            in_progress: inProgressCount[0].$extras,
            fuel_qty: sumFuelQty[0].fuel_qty,
        }
    }

    static async confirmedOrder(query_string: Record<string, any>, id: number) {
        let so_list: SOList[] = []
        let trip = await Trip.findOrFail(id)
        let linked_orders = await PurchaseSalesOrder.query()
            .preload('order', (q) =>
                q.select(
                    'id',
                    'created_at',
                    'order_type',
                    'fuel_qty',
                    'customer_delivery_details',
                    'delivery_date',
                    'time_slot'
                )
            )
            .where('po_id', trip.po_id)
        let { order_type = '', time_slot = '', start_date = '', end_date = '' } = query_string
        let query = Order.query()
            .leftJoin('purchase_sales_orders as pso', 'pso.so_id', 'orders.id')
            .where('is_order_confirmed', true)
            .where('is_order_cancelled', false)
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
            'orders.customer_delivery_details',
            'orders.time_slot'
        )

        for (let index = 0; index < linked_orders.length; index++) {
            const element = linked_orders[index]
            let so: SOList = {
                customer_delivery_details: JSON.parse(element.order.customer_delivery_details),
                created_at: element.order.createdAt,
                delivery_date: element.order.delivery_date,
                fuel_qty: element.order.fuel_qty,
                id: element.order.id,
                order_type: element.order.order_type,
                time_slot: element.order.time_slot,
            }
            so_list.push(so)
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index]
            let so: SOList = {
                customer_delivery_details: JSON.parse(element.customer_delivery_details),
                created_at: element.createdAt,
                delivery_date: element.delivery_date,
                fuel_qty: element.fuel_qty,
                id: element.id,
                order_type: element.order_type,
                time_slot: element.time_slot,
            }
            so_list.push(so)
        }

        return so_list
    }

    // id,created_at, company_name, customer_type, grand_total, due_date, balance, payment_status
    static async invoiceList(query_string: Record<string, any>) {
        let {
            page = 1,
            start_date = '',
            end_date = '',
            status = '',
            search_key = '',
        } = query_string
        const limit = 10
        let total_count = await this.query()
            .count('id as count')
            .where('orders.status', 'DELIVERED')
            .first()
        let query = this.query()
            .innerJoin('customers as c', 'c.id', 'orders.customer_id')
            .preload('customer', (q) => q.select('company_name', 'customer_type'))
            .select(
                'orders.id',
                'orders.customer_id',
                'orders.created_at',
                'orders.grand_total',
                'orders.due_date',
                'orders.balance',
                'orders.payment_status'
            )
            .where('orders.status', 'DELIVERED')

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

        if (status) {
            query.where('orders.payment_status', status)
        }
        if (search_key) {
            query.orWhere('orders.id', 'LIKE', `%${search_key}%`)
            query.orWhere('c.company_name', 'LIKE', `%${search_key}%`)
        }

        let data = await query.paginate(page, limit)
        return { data: data, total_count: total_count!.$extras.count }
    }

    static async invoiceStats(query_string: Record<string, any>) {
        let { start_date = '', end_date = '' } = query_string
        let query = this.query().count('id as count').where('status', 'DELIVERED')
        let query1 = this.query()
            .count('id as count')
            .where('status', 'DELIVERED')
            .where('payment_status', 'PAID')
        let query2 = this.query()
            .count('id as count')
            .where('status', 'DELIVERED')
            .where('payment_status', 'UN_PAID')
        let query3 = this.query()
            .count('id as count')
            .where('status', 'DELIVERED')
            .where('payment_status', 'PARTIALLY_PAID')

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

        let total = await query.first()
        let paid = await query1.first()
        let unpaid = await query2.first()
        let partially_paid = await query3.first()

        return {
            total: total!.$extras.count,
            paid: paid!.$extras.count,
            unpaid: unpaid!.$extras.count,
            partially_paid: partially_paid!.$extras.count,
        }
    }
}

interface SOList {
    id: number
    created_at: DateTime
    order_type: string
    fuel_qty: number
    delivery_date: DateTime
    time_slot: string
    customer_delivery_details: any
}

interface OrderObj {
    id: number
    customer_id: number
    customer: any
    user: any
    created_at: DateTime
    delivery_date: DateTime
    time_slot: string
    sale_executive_id: number
    fuel_qty: number
    status: string
    payment_status: string
    customer_delivery_details: any
    is_order_confirmed:boolean
}
