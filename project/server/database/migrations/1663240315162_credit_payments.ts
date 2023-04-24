import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'credit_payments'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('customer_id').unsigned().references('id').inTable('customers')
            table.timestamp('due_date', { useTz: true }).notNullable()
            table.double('interest').notNullable().defaultTo(0)
            table.double('amount').notNullable()
            table.string('status').notNullable()
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
