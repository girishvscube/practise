import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Equipment from 'App/Models/Equipment'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await Equipment.createMany([
            {
                name: 'Bowser 4KL',
            },
            {
                name: 'Bowser 6KL',
            },
            {
                name: 'Bowser 8KL',
            },
        ])
    }
}
