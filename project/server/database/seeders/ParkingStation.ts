import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ParkingStation from 'App/Models/ParkingStation'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await ParkingStation.createMany([
            {
                station_name: 'Section 57 Station 1',
                capacity: 5,
                address: 'test',
                city: 'Bangalore',
                pincode: 560062,
                state: 'Karnataka',
            },
            {
                station_name: 'Section 57 Station 2',
                capacity: 5,
                address: 'test',
                city: 'Bangalore',
                pincode: 560062,
                state: 'Karnataka',
            },
        ])
    }
}
