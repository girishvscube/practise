import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Supplier from './Supplier'
import Model from './Model'

export default class SupplierPoc extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public supplier_id: number

    @column()
    public poc_name: string

    @column()
    public designation: string

    @column()
    public contact: number

    @column()
    public email: string

    @column()
    public image: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Supplier, { foreignKey: 'supplier_id' })
    public supplier: BelongsTo<typeof Supplier>

    static async listing(qs: Record<string, any>) {
        let { page = 1 } = qs
        let limit = 10
        return await this.query().select('*').paginate(page, limit)
    }
}
