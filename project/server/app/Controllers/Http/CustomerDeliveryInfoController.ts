import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Customer from 'App/Models/Customer'
import CustomerDeliveryDetail from 'App/Models/CustomerDeliveryDetail'
import CustomerPoc from 'App/Models/CustomerPoc'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class CustomerDeliveryInfoController {
    /**
     * @param response
     * @param params
     */
    public async dropdown({ response, params }: HttpContextContract) {
        try {
            let list = await CustomerDeliveryDetail.dropdown(params.id)
            return response.json(list)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param params
     * @param response
     */
    public async getAllById({ params, response }: HttpContextContract) {
        try {
            const customerDeliveryDetails = await CustomerDeliveryDetail.listing(params.id)
            return response.json(customerDeliveryDetails)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    /**
     * @param request
     * @param response
     */
    public async show({ request, response }) {
        try {
            const { customerdeliverydetail } = request
            return response.json(customerdeliverydetail)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { customerdeliverydetail } = ctx.request
        return this.save(ctx, customerdeliverydetail)
    }

    /**
     * @param request
     * @param response
     *
     */
    public async destroy({ request, response }) {
        try {
            let customerdeliverydetail = request.customerdeliverydetail
            customerdeliverydetail.is_deleted = true

            await customerdeliverydetail.save()
            return response.json({ message: 'customer Delivery Location Deleted Successfully!' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: CustomerDeliveryDetail | null = null
    ) {
        try {
            let data = request.only([
                'customer_id',
                'address_1',
                'address_2',
                'pincode',
                'address_type',
                'city',
                'state',
                'phone',
                'landmark',
                'location',
                'location_name',
                'customer_poc_id',
                'is_fuel_price_checked',
                'fuel_price',
            ])
            const rules: any = {
                location_name: 'required',
                customer_id: 'required|numeric',
                address_1: 'required|max:150',
                pincode: 'required|numeric|min:100000|max:999999',
                address_type: 'required|max:100',
                city: 'required|max:50',
                state: 'required|max:100',
                phone: 'required|max:10',
                customer_poc_id: 'required|numeric',
                is_fuel_price_checked: 'required|boolean',
            }

            if (data.is_fuel_price_checked) {
                rules['fuel_price'] = 'required|numeric'
            } else {
                data.fuel_price = 0
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let customer = await Customer.find(data.customer_id)

            if (customer === null) {
                return response.badRequest({ message: 'Customer not found!' })
            }

            let customerPoc = await CustomerPoc.query()
                .where('id', data.customer_poc_id)
                .andWhere('customer_id', data.customer_id)
                .first()
            if (customerPoc === null) {
                return response.badRequest({ message: 'Customer POC not present' })
            }

            let exists = await CustomerDeliveryDetail.query()
                .where('address_1', data.address_1)
                .where('customer_id', data.customer_id)
                .first()

            let customerDeiveryLocation = record as any

            if (record === null) {
                customerDeiveryLocation = new CustomerDeliveryDetail()
            }

            if (exists && exists.id !== customerDeiveryLocation.id) {
                return response.badRequest({
                    message: 'Delivery address  already exists',
                })
            }

            each(data, (value, key) => {
                customerDeiveryLocation[key] = value
            })
            await customerDeiveryLocation.save()

            return response.json({
                message: `Delivery Location ${record ? 'Updated' : 'Created'} Successfully`,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
