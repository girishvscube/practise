import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import Customer from './Customer'
import Expense from './Expense'
import moment from 'moment'
import Model from './Model'
import PayOut from './PayOut'
import PayIn from './PayIn'

export default class CashInHand extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public type: string
    @column()
    public amount: number
    @column()
    public supplier_id: number
    @column()
    public customer_id: number
    @column()
    public pay_out_id: number
    @column()
    public pay_in_id: number
    @column()
    public expense_id: number
    @column.dateTime()
    public adjustment_date: DateTime

    @belongsTo(() => Supplier, { foreignKey: 'supplier_id' })
    public supplier: BelongsTo<typeof Supplier>
    @belongsTo(() => Customer, { foreignKey: 'customer_id' })
    public customer: BelongsTo<typeof Customer>
    @belongsTo(() => PayOut, { foreignKey: 'pay_out_id' })
    public pay_out: BelongsTo<typeof PayOut>
    @belongsTo(() => PayIn, { foreignKey: 'pay_in_id' })
    public pay_in: BelongsTo<typeof PayIn>
    @belongsTo(() => Expense, { foreignKey: 'expense_id' })
    public expense: BelongsTo<typeof Expense>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static async listing(query_string: Record<string, any>) {
        let { page = 1, start_date = '', end_date = '', search_key = '', type = '' } = query_string
        const limit = 10
        let total_count = this.query().count('id as count').first()
        let query = this.query()
            .leftJoin('customers as c', 'c.id', 'cash_in_hands.customer_id')
            .leftJoin('suppliers as s', 's.id', 'cash_in_hands.supplier_id')
            .preload('pay_in', (q) => q.select('*'))
            .preload('expense', (q) => q.select('*'))
            .preload('pay_out', (q) => q.select('*'))

        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.where('cash_in_hands.created_at', '>=', start)
            query.where('cash_in_hands.created_at', '<=', end)
        }
        if (search_key) {
            query.orWhere('c.name', 'like', `%${search_key}%`)
            query.orWhere('s.name', 'like', `%${search_key}%`)
        }
        if (type) {
            query.where('cash_in_hands.type', type)
        }

        let data = await query
            .select('cash_in_hands.*')
            .orderBy('cash_in_hands.id', 'desc')
            .paginate(page, limit)
        return { total_count: total_count, data: data }
    }

    static async count(query_string: Record<string, any>) {
        let { start_date = '', end_date = '' } = query_string
        let query = this.query().sum('amount as amount')
        let query1 = this.query().sum('amount as amount').where('type', 'Cash Increase')
        let query2 = this.query().sum('amount as amount').where('type', 'Cash Decrease')
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
        let cash_in = await query1
        let cash_out = await query2

        return { total: total[0].amount, cash_in: cash_in[0].amount, cash_out: cash_out[0].amount }
    }
}
