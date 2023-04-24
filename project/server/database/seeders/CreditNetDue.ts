import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CreditNetDue from 'App/Models/CreditNetDue'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await CreditNetDue.createMany([
            {
                name: '10 Days',
                days: 10,
            },
            {
                name: '15 Days',
                days: 15,
            },
            {
                name: '20 Days',
                days: 20,
            },
        ])
    }
}
