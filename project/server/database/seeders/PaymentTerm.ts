import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import PaymentTerm from 'App/Models/PaymentTerm'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        PaymentTerm.createMany([
            {
                id: 1,
                name: 'Credit',
                rules: '1. Should be paid before due date \n 2. If not some interest will be applied on outstanding amount',
            },
            {
                id: 2,
                name: 'PIA',
                rules: '1. Should pay 100% in advance',
            },
            {
                id: 3,
                name: 'POD',
                rules: '1. Should pay paid after delivery',
            },
        ])
    }
}
