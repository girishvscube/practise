import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Bowser from './Bowser'
import moment from 'moment'
import Model from './Model'

export default class BowserDriver extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number
    @column()
    public bowser_id: number

    @column.dateTime()
    public start_time: DateTime
    @column.dateTime()
    public end_time: DateTime

    @column()
    public status: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => User, { foreignKey: 'user_id' })
    public user: BelongsTo<typeof User>
    @belongsTo(() => Bowser, { foreignKey: 'bowser_id' })
    public bowser: BelongsTo<typeof Bowser>

    static async listing(id: number, query_string: Record<string, any>) {
        let { page = 1, start_date = null, end_date = null } = query_string
        const limit = 10

        let total_count = await this.query().count('id as count').where('bowser_id', id).first()
        // await Trip.query().count('id as count').where('bowser_id', id).first()
        // let query = Trip.query()
        //     .preload('driver')
        //     .preload('purchase_order', (q) => q.preload('bowser'))
        //     .where('bowser_id', id)
        let query = this.query()
            .preload('user', (q) => q.select('name'))
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
        let data = await query.orderBy('id', 'desc').paginate(page, limit)

        return { data: data, total_count: total_count!.$extras.count }
    }
}
