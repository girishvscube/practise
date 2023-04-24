import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'pay_outs'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table
                .integer('supplier_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('suppliers')
            table
                .integer('bank_account_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('bank_accounts')
            table.integer('no_of_invoices').notNullable()
            table.timestamp('payout_date').notNullable()
            table.double('amount').notNullable()
            table.string('notes').nullable()

            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
