import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import PayOut from './PayOut'
import PurchaseOrder from './PurchaseOrder'
import Model from './Model'

export default class PayOutInvoice extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public pay_out_id: number
    @column()
    public purchase_order_id: number
    @column()
    public amount: number

    @belongsTo(() => PayOut, { foreignKey: 'pay_out_id' })
    public payout: BelongsTo<typeof PayOut>
    @belongsTo(() => PurchaseOrder, { foreignKey: 'purchase_order_id' })
    public purchaseorder: BelongsTo<typeof PurchaseOrder>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
