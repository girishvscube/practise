import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'expenses'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.timestamp('date_of_expense').notNullable()
            table.string('expense_type').notNullable()
            table.string('sub_category').nullable()
            table.string('item_name').notNullable()
            table.string('payee').notNullable()
            table.double('amount').notNullable()
            table
                .integer('account_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('bank_accounts')
            table.string('reference_img').nullable()
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
