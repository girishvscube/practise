import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import RoleModule from 'App/Models/RoleModule'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await RoleModule.createMany([
            {
                id: 1,
                name: 'Dashboard',
                slug: 'dashboard',
            },
            {
                id: 2,
                name: 'Sales',
                slug: 'sales',
            },
            {
                id: 3,
                name: 'Leads',
                slug: 'leads',
                parent_id: 2,
            },
            {
                id: 4,
                name: 'Orders',
                slug: 'orders',
                parent_id: 2,
            },
            {
                id: 5,
                name: 'Purchase',
                slug: 'purchase-orders',
            },

            {
                id: 6,
                name: 'Customers',
                slug: 'customers',
            },

            {
                id: 7,
                name: 'Suppliers',
                slug: 'suppliers',
            },

            {
                id: 8,
                name: 'Support',
                slug: 'support',
            },

            {
                id: 9,
                name: 'Fleet Management',
                slug: 'fleet_manage',
            },

            {
                id: 10,
                name: 'Bowsers',
                slug: 'bowser',
                parent_id: 9,
            },
            {
                id: 11,
                name: 'Trips',
                slug: 'trips',
                parent_id: 9,
            },
            {
                id: 12,
                name: 'Parking Stations',
                slug: 'parking-station',
                parent_id: 9,
            },

            {
                id: 13,
                name: 'Users',
                slug: 'users',
            },

            {
                id: 14,
                name: 'Accounts',
                slug: 'accounts',
            },

            {
                id: 15,
                name: 'Invoice',
                slug: 'invoices',
                parent_id: 15,
            },
            {
                id: 16,
                name: 'Payments In',
                slug: 'payments-in',
                parent_id: 15,
            },
            {
                id: 17,
                name: 'Payments Out',
                slug: 'payments-out',
                parent_id: 15,
            },

            {
                id: 18,
                name: 'Purchase Bills',
                slug: 'purchase-bills',
                parent_id: 15,
            },

            {
                id: 19,
                name: 'Expense',
                slug: 'expenses',
                parent_id: 15,
            },

            {
                id: 20,
                name: 'Cash in hand',
                slug: 'cash-in-hand',
                parent_id: 15,
            },

            {
                id: 21,
                name: 'Values & Charges',
                slug: 'value-charges',
            },
            {
                id: 22,
                name: 'Settings',
                slug: 'settings',
            },
        ])
    }
}
