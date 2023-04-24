import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'trips'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table
                .integer('po_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('purchase_orders')
            table.timestamp('start_time').nullable()
            table.timestamp('end_time').nullable()
            table.timestamp('po_arrival_time').nullable()
            table.integer('driver_id').nullable().unsigned().references('id').inTable('users')
            table.integer('bowser_id').nullable().unsigned().references('id').inTable('bowsers')
            table.integer('distance_travelled').notNullable().defaultTo(0)
            table.timestamp('actual_end_time').nullable()
            table.integer('fuel_left_at_end').nullable()
            table.string('status').notNullable().defaultTo('NOT_SCHEDULED')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
