import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import moment from 'moment'

export default class ValueChargesLog extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public user_id: number

    @column()
    public message: string

    @column({
        prepare: (value: string) => value.toUpperCase(),
    })
    public type: string

    @belongsTo(() => User, {
        foreignKey: 'user_id',
    })
    public user: BelongsTo<typeof User>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    public static async listing(request) {
        const { page = 1, start_date = '', end_date = '' } = request.qs()
        let limit = 10
        let query = this.query()
        let total_count = await this.query().count('id as count').first()

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

        let data = await query
            .preload('user', (query) => {
                query.select('id', 'name', 'image')
            })
            .orderBy('id', 'desc')
            .paginate(page, limit)

        return { data: data, total_count: total_count!.$extras.count }
    }
}
