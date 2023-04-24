import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import CustomerPoc from 'App/Models/CustomerPoc'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await CustomerPoc.create({
            customer_id: 1,
            poc_name: 'Rocky',
            phone: '7350228745',
            email: 'rockyshinde@scube.me',
            designation: 'Purchase Manager',
            image: 'https://atd-admin.s3.amazonaws.com/1662976287932_.jpeg',
        })
    }
}
