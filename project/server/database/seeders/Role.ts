import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await Role.createMany([
            {
                name: 'Admin',
                slug: 'admin',
            },
            {
                name: 'Manager',
                slug: 'manager',
            },
            {
                name: 'Sales Manager',
                slug: 'sales_manager',
            },
            {
                name: 'Sales Executive',
                slug: 'sales_executive',
            },
            {
                name: 'Driver',
                slug: 'driver',
            },
            {
                name: 'Support Manager',
                slug: 'support_manager',
            },
            {
                name: 'Support Executive',
                slug: 'support_executive',
            },
            {
                name: 'Accounting Manager',
                slug: 'accounting_manager',
            },
            {
                name: 'Fleet Manager',
                slug: 'fleet_manager',
            },
        ])
    }
}
