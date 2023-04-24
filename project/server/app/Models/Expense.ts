import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import BankAccount from './BankAccount'
import moment from 'moment'
import Model from './Model'

export default class Expense extends Model {
    @column({ isPrimary: true })
    public id: number

    @column.dateTime()
    public date_of_expense: DateTime
    @column()
    public expense_type: string
    @column()
    public sub_category: string
    @column()
    public item_name: string
    @column()
    public payee: string
    @column()
    public amount: number
    @column()
    public account_id: number
    @column()
    public reference_img: string

    @belongsTo(() => BankAccount, { foreignKey: 'account_id' })
    public bank_account: BelongsTo<typeof BankAccount>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static async count(query_string: Record<string, any>) {
        let { start_date = '', end_date = '' } = query_string

        let query = this.query().sum('amount as amount')
        let query1 = this.query().sum('amount as amount').where('expense_type', 'Direct')
        let query2 = this.query().sum('amount as amount').where('expense_type', 'Indirect')

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

        let total = await query.first()
        let direct = await query1.first()
        let indirect = await query2.first()

        return { total: total!.amount, direct: direct!.amount, indirect: indirect!.amount }
    }

    static async listing(query_string: Record<string, any>) {
        const {
            page = 1,
            start_date = '',
            end_date = '',
            expense_type = '',
            account_id = '',
            search_key = '',
        } = query_string

        let limit = 10
        let total_count = await this.query().count('id as count').first()
        let query = this.query().preload('bank_account', (q) => q.select('*'))
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
        if (expense_type) {
            query.where('expense_type', expense_type)
        }
        if (account_id) {
            query.where('account_id', account_id)
        }
        if (search_key) {
            query.orWhere('item_name', 'LIKE', `%${search_key}%`)
            query.orWhere('amount', 'LIKE', `%${search_key}%`)
        }

        let data = await query.orderBy('id', 'desc').paginate(page, limit)
        return { data: data, total_count: total_count!.$extras.count }
    }
}
