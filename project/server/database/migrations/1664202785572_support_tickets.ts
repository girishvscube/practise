import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'support_tickets'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('order_id').nullable().unsigned().references('id').inTable('orders')
            table.string('customer_name').notNullable()
            table.string('issue_type').notNullable().defaultTo('Other')
            table.string('phone', 20).nullable()
            table.timestamp('call_back_time').nullable()
            table.string('more_info').nullable()
            table.integer('sales_id').nullable().unsigned().references('id').inTable('users')
            table.string('priority').nullable()
            table.string('image').nullable()
            table.string('status').nullable()
            table.boolean('is_reassign_requested').nullable()
            table.string('reassign_notes').nullable()
            table.timestamp('reassign_date').nullable()
            table.integer('created_by').nullable().unsigned().references('id').inTable('users')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
