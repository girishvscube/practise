import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'customer_pocs'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('customer_id').unsigned().references('id').inTable('customers')
            table.string('poc_name', 100).notNullable()
            table.string('designation', 100).notNullable()
            table.string('phone', 20).notNullable()
            table.string('email', 200).notNullable()
            table.string('image').nullable()
            table.boolean('is_deleted').notNullable().defaultTo(false)
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
