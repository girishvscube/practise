import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import DeliveryCharge from 'App/Models/DeliveryCharge'
import SellingPerLitre from 'App/Models/SellingPerLitre'
import Supplier from 'App/Models/Supplier'
import SupplierPerLitreLog from 'App/Models/SupplierPerLitreLog'
import Validator from 'validatorjs'
import ValueChargesLog from 'App/Models/ValueChargesLog'

export default class ValueAndChargesController {
    public async purhasePriceList({ request, response }: HttpContextContract) {
        try {
            let data = await Supplier.priceListing(request.qs())
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async currrentSellPriceList({ response }: HttpContextContract) {
        try {
            let data = await SellingPerLitre.query()
                .where('is_active', true)
                .first()
                .then((serialize) => serialize?.toJSON())

            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async sellPriceList({ request, response }: HttpContextContract) {
        try {
            let data = await SellingPerLitre.listing(request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async updateSellingPrice({ request, response, auth }) {
        try {
            let data = request.only(['price'])
            let rules = {
                price: 'required|numeric',
            }
            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            let selling_per_litre = await SellingPerLitre.query().where('is_active', 1).first()
            if (selling_per_litre) {
                selling_per_litre.is_active = false
                await selling_per_litre.save()
            }
            await SellingPerLitre.create({
                price: data.price,
            })

            await ValueChargesLog.create({
                user_id: auth.user.id,
                type: 'ACTION',
                message: `Update Selling Price to ${data.price}.`,
            })
            return response.json({ message: `Price updated to Rs. ${data.price}` })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async updatePriceBySupplierId({ request, response, auth }) {
        try {
            let supplier = request.supplier as Supplier
            let data = request.only(['per_litre_price'])
            let rules = {
                per_litre_price: 'required|numeric',
            }

            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            supplier.per_litre_price = data.per_litre_price

            await supplier.save()
            let supplier_per_litre_log = new SupplierPerLitreLog()
            supplier_per_litre_log.supplier_id = supplier.id
            supplier_per_litre_log.per_litre_price = data.per_litre_price

            await supplier_per_litre_log.save()

            await ValueChargesLog.create({
                user_id: auth.user.id,
                type: 'ACTION',
                message: `Update Litre Price of ${supplier.name} to ${data.per_litre_price}.`,
            })

            return response.json({ message: `Price updated to Rs. ${supplier.per_litre_price}` })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async deliveryChargesList({ response }) {
        try {
            let data = await DeliveryCharge.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async saveDeliveryCharges({ request, response, auth }) {
        try {
            let data = request.only(['type', 'charges']) as DeliveryCharge
            let rules = {
                type: 'required',
                charges: 'required|numeric',
            }
            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let delivery_charge = new DeliveryCharge()
            delivery_charge.type = data.type
            delivery_charge.charges = data.charges
            await delivery_charge.save()
            await ValueChargesLog.create({
                user_id: auth.user.id,
                type: 'ACTION',
                message: `Add Delivery Charges with type:${data.type}  and Rs.${data.charges}`,
            })

            return response.json({ message: 'New Delivery Charges Created' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    public async updateDeliveryCharges({ request, response, auth }) {
        try {
            let delivery_charge = request.deliverycharge as DeliveryCharge
            let data = request.only(['charges'])
            let rules = {
                charges: 'required|numeric',
            }
            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            delivery_charge.charges = data.charges
            await delivery_charge.save()
            await ValueChargesLog.create({
                user_id: auth.user.id,
                type: 'ACTION',
                message: `Update Delivery Charges of  ${delivery_charge.type} to  Rs.S${data.charges}`,
            })
            return response.json({ message: 'Delivery Charges Updated' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async logs({ request, response }) {
        try {
            let list = await ValueChargesLog.listing(request)
            return response.send(list)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
