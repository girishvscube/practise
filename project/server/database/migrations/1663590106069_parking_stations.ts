import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'parking_stations'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('station_name', 150).notNullable().unique()
            table.integer('capacity').notNullable()
            table.string('address', 200).notNullable()
            table.string('city', 100).notNullable()
            table.integer('pincode').notNullable()
            table.string('state', 50).notNullable()
            table.boolean('is_active').notNullable().defaultTo(true)
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
