import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import PurchaseOrder from './PurchaseOrder'
import Order from './Order'

export default class PurchaseSalesOrder extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public po_id: number
    @column()
    public so_id: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => PurchaseOrder, { foreignKey: 'po_id' })
    public purchase_order: BelongsTo<typeof PurchaseOrder>

    @belongsTo(() => Order, { foreignKey: 'so_id' })
    public order: BelongsTo<typeof Order>

    static async listing(id: number) {
        let query = this.query()
        return await query
            .preload('order', (order_query) => {
                order_query.select('*')
            })
            .preload('purchase_order', (po_query) => {
                po_query.select('*')
            })
            .select('*')
            .where('po_id', id)
    }
}
