import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'cash_in_hands'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('type').notNullable()
            table.double('amount').notNullable()
            table.integer('customer_id').unsigned().references('id').inTable('customers')
            table.integer('supplier_id').unsigned().references('id').inTable('suppliers')
            table.integer('expense_id').unsigned().references('id').inTable('expenses')
            table.integer('pay_in_id').unsigned().references('id').inTable('pay_ins')
            table.integer('pay_out_id').unsigned().references('id').inTable('pay_outs')
            table.timestamp('adjustment_date').notNullable()

            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
