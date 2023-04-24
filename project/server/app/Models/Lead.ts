import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import moment from 'moment'
import Model from './Model'

export default class Lead extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public company_name: string
    @column()
    public company_phone: string
    @column()
    public email: string
    @column()
    public contact_person_name: string
    @column()
    public contact_person_phone: string
    @column()
    public status: string
    @column()
    public industry_type: string
    @column()
    public fuel_usage_per_month: number
    @column()
    public source: string
    @column()
    public assigned_to: number | null
    @column()
    public address: string
    @column()
    public city: string
    @column()
    public state: string
    @column()
    public pincode: string
    @column()
    public is_reassign_req: boolean

    @column.dateTime()
    public callback_time: DateTime

    @column()
    public re_assign_notes: string

    @column()
    public re_assign_date: string | null

    @column()
    public created_by: number

    @column.dateTime({ autoCreate: true })
    public created_at: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updated_at: DateTime

    @belongsTo(() => User, {
        foreignKey: 'assigned_to',
    })
    public user: BelongsTo<typeof User>

    @belongsTo(() => User, {
        foreignKey: 'created_by',
    })
    public userObj: BelongsTo<typeof User>

    /**
     *
     * @param request
     * @filters start_date, end_date, status, lead_source, assigned_to, search_key
     * @columns id, created_at, lead_source, name, phone, assigned_to, status
     */
    static async listing(request, user) {
        const {
            page = 1,
            start_date = '',
            end_date = '',
            status = '',
            source = '',
            assigned_to = '',
            search_key = '',
        } = request.qs()
        let limit = 10
        let total_count = await this.query().count('id as count').first()
        let query = this.query()

        if (user.role.slug != 'admin' && user.role.slug != 'manager') {
            query.where((query) => {
                query.where('assigned_to', '=', user.id).where('is_reassign_req', 0)
            })
        }

        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.where('created_at', '>=', start)
            query.where('created_at', '<=', end)
        }
        if (status) {
            query.where('status', status)
        }
        if (source) {
            query.where('source', source)
        }
        if (assigned_to) {
            query.where('assigned_to', assigned_to)
        }
        if (search_key) {
            query.orWhere('company_name', 'LIKE', `%${search_key}%`)
            query.orWhere('company_phone', 'LIKE', `%${search_key}%`)
            query.orWhere('email', 'LIKE', `%${search_key}%`)
            query.orWhere('contact_person_name', 'LIKE', `%${search_key}%`)
            query.orWhere('contact_person_phone', 'LIKE', `%${search_key}%`)
        }

        let data = await query
            .preload('user', (query) => {
                query.select('name')
            })
            .preload('userObj', (query) => {
                query.select('name as created_by')
            })
            .select(
                'id',
                'source',
                'company_name',
                'company_phone',
                'contact_person_name',
                'contact_person_phone',
                'assigned_to',
                'status',
                'created_by',
                'created_at',
                'is_reassign_req',
                're_assign_notes',
                're_assign_date'
            )
            .orderBy('id', 'desc')
            .paginate(page, limit)

        return {
            data: data,
            total_count: total_count!.$extras.count,
        }
    }

    /**
     * @param query_string
     * count of leads: created, converted, not interested
     */
    static async count(query_string: Record<string, any>) {
        let { start_date = '', end_date = '' } = query_string
        let query = this.query()
        let query1 = this.query()
        let query2 = this.query()

        query.count('id as count')
        query1.count('id as count').andWhere('status', 'Converted')
        query2.count('id as count').andWhere('status', 'Not Interested')

        if (start_date && end_date) {
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            query.where('created_at', '>=', start)
            query.where('created_at', '<=', end)
            query1.where('created_at', '>=', start)
            query1.where('created_at', '<=', end)
            query2.where('created_at', '>=', start)
            query2.where('created_at', '<=', end)
        }

        let createdCount = await query
        let convertedCount = await query1
        let notInterestedCount = await query2

        return {
            total: createdCount[0].$extras.count,
            converted: convertedCount[0].$extras.count,
            not_interested: notInterestedCount[0].$extras.count,
        }
    }
}
