import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'user_sessions'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('user_id').unsigned().references('id').inTable('users').nullable()
            table.json('location')
            table.json('device_info')
            table.timestamp('last_access_on').nullable()
            table.timestamp('signin_at').nullable()
            table.string('user_ip', 50)
            table.boolean('is_logged_out')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
