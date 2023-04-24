import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import IndustryType from 'App/Models/IndustryType'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await IndustryType.createMany([
            {
                name: 'Small Scale',
            },
            {
                name: 'Mid Scale',
            },
            {
                name: 'Large Scale',
            },
        ])
    }
}
