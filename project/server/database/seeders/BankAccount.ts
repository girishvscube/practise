import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import BankAccount from 'App/Models/BankAccount'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        BankAccount.createMany([
            {
                account_name: 'ATD CASH IN HAND',
                account_type: 'Cash In Hand',
                account_number: '000000000000',
                as_of_date: DateTime.now(),
                bank_name: 'ATD CASH IN HAND',
                ifsc_code: 'ACIH000000',
                opening_balance: 0,
                print_ac_number: false,
                is_active: false,
            },
            {
                account_name: 'ATD ICICI',
                account_type: 'Current',
                account_number: '012345678912',
                as_of_date: DateTime.now(),
                bank_name: 'ICICI',
                ifsc_code: 'ICIC123456',
                opening_balance: 1234567,
            },
        ])
    }
}
