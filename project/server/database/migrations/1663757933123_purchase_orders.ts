import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'purchase_orders'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('supplier_id').unsigned().references('id').inTable('suppliers')
            table.integer('bowser_id').unsigned().references('id').inTable('bowsers')
            table.integer('fuel_qty').notNullable()
            table.timestamp('purchase_date').notNullable()
            table.double('price_per_litre').notNullable()
            table.double('total_amount').notNullable()
            table.string('additional_notes').nullable()
            table.string('status').notNullable().defaultTo('PO_PROCESSING')
            table.double('balance').notNullable().defaultTo(0.0)
            table.string('payment_status').notNullable().defaultTo('UNPAID')
            table.boolean('is_order_confirmed').notNullable().defaultTo(false)
            table.boolean('is_order_delivered').notNullable().defaultTo(false)
            table.integer('no_of_order_linked').notNullable().defaultTo(0)
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
