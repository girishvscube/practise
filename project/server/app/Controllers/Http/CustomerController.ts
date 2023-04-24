import { fileUploadToS3 } from 'App/Helpers/upload'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validator from 'validatorjs'
import Customer from 'App/Models/Customer'
import Order from 'App/Models/Order'
const { each } = require('lodash')
import { schema } from '@ioc:Adonis/Core/Validator'
import AccountsLog from 'App/Models/ValueChargesLog'

export default class CustomerController {
    /**
     * @param response
     */
    public async dropdown({ response }: HttpContextContract) {
        try {
            let customers = await Customer.dropdown()
            return response.json(customers)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param request
     * @param response
     */
    public async index({ request, response }) {
        try {
            const customers = await Customer.listing(request)
            let data: CustomerListing[] = []
            for (let index = 0; index < customers.data.length; index++) {
                const element = customers.data[index]
                data.push({
                    customer_type: element.customer_type,
                    company_name: element.company_name,
                    email: element.email,
                    id: element.id,
                    is_credit_availed: element.is_credit_availed ? true : false,
                    phone: element.phone,
                    sales_executive_id: element.sales_executive_id,
                    order_count: element.$extras.order_count,
                    total_revenue: element.$extras.total_revenue,
                    user_name: element.user?.name,
                })
            }
            // customers.data.forEach((element) => {
            // })
            return response.send({
                total_count: customers.total_count,
                meta: customers.data.getMeta(),
                data: data,
            })
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
    public async show({ request, response }: HttpContextContract) {
        try {
            let id = request.params().id
            let customer = await Customer.query()
                .preload('credit_net_due', (q) => q.select('*'))
                .preload('sales_executive', (q) => q.select('name'))
                .preload('user', (q) => q.select('name'))
                .where('id', id)
                .first()
            customer!.logs = await customer!.getLogs()
            return response.json(customer)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { customer } = ctx.request
        return this.save(ctx, customer)
    }

    /**
     * @param ctx
     */
    public async getCustomerOrders({ request, response }: HttpContextContract) {
        try {
            let data = await Order.getOrdersByCustomerId(request.params().id, request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async updateLateCharges({ request, auth, response }) {
        try {
            let data = request.only([
                'late_charges',
                'grace_period',
                'charges_type',
                'reset_to_default',
            ])
            let customer = request.customer as Customer

            let rules = {
                reset_to_default: 'required|boolean',
            }

            if (!data.reset_to_default) {
                rules['late_charges'] = 'required|numeric'
                rules['grace_period'] = 'required|numeric'
                rules['charges_type'] = 'required'
            } else {
                data.late_charges = 0
                data.grace_period = 0
                data.charges_type = 0
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            customer.late_charges = data.late_charges
            customer.grace_period = data.grace_period
            customer.charges_type = data.charges_type

            await customer.save()

            customer.log(auth.user, {
                message: `Customer charges_type: ${customer.charges_type}, late_charges: ${customer.late_charges}, grace_period: ${customer.grace_period} Successfully`,
                type: 'ACTION',
            })

            await AccountsLog.create({
                user_id: auth.user.id,
                type: 'ACTION',
                message: `Update LatePay Charges of  ${customer.company_name} to  charges_type: ${customer.charges_type}, late_charges: ${customer.late_charges}, grace_period: ${customer.grace_period}`,
            })

            return response.json({ message: 'Late Charges Updated' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    public async getLateCharges({ request, response }: HttpContextContract) {
        try {
            return await Customer.getLateChargesList(request.qs())
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async getPaymentList({ request, response }: HttpContextContract) {
        try {
            let id = request.params().id
            return await Customer.getListByCustomerId(id, request.qs())
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    private async save(
        { request, auth, response }: HttpContextContract,
        record: Customer | null = null
    ) {
        try {
            const data = request.only([
                'customer_type',
                'company_name',
                'phone',
                'email',
                'industry_type',
                'equipment',
                'address',
                'city',
                'pincode',
                'state',
                'image',
                'sales_executive_id',
                'account_name',
                'account_number',
                'bank_name',
                'ifsc_code',
                'cancelled_cheque',
                'gst_no',
                'gst_certificate',
                'is_credit_availed',
                'credit_limit',
                'credit_net_due_id',
                'credit_pan',
                'credit_aadhaar',
                'credit_bank_statement',
                'credit_blank_cheque',
                'credit_cibil',
                'outstanding_amount',
            ])
            const rules: any = {
                customer_type: 'required',
                company_name: 'required|max:50',
                phone: 'required|max:10',
                email: 'required|email',
                industry_type: 'required|string',
                equipment: 'required|string',
                address: 'required|max:500',
                city: 'required',
                pincode: 'required|numeric|min:100000|max:999999',
                state: 'required',
                sales_executive_id: 'required|numeric',
                is_credit_availed: 'required',
            }
            if (data.is_credit_availed === '1') {
                rules['credit_limit'] = 'required|numeric'
                rules['credit_net_due_id'] = 'required|numeric'
                rules['outstanding_amount'] = 'required|numeric'
            }

            if (data.customer_type === 'Company') {
                rules['account_name'] = 'required'
                rules['account_number'] = 'required'
                rules['bank_name'] = 'required'
                rules['ifsc_code'] = 'required'
                rules['gst_no'] = 'required'
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            let customer = record as any
            if (record === null) {
                customer = new Customer()
            }

            const customerExists = await Customer.query()
                .where('email', data.email)
                .orWhere('company_name', data.company_name)
                .orWhere('phone', data.phone)
                .first()

            if (customerExists && customerExists.id !== customer.id) {
                return response.badRequest({
                    message: 'Customer name, email or phone already exist',
                })
            }

            let imgSchema = schema.create({
                image_file: schema.file.optional({
                    size: '10mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'png'],
                }),
                cancelled_cheque_file: schema.file.optional({
                    size: '10mb',
                    extnames: ['jpeg', 'jpg', 'pdf'],
                }),
                gst_certificate_file: schema.file.optional({
                    size: '10mb',
                    extnames: ['pdf'],
                }),
                credit_pan_file: schema.file.optional({
                    size: '10mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                credit_aadhaar_file: schema.file.optional({
                    size: '10mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                credit_bank_statement_file: schema.file.optional({
                    size: '10mb',
                    extnames: ['pdf'],
                }),
                credit_blank_cheque_file: schema.file.optional({
                    size: '10mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                credit_cibil_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['pdf'],
                }),
            })

            let payload = await request.validate({ schema: imgSchema })
            if (payload.image_file) {
                data.image = await fileUploadToS3(payload.image_file.extname, payload.image_file)
            }
            if (payload.cancelled_cheque_file) {
                data.cancelled_cheque = await fileUploadToS3(
                    payload.cancelled_cheque_file.extname,
                    payload.cancelled_cheque_file
                )
            }
            if (payload.gst_certificate_file) {
                data.gst_certificate = await fileUploadToS3(
                    payload.gst_certificate_file.extname,
                    payload.gst_certificate_file
                )
            }

            if (data.is_credit_availed === '1') {
                if (payload.credit_pan_file) {
                    data.credit_pan = await fileUploadToS3(
                        payload.credit_pan_file.extname,
                        payload.credit_pan_file
                    )
                }
                if (payload.credit_aadhaar_file) {
                    data.credit_aadhaar = await fileUploadToS3(
                        payload.credit_aadhaar_file.extname,
                        payload.credit_aadhaar_file
                    )
                }
                if (payload.credit_bank_statement_file) {
                    data.credit_bank_statement = await fileUploadToS3(
                        payload.credit_bank_statement_file.extname,
                        payload.credit_bank_statement_file
                    )
                }
                if (payload.credit_blank_cheque_file) {
                    data.credit_blank_cheque = await fileUploadToS3(
                        payload.credit_blank_cheque_file.extname,
                        payload.credit_blank_cheque_file
                    )
                }
                if (payload.credit_cibil_file) {
                    data.credit_cibil = await fileUploadToS3(
                        payload.credit_cibil_file.extname,
                        payload.credit_cibil_file
                    )
                }
            } else {
                data.outstanding_amount = 0
                data.credit_pan = ''
                data.credit_aadhaar = ''
                data.credit_bank_statement = ''
                data.credit_blank_cheque = ''
                data.credit_cibil = ''
            }
            each(data, (value, key) => {
                customer[key] = value
            })
            await customer.save()
            customer.log(auth.user, {
                message: `Customer ${record ? 'Updated' : 'Created'} Successfully`,
                type: 'NOTE',
            })
            return response.json({
                message: `Customer ${record ? 'Updated' : 'Created'} Successfully`,
                customer_id: customer.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}

interface CustomerListing {
    customer_type: string
    company_name: string
    email: string
    id: number
    is_credit_availed: boolean
    phone: string
    sales_executive_id: number
    order_count: number
    total_revenue: number
    user_name: string
}
