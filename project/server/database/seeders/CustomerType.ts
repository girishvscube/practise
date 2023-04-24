import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CustomerType from 'App/Models/CustomerType'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await CustomerType.createMany([
            {
                id: 1,
                name: 'Company',
            },
            {
                id: 2,
                name: 'Individual',
            },
        ])
    }
}
