import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'order_pocs'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('order_id').notNullable().unsigned().references('id').inTable('orders')
            table
                .integer('customer_poc_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('customer_pocs')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
