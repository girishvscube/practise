import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'pay_ins'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table
                .integer('customer_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('customers')
            table
                .integer('bank_account_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('bank_accounts')
            table.integer('no_of_invoices').notNullable()
            table.timestamp('pay_in_date').notNullable()
            table.double('amount').notNullable()
            table.string('notes').nullable()

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
