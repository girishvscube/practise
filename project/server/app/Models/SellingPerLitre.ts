import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import moment from 'moment'
import Model from './Model'

export default class SellingPerLitre extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public price: number

    @column()
    public is_active: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static async listing(query_string: Record<string, any>) {
        let { page = 1, start_date = '', end_date = '' } = query_string
        const limit = 10
        let query = this.query().select('*')

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

        return await query.orderBy('id', 'desc').paginate(page, limit)
    }
}
