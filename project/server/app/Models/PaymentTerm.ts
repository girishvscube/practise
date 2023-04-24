import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import Model from './Model'

export default class PaymentTerm extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public rules: string
    @column()
    public is_deleted: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static listing() {
        return this.query().select('*')
    }
}
