import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import { SUPPLIER_TYPE } from 'App/Helpers/supplier.constants'
import moment from 'moment'
import PurchaseOrder from './PurchaseOrder'
import Model from './Model'

export default class Supplier extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public phone: string

    @column()
    public email: string

    @column()
    public type: string

    @column()
    public address: string

    @column()
    public city: string

    @column()
    public location: string

    @column()
    public pincode: number

    @column()
    public state: string

    @column()
    public account_number: string

    @column()
    public account_name: string

    @column()
    public bank_name: string

    @column()
    public ifsc_code: string

    @column()
    public cancelled_cheque: string

    @column()
    public gst: string

    @column()
    public gst_certificate: string
    @column()
    public image: string
    @column()
    public per_litre_price: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static async dropdown() {
        return await this.query().select('*')
    }

    static async listing(query_string: Record<string, any>) {
        try {
            let { page = 1, search_key = '' } = query_string
            const limit = 10
            let total_count = await this.query().count('id as count').first()
            let query = this.query()
            if (search_key) {
                query.orWhere('name', 'like', `%${search_key}%`)
                query.orWhere('phone', 'like', `%${search_key}%`)
                query.orWhere('email', 'like', `%${search_key}%`)
            }
            let data = await query.select('*').orderBy('id', 'desc').paginate(page, limit)
            return { data: data, total_count: total_count!.$extras.count }
        } catch (exception) {
            throw exception
        }
    }

    static async count() {
        try {
            let query = this.query() // total
            let query1 = this.query() // distributor
            let query2 = this.query() // terminal

            let totalCount = await query.count('id as count')
            let distributorCount = await query1
                .count('id as count')
                .where('type', SUPPLIER_TYPE[0].name)
            let terminalCount = await query2
                .count('id as count')
                .where('type', SUPPLIER_TYPE[1].name)
            return {
                total: totalCount[0].$extras.count,
                distributor: distributorCount[0].$extras.count,
                terminal: terminalCount[0].$extras.count,
            }
        } catch (exception) {
            throw exception
        }
    }

    static async viewPOCount(id: number, query_string: Record<string, any>) {
        let { start_date = '', end_date = '' } = query_string
        let query = PurchaseOrder.query() // total
        let query1 = PurchaseOrder.query() // distributor

        query.count('id as count').where('id', id)
        query1.sum('total_amount as total').where('id', id)

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
        }

        let totalCount = await query
        let distributorCount = await query1

        return {
            count: totalCount[0].$extras.count,
            total: distributorCount[0].$extras.total,
        }
    }

    static async priceListing(query_string: Record<string, any>) {
        let { page = 1, search_key = '', start_date = '', end_date = '' } = query_string
        const limit = 10
        let query = this.query().select('id', 'name', 'per_litre_price', 'updated_at')

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

        if (search_key) {
            query.where('name', 'like', `%${search_key}%`)
        }

        return await query
            .select('name', 'updated_at', 'per_litre_price')
            .orderBy('updated_at', 'desc')
            .paginate(page, limit)
    }
}
