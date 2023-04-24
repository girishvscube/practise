import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'pay_out_invoices'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .integer('purchase_order_id')
                .unsigned()
                .references('id')
                .inTable('purchase_orders')
            table.integer('pay_out_id').unsigned().references('id').inTable('pay_outs')
            table.double('amount')

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
