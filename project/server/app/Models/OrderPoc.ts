import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'
import CustomerPoc from './CustomerPoc'
import Model from './Model'

export default class OrderPoc extends Model {
    @column({ isPrimary: true })
    public id: number

    @column()
    public order_id: number

    @column()
    public customer_poc_id: number

    @belongsTo(() => Order, { foreignKey: 'order_id' })
    public order: BelongsTo<typeof Order>

    @belongsTo(() => CustomerPoc, { foreignKey: 'customer_poc_id' })
    public customer_poc: BelongsTo<typeof CustomerPoc>

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    static async checkPocForSameOrder(poc_id, order_id) {
        let is_poc_already_assigned = await this.query()
            .where('customer_poc_id', poc_id)
            .andWhere('order_id', order_id)
            .first()
        if (is_poc_already_assigned) {
            return true
        } else {
            return false
        }
    }

    static async saveOrderPoc(order_id: number, poc_ids: number[]) {
        try {
            let result
            for (let index = 0; index < poc_ids.length; index++) {
                const e = poc_ids[index]
                let is_poc_already_present = await this.checkPocForSameOrder(e, order_id)
                if (is_poc_already_present) {
                    result = {
                        status: is_poc_already_present,
                        message: `poc_id: ${e} is already linked to order`,
                    }
                    return result
                } else {
                    await this.create({ customer_poc_id: e, order_id: order_id })
                }
            }
        } catch (exception) {
            console.log(exception)
            throw exception
        }
    }

    static async getAllByOrderId(order_id: number) {
        try {
            return await this.query()
                .preload('customer_poc', (q) => q.select('*'))
                .preload('order', (q) => q.select('*'))
                .where('order_id', order_id)
        } catch (exception) {
            throw exception
        }
    }
}
