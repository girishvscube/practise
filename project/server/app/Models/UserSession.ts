import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class UserSession extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column({
        prepare: (value: string) => JSON.stringify(value),
        serialize: (value: string) => {
            return value ? JSON.parse(value) : {}
        },
    })
    public location: any

    @column({
        prepare: (value: string) => JSON.stringify(value),
        serialize: (value: string) => {
            return value ? JSON.parse(value) : {}
        },
    })
    public device_info: any

    @column()
    public user_id: number

    @column()
    public user_ip: string

    @column()
    public last_access_on: string

    @column()
    public signin_at: string
    @column()
    public is_logged_out: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
