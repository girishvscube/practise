import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import RoleModule from './RoleModule'

export default class Permission extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public role_id: number

    @column()
    public module_id: number

    @belongsTo(() => Role, {
        foreignKey: 'role_id',
    })
    public role: BelongsTo<typeof Role>

    @belongsTo(() => RoleModule, {
        foreignKey: 'module_id',
    })
    public module: BelongsTo<typeof RoleModule>

    @column({
        prepare: (value: boolean) => Number(value),
        serialize: (value: number) => Boolean(value),
    })
    public is_read: Boolean

    @column({
        prepare: (value: boolean) => Number(value),
        serialize: (value: number) => Boolean(value),
    })
    public is_write: Boolean

    @column({
        prepare: (value: boolean) => Number(value),
        serialize: (value: number) => Boolean(value),
    })
    public is_delete: Boolean

    @column({
        prepare: (value: boolean) => Number(value),
        serialize: (value: number) => Boolean(value),
    })
    public is_update: Boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
