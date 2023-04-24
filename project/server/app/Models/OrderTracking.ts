import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'

export default class OrderTracking extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public status: string

    @column.dateTime()
    public order_updated_at: DateTime

    @column()
    public order_id: number

    @belongsTo(() => Order)
    public order: BelongsTo<typeof Order>

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime
}
