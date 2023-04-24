import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import User from 'App/Models/User'

export default class Log extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public model_id: number

    @column()
    public model: string

    @column()
    public user_id: number

    @column()
    public message: string

    @column({
        prepare: (value: string) => value.toUpperCase(),
    })
    public type: string

    @belongsTo(() => User, {
        foreignKey: 'user_id',
    })
    public user: BelongsTo<typeof User>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
