import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'bowsers'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('name').notNullable().unique()
            table.string('registration_no').notNullable()
            table.integer('last_trip_id').nullable()
            table.integer('fuel_capacity').notNullable()
            table.integer('fuel_left').notNullable().defaultTo(0)
            table.string('image').nullable()
            table.string('registration').nullable()
            table.timestamp('registration_validity').nullable()
            table.string('pollution_cert').nullable()
            table.timestamp('pollution_cert_validity').nullable()
            table.string('vehicle_fitness').nullable()
            table.timestamp('vehicle_fitness_validity').nullable()
            table.string('heavy_vehicle').nullable()
            table.timestamp('heavy_vehicle_validity').nullable()
            table.string('other_doc').nullable()
            table.timestamp('other_doc_validity').nullable()
            table
                .integer('last_driver_id')
                .nullable()
                .unsigned()
                .references('id')
                .inTable('users')
                .defaultTo(null)
            table
                .integer('parking_station_id')
                .nullable()
                .unsigned()
                .references('id')
                .inTable('parking_stations')
            table.string('status').notNullable().defaultTo('AVAILABLE')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
