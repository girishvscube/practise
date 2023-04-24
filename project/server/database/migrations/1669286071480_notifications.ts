import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'notifications'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('message').notNullable()
            table
                .integer('module_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('role_modules')
            table.integer('reference_id')
            table.integer('notify_to').nullable().unsigned().references('id').inTable('users')
            table.integer('assignee')
            table.boolean('is_read').defaultTo(false)
            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
