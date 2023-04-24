import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { fileUploadToS3 } from 'App/Helpers/upload'
import Customer from 'App/Models/Customer'
import CustomerPoc from 'App/Models/CustomerPoc'
import Validator from 'validatorjs'
const { each } = require('lodash')
import { schema } from '@ioc:Adonis/Core/Validator'

export default class CustomerPocController {
    /**
     * @param response
     * @param params
     */
    public async dropdown({ response, params }: HttpContextContract) {
        try {
            let list = await CustomerPoc.dropdown(params.id)
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
            const customerPocs = await CustomerPoc.listing(params.id)
            return response.json(customerPocs)
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
            let customerPOC: any = request.customerpoc
            return response.json(customerPOC)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { customerpoc } = ctx.request
        return this.save(ctx, customerpoc)
    }

    /**
     * @param request
     * @param response
     *
     */
    public async destroy({ request, response }) {
        try {
            let customerpoc = request.customerpoc
            customerpoc.is_deleted = true

            await customerpoc.save()
            return response.json({ message: 'customer POC Deleted Successfully!' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: CustomerPoc | null = null
    ) {
        try {
            let data = request.only([
                'customer_id',
                'poc_name',
                'designation',
                'phone',
                'email',
                'image',
            ])
            const rules: any = {
                customer_id: 'required|numeric',
                poc_name: 'required|max:150',
                designation: 'required|max:100',
                phone: 'required|max:10',
                email: 'required|email',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let imgSchema = schema.create({
                image_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg'],
                }),
            })

            let payload = await request.validate({ schema: imgSchema })
            if (payload.image_file) {
                data.image = await fileUploadToS3(payload.image_file.extname, payload.image_file)
            }

            let customer = await Customer.query().where('id', data.customer_id).first()

            if (!customer) {
                return response.badRequest({ message: 'Customer not found!' })
            }

            let pocExists = await CustomerPoc.query()
                .where('email', data.email)
                .where('phone', data.phone)
                .where('customer_id', data.customer_id)
                .first()

            // data.image = await imageValidationAndUpdload(data.image)

            let customerpoc = record as any

            if (record === null) {
                customerpoc = new CustomerPoc()
            }

            if (pocExists && pocExists.id !== customerpoc.id) {
                return response.badRequest({
                    message: 'Phone or email already exists',
                })
            }

            each(data, (value, key) => {
                customerpoc[key] = value
            })
            await customerpoc.save()

            return response.json({
                message: `Ponit Of Contact ${record ? 'Updated' : 'Created'} Successfully`,
                customer_poc_id: customerpoc.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
