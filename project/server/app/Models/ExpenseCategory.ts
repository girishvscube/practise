import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import Model from './Model'

export default class ExpenseCategory extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public sub_category: string
    @column()
    public is_deleted: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static listing(name: string) {
        return this.query().select('*').where('name', name)
    }
}
