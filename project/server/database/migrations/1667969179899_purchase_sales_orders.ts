import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'purchase_sales_orders'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table
                .integer('po_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('purchase_orders')
            table.integer('so_id').notNullable().unsigned().references('id').inTable('orders')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
