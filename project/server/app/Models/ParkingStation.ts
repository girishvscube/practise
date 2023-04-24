import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import Model from './Model'

export default class ParkingStation extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public station_name: string
    @column()
    public capacity: number
    @column()
    public address: string
    @column()
    public city: string
    @column()
    public pincode: number
    @column()
    public state: string
    @column()
    public is_active: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static async dropdown() {
        let query = this.query()

        return await query.where('is_active', true)
    }
    static async listing(query_string: Record<string, any>) {
        let { page = 1, search_key = null } = query_string
        const limit = 10

        let query = this.query()
        let total_count = await this.query().count('id as count').first()

        if (search_key) {
            query
                .orWhere('station_name', 'like', `%${search_key}%`)
                .orWhere('city', 'like', `%${search_key}%`)
        }

        let data = await query.orderBy('id', 'desc').paginate(page, limit)

        return { data: data, total_count: total_count!.$extras.count }
    }
}
