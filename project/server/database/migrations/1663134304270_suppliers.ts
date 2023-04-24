import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'suppliers'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('name', 100).notNullable()
            table.string('phone', 20).notNullable()
            table.string('email', 200).notNullable().unique()
            table.string('type', 50).notNullable()
            table.string('address', 150).notNullable()
            table.string('city', 100).notNullable()
            table.string('location').nullable()
            table.integer('pincode').notNullable()
            table.string('state', 100).notNullable()
            table.string('account_number').notNullable()
            table.string('account_name').notNullable()
            table.string('bank_name').notNullable()
            table.string('ifsc_code').notNullable()
            table.string('cancelled_cheque').nullable()
            table.string('gst').nullable()
            table.string('gst_certificate').nullable()
            table.string('image').nullable()
            table.double('per_litre_price').nullable()
            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true }).nullable()
            table.timestamp('updated_at', { useTz: true }).nullable()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
