import { DateTime } from 'luxon'
import { belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import PayIn from './PayIn'
import Order from './Order'
import Model from './Model'

export default class PayInInvoice extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public pay_in_id: number
    @column()
    public order_id: number
    @column()
    public amount: number

    @belongsTo(() => PayIn, { foreignKey: 'pay_in_id' })
    public payin: BelongsTo<typeof PayIn>
    @belongsTo(() => Order, { foreignKey: 'order_id' })
    public order: BelongsTo<typeof Order>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
