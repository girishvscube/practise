import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CustomerDeliveryDetail from 'App/Models/CustomerDeliveryDetail'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await CustomerDeliveryDetail.create({
            customer_id: 1,
            address_1: 'Test',
            address_2: 'Test',
            pincode: 560001,
            address_type: 'work',
            city: 'Bangalore',
            state: 'Karnataka',
            phone: '7351023654',
            landmark: '',
            location: '',
            location_name: 'Test',
            customer_poc_id: 1,
            is_fuel_price_checked: false,
        })
    }
}
