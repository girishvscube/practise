import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'leads'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('company_name', 100).nullable().unique()
            table.string('email', 200).nullable().unique()
            table.string('contact_person_name', 100).nullable()
            table.string('status', 50).nullable()
            table.integer('industry_type')
            table.double('fuel_usage_per_month').nullable()
            table.string('source', 50).nullable()
            table.integer('assigned_to').unsigned().references('id').inTable('users').nullable()
            table.string('address', 200).nullable()
            table.string('city', 50).nullable()
            table.string('state', 100).nullable()
            table.string('pincode', 6).nullable()
            table.boolean('is_reassign_req').defaultTo(false)
            table.dateTime('callback_time').nullable()
            table.string('company_phone', 20).notNullable()
            table.string('contact_person_phone', 20).nullable()
            table.integer('created_by').unsigned().references('id').inTable('users').nullable()
            table.string('re_assign_notes').nullable()
            table.timestamp('re_assign_date').nullable()
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
