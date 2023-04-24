import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'
import User from './User'
import moment from 'moment'
import Model from './Model'

export default class SupportTicket extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public order_id: number
    @column()
    public customer_name: string
    @column()
    public issue_type: string
    @column()
    public phone: string
    @column.dateTime()
    public call_back_time: DateTime
    @column()
    public more_info: string
    @column()
    public sales_id: number | null
    @column()
    public priority: string
    @column()
    public image: string
    @column()
    public status: string
    @column()
    public is_reassign_requested: boolean
    @column()
    public reassign_notes: string
    @column.dateTime()
    public reassign_date: DateTime
    @column()
    public created_by: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => Order, { foreignKey: 'order_id' })
    public order: BelongsTo<typeof Order>
    @belongsTo(() => User, { foreignKey: 'sales_id' })
    public assigned_user: BelongsTo<typeof User>
    @belongsTo(() => User, { foreignKey: 'created_by' })
    public created_user: BelongsTo<typeof User>

    /**
     * **Suppot Ticket Count**
     * @param query_string
     * @returns *total, open, closed, unassigned*
     */
    static async count(query_string: Record<string, any>) {
        let { start_date = '', end_date = '' } = query_string
        let query = this.query() //total
        let query1 = this.query() //open
        let query2 = this.query() //closed
        let query3 = this.query() //unassigned

        query.count('id as count')
        query1.count('id as count').where('status', 'Open')
        query2.count('id as count').where('status', 'Close')
        query3.count('id as count').where('status', 'Unassigned')

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
            query3.where('created_at', '>=', start)
            query3.where('created_at', '<=', end)
        }

        let totalCount = await query
        let openCount = await query1
        let closedCount = await query2
        let unassignedCount = await query3

        return {
            total: totalCount[0].$extras.count,
            open: openCount[0].$extras.count,
            closed: closedCount[0].$extras.count,
            unassigned: unassignedCount[0].$extras.count,
        }
    }

    /**
     *
     * @param query_string
     */
    static async listing(query_string: Record<string, any>) {
        let {
            page = 1,
            start_date = null,
            end_date = null,
            status = null,
            created_by = null,
            search_key = null,
        } = query_string
        let query = this.query()
        const limit = 10
        let total_count = await this.query().count('id as count').first()
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
        if (created_by) {
            query.where('created_by', created_by)
        }
        if (search_key) {
            query.orWhere('customer_name', 'like', `%${search_key}%`)
            query.orWhere('phone', 'like', `%${search_key}%`)
        }
        let data = await query
            .preload('assigned_user', (user_q) => user_q.select('name', 'id'))
            .preload('created_user', (user_q) => user_q.select('name', 'id'))
            .select('*')
            .paginate(page, limit)
        return { data: data, total_count: total_count!.$extras.count }
    }
}
