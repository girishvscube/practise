import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Supplier from 'App/Models/Supplier'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await Supplier.createMany([
            {
                account_name: 'Laksken Industrial Diesel ICICI',
                account_number: '012354698752',
                address: 'Test',
                bank_name: 'ICICI',
                city: 'Test',
                email: 'test@gmail.com',
                gst: 'GSTIN123456789',
                ifsc_code: 'ICIC012345',
                name: 'Test',
                phone: '9563021545',
                pincode: 424505,
                state: 'Karnataka',
                type: 'Distributor',
            },
            {
                account_name: 'Sri Durga Ms HDFC',
                account_number: '0100000698752',
                address: 'Test',
                bank_name: 'HDFC',
                city: 'Test',
                email: 'test1@gmail.com',
                gst: 'GSTIN123456789',
                ifsc_code: 'HDFC012345',
                name: 'Test',
                phone: '9563021541',
                pincode: 424505,
                state: 'Karnataka',
                type: 'Distributor',
            },
        ])
    }
}
