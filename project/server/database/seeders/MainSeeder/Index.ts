import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'

export default class extends BaseSeeder {
    private async runSeeder(Seeder: { default: typeof BaseSeeder }) {
        /**
         * Do not run when not in dev mode and seeder is development
         * only
         */
        if (Seeder.default.developmentOnly && !Application.inDev) {
            return
        }

        // await new Seeder.default(this.client).run()
    }
    public async run() {
        // Write your database queries inside the run method
        await this.runSeeder(await import('../Role'))
        await this.runSeeder(await import('../User'))
        await this.runSeeder(await import('../Equipment'))
        await this.runSeeder(await import('../IndustryType'))
        await this.runSeeder(await import('../TimeSlot'))
        await this.runSeeder(await import('../CreditNetDue'))
        await this.runSeeder(await import('../PaymentTerm'))
        await this.runSeeder(await import('../ParkingStation'))
        await this.runSeeder(await import('../Bowser'))
        await this.runSeeder(await import('../Supplier'))
        await this.runSeeder(await import('../BankAccount'))
        await this.runSeeder(await import('../Customer'))
        await this.runSeeder(await import('../CustomerPoc'))
        await this.runSeeder(await import('../CustomerDeliveryDetail'))
    }
}
