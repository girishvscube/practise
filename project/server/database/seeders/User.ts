import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await User.createMany([
            {
                name: 'Nayana',
                email: 'nayana@gmail.com',
                phone: '9874563214',
                address: `Davanagere`,
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560048',
                password: 'admin123',
                role_id: 1,
            },
            {
                name: 'Tejashree',
                email: 'tejashree@gmail.com',
                phone: '7352159807',
                address: `Hassan`,
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560048',
                password: 'Admin123',
                role_id: 1,
            },
            {
                name: 'Sanjana',
                email: 'sanjana@gmail.com',
                phone: '7052109807',
                address: `hassan`,
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560048',
                password: 'admin123',
                role_id: 1,
            },

        ])
    }
}
