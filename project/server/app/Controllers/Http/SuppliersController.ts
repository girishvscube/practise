import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SUPPLIER_TYPE } from 'App/Helpers/supplier.constants'
import PurchaseOrder from 'App/Models/PurchaseOrder'
import Supplier from 'App/Models/Supplier'
import Validator from 'validatorjs'
const { each } = require('lodash')
import { schema } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { toS3 } from 'App/Helpers/upload'

export default class SuppliersController {
    /**
     * @param response
     */
    public async dropdown({ response }: HttpContextContract) {
        try {
            let data = await Supplier.dropdown()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    /**
     * @param response
     */
    public async count({ response }: HttpContextContract) {
        try {
            let data = await Supplier.count()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param response
     */
    public async poStats({ request, response }: HttpContextContract) {
        try {
            let data = await Supplier.viewPOCount(request.params().id, request.qs())
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param response
     */
    public async type({ response }: HttpContextContract) {
        return response.json(SUPPLIER_TYPE)
    }

    /**
     * @ctx
     */
    public async index(ctx: HttpContextContract) {
        try {
            return await Supplier.listing(ctx.request.qs())
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
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
            let supplier: any = await Supplier.query().where('id', request.param('id')).first()

            if (!supplier) {
                return response.notFound({ message: `Supplier Not Found` })
            }

            supplier.logs = await supplier.getLogs()

            return response.json(supplier)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { supplier } = ctx.request
        return this.save(ctx, supplier)
    }
    /**
     * @param ctx
     */
    public async getPOListById({ request, response }: HttpContextContract) {
        try {
            let data = await PurchaseOrder.getListBySupplierId(request.params().id, request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    private async save({ request, response }: HttpContextContract, record: Supplier | null = null) {
        try {
            const data = request.only([
                'name',
                'phone',
                'email',
                'type',
                'address',
                'city',
                'location',
                'pincode',
                'state',
                'account_number',
                'account_name',
                'bank_name',
                'ifsc_code',
                'cancelled_cheque',
                'gst',
                'gst_certificate',
                'image',
            ]) as Supplier
            const rules: any = {
                name: 'required|max:100',
                phone: 'required|max:10',
                email: 'required|email',
                type: 'required|max:100',
                address: 'required',
                city: 'required',
                location: 'required',
                pincode: 'required|min:6|max:6|string',
                state: 'required',
                account_number: 'required',
                account_name: 'required',
                bank_name: 'required',
                ifsc_code: 'required',
                gst: 'required',
            }

            const validation = new Validator(request.all(), rules)
            const uploadSchema = schema.create({
                cancelled_cheque_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpg', 'jpeg', 'png', 'jfif', 'pdf'],
                }),
                gst_certificate_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpg', 'jpeg', 'png', 'jfif', 'pdf'],
                }),
                image_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpg', 'jpeg', 'png', 'jfif'],
                }),
            })

            const payload = await request.validate({ schema: uploadSchema })

            if (payload.cancelled_cheque_file) {
                const fileName = `${cuid()}.${payload.cancelled_cheque_file.extname}`
                await payload.cancelled_cheque_file.move(Application.tmpPath('uploads'), {
                    name: fileName,
                })
                data['cancelled_cheque'] = await toS3(
                    Application.tmpPath('uploads') + '/' + fileName
                )
            }

            if (payload.gst_certificate_file) {
                const fileName = `${cuid()}.${payload.gst_certificate_file.extname}`
                await payload.gst_certificate_file.move(Application.tmpPath('uploads'), {
                    name: fileName,
                })
                data['gst_certificate'] = await toS3(
                    Application.tmpPath('uploads') + '/' + fileName
                )
            }
            if (payload.image_file) {
                const fileName = `${cuid()}.${payload.image_file.extname}`
                await payload.image_file.move(Application.tmpPath('uploads'), {
                    name: fileName,
                })
                data['image'] = await toS3(Application.tmpPath('uploads') + '/' + fileName)
            }

            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            if (!record && (!data.gst_certificate || !data.cancelled_cheque)) {
                return response.badRequest({ message: 'Please upload gst and bank check image' })
            }
            let supplier: any = record

            const existingUserByEmail = await Supplier.query().where('email', data.email).first()

            if (record === null) {
                supplier = new Supplier()
            }

            if (existingUserByEmail && existingUserByEmail.id !== supplier.id) {
                if (existingUserByEmail.email.toLowerCase() === data.email.toLowerCase()) {
                    return response.badRequest({
                        message: 'Supplier already exists for given email address.',
                    })
                }
            }
            each(data, (value, key) => {
                supplier[key] = value
            })
            supplier = await supplier.save()
            response.json({
                message: `Supplier ${record ? 'Updated' : 'Created'} Successfully`,
                id: supplier.id,
            })
        } catch (exception) {
            console.log(exception)
            return response.internalServerError({ message: exception.message })
        }
    }
}
