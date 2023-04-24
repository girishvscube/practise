import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Trip from './Trip'
import Order from './Order'
import Model from './Model'

export default class TripSoOrder extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public trip_id: number
    @column()
    public so_id: number
    @column()
    public priority: number
    @column.dateTime()
    public schedule_time: DateTime

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Trip, { foreignKey: 'trip_id' })
    public trip: BelongsTo<typeof Trip>

    @belongsTo(() => Order, { foreignKey: 'so_id' })
    public order: BelongsTo<typeof Order>

    static async listing(id: number) {
        let query = this.query()
        return await query
            .preload('order', (order_query) => {
                order_query.select('*')
            })
            .preload('trip', (trip_query) => {
                trip_query.select('*')
            })
            .select('*')
            .where('trip_id', id)
    }
}
