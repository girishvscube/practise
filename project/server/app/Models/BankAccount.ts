import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import Model from './Model'

export default class BankAccount extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public account_name: string
    @column()
    public bank_name: string
    @column()
    public account_number: string
    @column()
    public account_type: string
    @column()
    public ifsc_code: string
    @column()
    public opening_balance: number
    @column.dateTime()
    public as_of_date: DateTime
    @column()
    public print_ac_number: boolean
    @column()
    public print_upi_qr: boolean
    @column()
    public upi_id: string
    @column()
    public qr_code: string
    @column()
    public is_active: boolean

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static async listing() {
        return this.query().select('*')
    }
}
