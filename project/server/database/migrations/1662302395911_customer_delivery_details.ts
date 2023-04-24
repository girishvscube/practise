import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'customer_delivery_details'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('customer_id').unsigned().references('id').inTable('customers')
            table.string('address_1', 500).notNullable()
            table.string('address_2', 500).nullable()
            table.integer('pincode').notNullable()
            table.string('address_type', 100).notNullable()
            table.string('city', 50).notNullable()
            table.string('state', 100)
            table.string('phone', 20).notNullable()
            table.string('landmark', 100).nullable()
            table.string('location').nullable()
            table.string('location_name').nullable()
            table.boolean('is_fuel_price_checked').notNullable().defaultTo(false)
            table.double('fuel_price').nullable()
            table.boolean('is_deleted').notNullable().defaultTo(false)
            table.integer('customer_poc_id').unsigned().references('id').inTable('customer_pocs')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
