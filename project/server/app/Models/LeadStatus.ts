import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import Model from './Model'

export default class LeadStatus extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public color: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static async listing() {
        return await this.query().select('*')
    }
}
