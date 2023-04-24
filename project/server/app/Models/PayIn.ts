import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Customer from './Customer'
import moment from 'moment'
import Model from './Model'
import BankAccount from './BankAccount'

export default class PayIn extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public customer_id: number
    @column()
    public bank_account_id: number
    @column.dateTime()
    public pay_in_date: DateTime
    @column()
    public amount: number
    @column()
    public no_of_invoices: number
    @column()
    public notes: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Customer, { foreignKey: 'customer_id' })
    public customer: BelongsTo<typeof Customer>
    @belongsTo(() => BankAccount, { foreignKey: 'bank_account_id' })
    public bank_account: BelongsTo<typeof BankAccount>

    static async listing(query_string: Record<string, any>) {
        let {
            page = 1,
            start_date = '',
            end_date = '',
            bank_account_id = '',
            search_key = '',
        } = query_string
        const limit = 10
        let total_count = await this.query().count('id as count').first()
        let query = this.query()
            .preload('bank_account', (q) => q.select('*'))
            .preload('customer', (q) => q.select('*'))
            .select('*')

        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.where('pay_ins.created_at', '>=', start)
            query.where('pay_ins.created_at', '<=', end)
        }

        if (bank_account_id) {
            query.where('pay_ins.bank_account_id', bank_account_id)
        }

        if (search_key) {
            query = query.where('c.company_name', 'LIKE', `%${search_key}%`)
        }

        let data = await query.paginate(page, limit)
        return { data: data, total_count: total_count!.$extras.count }
    }
}
