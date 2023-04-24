import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Bowser from 'App/Models/Bowser'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await Bowser.create({
            name: '1B 5000L',
            fuel_capacity: 5000,
            registration_no: 'REGD12345678912',
            status: 'Available',
            parking_station_id: 1,
        })
    }
}
