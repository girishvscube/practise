import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import Model from './Model'

export default class Notification extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public message: string

    @column()
    public module_id: number

    @column()
    public reference_id: number

    @column()
    public notify_to: number

    @column()
    public assignee: number

    @column()
    public is_read: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static async getByUserId(id: number, type: boolean) {
        return await this.query().where('notify_to', id).where('is_read', type)
    }
}
