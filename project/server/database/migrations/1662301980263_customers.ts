import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'customers'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('company_name', 50).unique()
            table.string('phone', 20).notNullable()
            table.string('email', 150).unique()
            table.string('industry_type')
            table.string('equipment')
            table.string('address', 500)
            table.string('city', 50)
            table.integer('pincode')
            table.string('state')
            table.string('image')
            table.integer('sales_executive_id').unsigned().references('id').inTable('users')
            table.string('account_name', 150).nullable()
            table.string('account_number', 200).nullable()
            table.string('bank_name', 100).nullable()
            table.string('ifsc_code', 50).nullable()
            table.string('cancelled_cheque').nullable()
            table.string('gst_no', 200).nullable()
            table.string('gst_certificate').nullable()
            table.boolean('is_credit_availed').notNullable().defaultTo(false)
            table.double('credit_limit')
            table.double('outstanding_amount').notNullable().defaultTo(0)
            table
                .integer('credit_net_due_id')
                .unsigned()
                .references('id')
                .inTable('credit_net_dues')
            table.string('credit_pan')
            table.string('credit_aadhaar')
            table.string('credit_bank_statement')
            table.string('credit_blank_cheque')
            table.string('credit_cibil')
            table.double('late_charges').notNullable().defaultTo(0.0)
            table.string('charges_type').notNullable().defaultTo('Percentage')
            table.integer('grace_period').notNullable().defaultTo(0.0)
            table.string('customer_type', 50).notNullable().defaultTo('Company')
            table.double('opening_balance').notNullable().defaultTo(0.0)
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
