import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'supplier_pocs'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('supplier_id').unsigned().references('id').inTable('suppliers')
            table.string('poc_name', 100)
            table.string('designation', 50)
            table.string('contact', 20).notNullable()
            table.string('email')
            table.string('image')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
