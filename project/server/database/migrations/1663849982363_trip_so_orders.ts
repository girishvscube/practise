import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'trip_so_orders'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('trip_id').notNullable().unsigned().references('id').inTable('trips')
            table.integer('so_id').notNullable().unsigned().references('id').inTable('orders')
            table.timestamp('schedule_time').nullable()
            table.integer('priority').notNullable().defaultTo(0)
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
