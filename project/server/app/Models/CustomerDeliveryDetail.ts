import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import CustomerPoc from './CustomerPoc'
import Model from './Model'

export default class CustomerDeliveryDetail extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public customer_id: number

    @column()
    public address_1: string

    @column()
    public address_2: string

    @column()
    public pincode: number

    @column()
    public address_type: string

    @column()
    public city: string

    @column()
    public state: string

    @column()
    public phone: string

    @column()
    public landmark: string

    @column()
    public location_name: string

    @column()
    public location: string

    @column()
    public customer_poc_id: number

    @belongsTo(() => CustomerPoc, {
        foreignKey: 'customer_poc_id',
    })
    public poc: BelongsTo<typeof CustomerPoc>

    @column()
    public is_fuel_price_checked: boolean
    @column()
    public fuel_price: number

    @column()
    public is_deleted: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static dropdown(id) {
        return this.query()
            .select(
                'id',
                'customer_id',
                'address_1',
                'address_2',
                'pincode',
                'address_type',
                'phone',
                'state',
                'fuel_price'
            )
            .where('is_deleted', '=', false)
            .andWhere('customer_id', id)
    }

    static listing(id) {
        return this.query()
            .preload('poc')
            .select('*')
            .where('is_deleted', '=', false)
            .where('customer_id', id)
    }
}
