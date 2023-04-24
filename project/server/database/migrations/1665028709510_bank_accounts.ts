import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'bank_accounts'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('account_name')
            table.string('bank_name', 50)
            table.string('account_number')
            table.string('ifsc_code')
            table.double('opening_balance')
            table.timestamp('as_of_date')
            table.boolean('print_ac_number').defaultTo(false)
            table.string('account_type')
            table.boolean('print_upi_qr').defaultTo(false)
            table.string('upi_id')
            table.boolean('is_active').defaultTo(true)
            table.string('qr_code')
            table.timestamps()
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
