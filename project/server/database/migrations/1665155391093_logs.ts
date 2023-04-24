import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Logs extends BaseSchema {
    protected tableName = 'logs'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('model_id')
            table.string('model', 100)
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable()
            table.string('message', 500)
            table.string('type', 30).defaultTo('ACTION')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
