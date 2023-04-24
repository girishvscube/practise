import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'bowser_drivers'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.integer('user_id').unsigned().references('id').inTable('users')
            table.integer('bowser_id').unsigned().references('id').inTable('bowsers')
            table.timestamp('start_time').nullable()
            table.timestamp('end_time').nullable()
            table.string('status')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
