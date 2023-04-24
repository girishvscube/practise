import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UsersSchema extends BaseSchema {
    protected tableName = 'users'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('name', 50).notNullable()
            table.string('email', 255).notNullable().unique()
            table.string('phone', 15).notNullable()
            table.string('password', 180).notNullable()
            table.string('address', 500).notNullable()
            table.string('city', 50).notNullable()
            table.string('state', 50).notNullable()
            table.string('pincode', 6).notNullable()
            table.string('image', 255).nullable()
            table.boolean('is_active').defaultTo(1)
            table.boolean('is_new_user').defaultTo(1)
            table.string('reset_token', 255).nullable()
            table.string('dl_image', 255).nullable()
            table.integer('role_id').unsigned().references('id').inTable('roles').notNullable()
            table.integer('created_by').unsigned().references('id').inTable('users').nullable()
            table.json('images')
            table.json('bank_details')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
