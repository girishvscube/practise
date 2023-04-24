import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import Model from './Model'

export default class Equipment extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string
    @column()
    public is_deleted: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static dropdown() {
        return this.query().select('id', 'name')
    }
    static listing() {
        return this.query().select('*')
    }
}
