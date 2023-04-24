import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import TimeSlot from 'App/Models/TimeSlot'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        TimeSlot.createMany([
            {
                start: '6:00',
                end: '12:00',
            },
            {
                start: '12:00',
                end: '18:00',
            },
            {
                start: '18:00',
                end: '23:59',
            },
            {
                start: '1:00',
                end: '6:00',
            },
        ])
    }
}
