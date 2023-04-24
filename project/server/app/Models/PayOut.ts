import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import moment from 'moment'
import Model from './Model'
import BankAccount from './BankAccount'

export default class PayOut extends Model {
    @column({ isPrimary: true })
    public id: number
    @column()
    public supplier_id: number
    @column()
    public bank_account_id: number
    @column.dateTime()
    public payout_date: DateTime
    @column()
    public amount: number
    @column()
    public no_of_invoices: number
    @column()
    public notes: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Supplier, { foreignKey: 'supplier_id' })
    public supplier: BelongsTo<typeof Supplier>
    @belongsTo(() => BankAccount, { foreignKey: 'bank_account_id' })
    public bank_account: BelongsTo<typeof BankAccount>

    static async listing(query_string: Record<string, any>) {
        let {
            page = 1,
            search_key = '',
            start_date = '',
            end_date = '',
            bank_account_id = '',
        } = query_string
        let limit = 10

        let total_count = await this.query().count('id as count').first()

        let query = this.query()
            .leftJoin('suppliers as s', 's.id', 'pay_outs.supplier_id')
            .preload('supplier', (q) => q.select('*'))
            .select('pay_outs.*')

        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.where('pay_outs.created_at', '>=', start)
            query.where('pay_outs.created_at', '<=', end)
        }

        if (bank_account_id) {
            query.where('pay_outs.bank_account_id', bank_account_id)
        }

        if (search_key) {
            query = query.where('s.name', 'LIKE', `%${search_key}%`)
        }

        let data = await query.orderBy('id', 'desc').paginate(page, limit)
        return { data: data, total_count: total_count!.$extras.count }
    }
}
