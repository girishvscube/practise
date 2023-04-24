import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'orders'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table
                .integer('customer_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('customers')
            table.string('order_type').notNullable()
            table.date('delivery_date').notNullable()

            table.string('fuel_qty').notNullable()
            table.string('discount_type').nullable()
            table.double('discount').nullable()
            table.double('per_litre_cost').nullable()
            table.double('total_amount').nullable()
            table.double('delivery_charges').nullable().defaultTo(0)
            table.double('grand_total').nullable()
            table.double('balance').nullable().defaultTo(0.0)
            table.timestamp('due_date').nullable()
            table.timestamp('last_date').nullable()
            table.string('payment_type').nullable()
            table.string('payment_rules').nullable()
            table.string('payment_status').nullable().defaultTo('UN_PAID')
            table.string('additional_notes').nullable()
            table.json('customer_delivery_details')
            table.string('time_slot')
            table
                .integer('sales_executive_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('users')
            table.string('status').notNullable()
            table.boolean('is_order_confirmed').notNullable().defaultTo(false)
            table.boolean('is_order_delivered').notNullable().defaultTo(false)
            table.boolean('is_order_cancelled').notNullable().defaultTo(false)

            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
