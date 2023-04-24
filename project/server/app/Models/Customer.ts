import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import CreditNetDue from './CreditNetDue'
import moment from 'moment'
import Model from './Model'
import Order from './Order'

export default class Customer extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public company_name: string

    @column()
    public phone: string

    @column()
    public email: string

    @column()
    public industry_type: string

    @column()
    public equipment: string

    @column()
    public customer_type: string
    @column()
    public address: string

    @column()
    public city: string

    @column()
    public pincode: number

    @column()
    public state: string

    @column()
    public image: string

    @column()
    public sales_executive_id: number

    @belongsTo(() => User, {
        foreignKey: 'sales_executive_id',
    })
    public user: BelongsTo<typeof User>

    @column()
    public account_name: string

    @column()
    public account_number: string

    @column()
    public bank_name: string

    @column()
    public ifsc_code: string

    @column()
    public cancelled_cheque: string

    @column()
    public gst_no: string

    @column()
    public gst_certificate: string

    @column()
    public is_credit_availed?: Boolean

    @column()
    public credit_limit: number

    @column()
    public credit_net_due_id: number

    @column()
    public credit_pan: string

    @column()
    public credit_aadhaar: string

    @column()
    public credit_bank_statement: string

    @column()
    public credit_blank_cheque: string

    @column()
    public credit_cibil: string
    @column()
    public outstanding_amount: number
    @column()
    public late_charges: number
    @column()
    public charges_type: string
    @column()
    public grace_period: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => User, {
        foreignKey: 'sales_executive_id',
    })
    public sales_executive: BelongsTo<typeof User>

    @belongsTo(() => CreditNetDue, {
        foreignKey: 'credit_net_due_id',
    })
    public credit_net_due: BelongsTo<typeof CreditNetDue>

    static dropdown() {
        return this.query().select('id', 'company_name', 'email', 'phone')
    }

    static async listing(request) {
        const {
            page = 1,
            search_key = '',
            is_credit_availed = null,
            customer_type = '',
            sales_executive_id = '',
        } = request.qs()
        const limit = 10
        let total_count = await this.query().count('customers.id as count').first()
        let query = this.query()

        if (customer_type) {
            query.where('customers.customer_type', customer_type)
        }

        if (search_key) {
            query = query.where((query) => {
                query
                    .orWhere('customers.company_name', 'LIKE', `%${search_key}%`)
                    .orWhere('customers.id', 'LIKE', `%${search_key}%`)
                    .orWhere('customers.phone', 'LIKE', `%${search_key}%`)
                    .orWhere('customers.email', 'LIKE', `%${search_key}%`)
            })
        }

        if (is_credit_availed) {
            let credit_availed = is_credit_availed === '1' ? true : false
            query.where('customers.is_credit_availed', credit_availed)
        }

        if (sales_executive_id && !isNaN(sales_executive_id)) {
            query.where('customers.sales_executive_id', '=', sales_executive_id)
        }

        let data = await query
            .leftJoin('orders as o', 'customers.id', 'o.customer_id')
            .preload('user', (query) => {
                query.select('name')
            })
            .count('o.id as order_count')
            .sum('o.grand_total as total_revenue')
            .select(
                'customers.id',
                'customers.customer_type',
                'customers.company_name',
                'customers.email',
                'customers.phone',
                'customers.is_credit_availed',
                'customers.sales_executive_id'
            )
            .groupBy('customers.id')
            .orderBy('customers.id', 'desc')
            .paginate(page, limit)

        return { data: data, total_count: total_count!.$extras.count }
    }

    static async getLateChargesList(query_string: Record<string, any>) {
        const { page = 1, start_date = '', end_date = '', search_key = '' } = query_string
        let query = this.query()
        let limit = 10

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

        if (search_key) {
            query = query.where((query) => {
                query
                    .orWhere('company_name', 'LIKE', `%${search_key}%`)
                    .orWhere('id', 'LIKE', `%${search_key}%`)
                    .orWhere('phone', 'LIKE', `%${search_key}%`)
                    .orWhere('email', 'LIKE', `%${search_key}%`)
            })
        }

        return await query
            .preload('credit_net_due')
            .select(
                'id',
                'company_name',
                'credit_limit',
                'credit_net_due_id',
                'late_charges',
                'grace_period',
                'credit_net_due_id',
                'charges_type'
            )
            .paginate(page, limit)
    }

    static async getListByCustomerId(id: number, query_string: Record<string, any>) {
        let { page = 1, payment_status = '', start_date = '', end_date = '' } = query_string
        const limit = 10
        let query = Order.query()
            // .innerJoin('orders as o', 'o.id', 'order_payments.order_id')
            .preload('customer')
            .where('o.customer_id', id)
        if (payment_status) {
            query.where('order_payments.payment_status', payment_status)
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
            query.where('order_payments.created_at', '>=', start)
            query.where('order_payments.created_at', '<=', end)
        }
        return await query.paginate(page, limit)
    }
}
