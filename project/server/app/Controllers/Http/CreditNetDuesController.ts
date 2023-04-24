import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreditNetDue from 'App/Models/CreditNetDue'

export default class CreditNetDuesController {
    /**
     * @param response
     */
    public async dropdown({ response }: HttpContextContract) {
        try {
            let list = await CreditNetDue.dropdown()
            return response.json(list)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
