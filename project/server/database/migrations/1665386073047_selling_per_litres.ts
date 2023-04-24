import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'selling_per_litres'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.double('price')
            table.boolean('is_active').defaultTo(true)
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
