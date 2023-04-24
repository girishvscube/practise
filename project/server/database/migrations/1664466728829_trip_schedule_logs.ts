import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'trip_schedule_logs'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('trip_id').unsigned().references('id').inTable('trips')
            table.integer('so_id').unsigned().references('id').inTable('orders')
            table.integer('po_id').unsigned().references('id').inTable('purchase_orders')
            table.string('type')
            table.timestamp('start_time').nullable()
            table.timestamp('end_time').nullable()
            table.string('odometer_start')
            table.string('odometer_end')
            table.string('status')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
