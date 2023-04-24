import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'pay_in_invoices'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('pay_in_id').notNullable().unsigned().references('id').inTable('pay_ins')
            table.integer('order_id').notNullable().unsigned().references('id').inTable('orders')
            table.double('amount')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
