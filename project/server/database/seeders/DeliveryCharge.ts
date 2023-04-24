import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import DeliveryCharge from 'App/Models/DeliveryCharge'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await DeliveryCharge.createMany([
            {
                id: 1,
                charges: 0,
                type: 'Regular',
            },
            {
                id: 2,
                charges: 500,
                type: 'Express',
            },
        ])
    }
}
