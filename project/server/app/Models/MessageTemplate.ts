import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import Model from './Model'

export default class MessageTemplate extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public type: string
    @column()
    public message: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static async listing() {
        return await this.query().select('*')
    }
}
