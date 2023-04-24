import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ParkingStation from './ParkingStation'
import User from './User'
import Model from './Model'

export default class Bowser extends Model {
    @column({ isPrimary: true })
    public id: number
    @column()
    public name: string
    @column()
    public registration_no: string
    @column()
    public last_trip_id: number
    @column()
    public fuel_capacity: number
    @column()
    public fuel_left: number
    @column()
    public image: string
    @column()
    public registration: string
    @column.dateTime()
    public registration_validity: DateTime
    @column()
    public pollution_cert: string
    @column.dateTime()
    public pollution_cert_validity: DateTime
    @column()
    public vehicle_fitness: string
    @column.dateTime()
    public vehicle_fitness_validity: DateTime
    @column()
    public heavy_vehicle: string
    @column.dateTime()
    public heavy_vehicle_validity: DateTime
    @column()
    public other_doc: string
    @column.dateTime()
    public other_doc_validity: DateTime
    @column()
    public parking_station_id: number
    @column()
    public last_driver_id: number
    @column()
    public status: string

    @belongsTo(() => ParkingStation, { foreignKey: 'parking_station_id' })
    public parkingstation: BelongsTo<typeof ParkingStation>

    @belongsTo(() => User, { foreignKey: 'last_driver_id' })
    public driver: BelongsTo<typeof User>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    /**
     * @param query_string
     * count of bowsers: total, on trip, available, out of service
     */
    static async count() {
        let query = this.query()
        let query1 = this.query()
        let query2 = this.query()
        let query3 = this.query()

        query.count('id as count')
        query1.count('id as count').andWhere('status', 'On Trip')
        query2.count('id as count').andWhere('status', 'Available')
        query3.count('id as count').andWhere('status', 'Out of Service')

        let total = await query
        let on_trip = await query1
        let available = await query2
        let out_of_service = await query3

        return {
            total: total[0].$extras.count,
            on_trip: on_trip[0].$extras.count,
            available: available[0].$extras.count,
            out_of_service: out_of_service[0].$extras.count,
        }
    }
    static async dropdown() {
        let query = Bowser.query()
            .leftJoin('bowser_drivers as bd', 'bd.bowser_id', 'bowsers.id')
            .leftJoin('parking_stations as ps', 'ps.id', 'bowsers.parking_station_id')
            .leftJoin('users as u', 'u.id', 'bowsers.last_driver_id')
            // .preload('parkingstation', (q) => q.select('*'))
            // .preload('driver', (q) => q.select('*'))
            .select(
                'bowsers.id',
                'bowsers.name',
                'bowsers.registration_no',
                'bowsers.last_trip_id',
                'bowsers.fuel_capacity',
                'bowsers.parking_station_id',
                'bowsers.last_driver_id',
                'bowsers.fuel_left',
                'u.name as driver_name',
                'ps.station_name as station_name',
                'ps.id as station_id'
            )
            .max('bd.end_time as end_time')
            .where('bowsers.status', 'AVAILABLE')
            .groupBy('bowsers.id')
        let bowsers = await query
        let data: any[] = []
        bowsers.forEach((el) => {
            data.push({
                id: el.id,
                name: el.name,
                registration_no: el.registration_no,
                fuel_capacity: el.fuel_capacity,
                fuel_left: el.fuel_left,
                driver: { id: el.last_driver_id, name: el.$extras.driver_name },
                last_trip: el.$extras.end_time,
                parkingstation: {
                    id: el.parking_station_id,
                    name: el.$extras.station_name,
                },
            })
        })
        return data
    }
    static async listing(query_string: Record<string, any>) {
        let { page = 1, status = null, driver = '', search_key = null } = query_string
        let limit = 10
        let total_count = await this.query().count('id as count').first()
        let query = this.query()
        if (status) {
            query.where('status', '=', status)
        }

        if (search_key) {
            query = query
                .where('name', 'LIKE', `%${search_key}%`)
                .orWhere('registration_no', 'LIKE', `%${search_key}%`)
        }
        if (driver) {
            query = query.where('last_driver_id', driver)
        }

        let data = await query
            .preload('parkingstation', (q) => q.select('station_name'))
            .preload('driver', (q) => q.select('name'))
            .orderBy('id', 'desc')
            .paginate(page, limit)

        return { total_count: total_count!.$extras.count, data: data }
    }
}
