import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import Model from './Model'

export default class SupplierPerLitreLog extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public supplier_id: number

    @column()
    public per_litre_price: number

    @belongsTo(() => Supplier)
    public supplier: BelongsTo<typeof Supplier>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
