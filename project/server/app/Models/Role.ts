import { DateTime } from 'luxon'
import Permission from './Permission'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'

export default class Role extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public slug: string
    
    @hasMany(() => Permission, {
        foreignKey: 'role_id',
      })
      public permissions: HasMany<typeof Permission>

    @column({
        prepare: (value: boolean) => Number(value),
        serialize: (value: number) => Boolean(value),
    })
    public is_manager: Boolean

    @column({
        prepare: (value: boolean) => Number(value),
        serialize: (value: number) => Boolean(value),
    })
    public is_deleted: Boolean
    
    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static dropdown() {
        return this.query().select('name', 'slug', 'id')
    }

    static listing(request) {
        const { page = 1 } = request.qs()
            const limit = 10
            return this.query()
            .preload('permissions',(query) => {
                query.select('role_id','module_id','is_read','is_write','is_update','is_delete')
            })
            .select('id', 'name','is_manager')
            .where('is_deleted',0)
            .orderBy('id', 'desc')
            .paginate(page, limit)
    }
}
