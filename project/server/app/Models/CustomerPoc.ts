import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import Model from './Model'

export default class CustomerPoc extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public customer_id: number
    @column()
    public poc_name: string
    @column()
    public designation: string
    @column()
    public phone: string
    @column()
    public email: string
    @column()
    public image: string
    @column()
    public is_deleted: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static dropdown(id) {
        return this.query()
            .select('id', 'customer_id', 'poc_name', 'designation')
            .where('is_deleted', '=', false)
            .where('customer_id', id)
    }

    static listing(id) {
        return this.query()
            .select('id', 'customer_id', 'poc_name', 'designation', 'phone', 'email', 'image')
            .where('is_deleted', '=', false)
            .where('customer_id', id)
    }
}
