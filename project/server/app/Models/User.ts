import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, belongsTo, BelongsTo, computed } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import Model from './Model'

export default class User extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public email: string

    @column()
    public phone: string

    @column()
    public address: string

    @column()
    public city: string

    @column()
    public state: string

    @column()
    public pincode: string

    @column()
    public image?: string

    @column()
    public aadhar_image?: string

    @column()
    public dl_image?: string

    @column({ serializeAs: null })
    public reset_token?: string | null

    @column({
        prepare: (value: boolean) => Number(value),
        serialize: (value: number) => Boolean(value),
    })
    public is_active?: string

    @column({
        prepare: (value: boolean) => Number(value),
        serialize: (value: number) => Boolean(value),
    })
    public is_new_user?: Boolean

    @column({ serializeAs: null })
    public password: string

    @column()
    public role_id: number

    @column()
    public created_by: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }

    @belongsTo(() => Role, {
        foreignKey: 'role_id',
    })
    public role: BelongsTo<typeof Role>

    @column({
        prepare: (value: string) => JSON.stringify(value),
        serialize: (value: string) => {
            return value ? JSON.parse(value) : []
        },
    })
    public images: any

    @column({
        prepare: (value: string) => JSON.stringify(value),
        serialize: (value: string) => {
            return value ? JSON.parse(value) : []
        },
    })
    public bank_details: any

    @computed()
    public session: any
    
    static listing(request) {
        const { page = 1, search_key = '', status = '', role_id = '' } = request.qs()
        const limit = 10
        let query = this.query()

        if (status != '') {
            query = query.where('is_active', '=', status == 'true' ? 1 : 0)
        }

        if (role_id) {
            query = query.where('role_id', '=', role_id)
        }

        if (search_key) {
          query = query.where((query) => {
            query
              .orWhere('name', 'LIKE', `%${search_key}%`)
              .orWhere('id', 'LIKE', `%${search_key}%`)
              .orWhere('phone', 'LIKE', `%${search_key}%`)
              .orWhere('email', 'LIKE', `%${search_key}%`)
          })
        }
       
        return query
            .preload('role', (query) => {
                query.select('name')
            })
            .select('id', 'name', 'email', 'phone', 'is_active', 'role_id')
            .orderBy('id', 'desc')
            .paginate(page, limit)
    }

    static dropdown(names) {
        let query = this.query()
        if (names.length) {
            query = query.whereHas('role', (query) => {
                query.whereIn('name', names)
            })
        }

        return query.where('is_active', 1).select('id', 'name')
    }
}
