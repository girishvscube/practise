import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'permissions'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.integer('role_id').unsigned().references('id').inTable('roles').notNullable()
            table
                .integer('module_id')
                .unsigned()
                .references('id')
                .inTable('role_modules')
                .notNullable()
            table.boolean('is_read').defaultTo(false)
            table.boolean('is_write').defaultTo(false)
            table.boolean('is_delete').defaultTo(false)
            table.boolean('is_update').defaultTo(false)
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
