import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { fileUploadToS3 } from 'App/Helpers/upload'
import { schema } from '@ioc:Adonis/Core/Validator'
import BankAccount from 'App/Models/BankAccount'
import Validator from 'validatorjs'
import { BANK_LIST } from 'App/Helpers/cashInHand.constants'
const { each } = require('lodash')

export default class BankAccountsController {
    public async bankListDropdown({ response }: HttpContextContract) {
        return response.json(BANK_LIST)
    }

    public async index({ response }: HttpContextContract) {
        try {
            let data = await BankAccount.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await BankAccount.query()
                .select('*')
                .where('id', request.params().id)
                .first()
            data!.logs = await data!.getLogs()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let bankaccount = ctx.request.bankaccount as BankAccount
        return await this.save(ctx, bankaccount)
    }

    public async updateStatus({ request, auth, response }) {
        let bankaccount = request.bankaccount as BankAccount
        let is_active = request.body().is_active
        if (is_active === 1 || is_active === 0) {
            bankaccount.is_active = is_active
            await bankaccount.save()
            await bankaccount.log(auth.user, {
                message: `Bank account ${is_active === 1 ? 'restored!' : 'temporarily deleted'}`,
                type: 'ACTION',
            })
            return response.json({
                message: `Bank account ${is_active === 1 ? 'restored!' : 'temporarily deleted'}`,
            })
        } else {
            return response.badRequest({ messsage: 'Invalid payload was sent' })
        }
    }

    private async save(
        { request, auth, response }: HttpContextContract,
        record: BankAccount | null = null
    ) {
        try {
            let data = request.only([
                'account_name',
                'bank_name',
                'account_number',
                'ifsc_code',
                'opening_balance',
                'as_of_date',
                'print_ac_number',
                'print_upi_qr',
                'qr_code',
                'upi_id',
            ])
            let rules = {
                account_name: 'required',
                bank_name: 'required',
                account_number: 'required',
                ifsc_code: 'required',
                opening_balance: 'required|numeric',
                as_of_date: 'required|date',
                print_ac_number: 'required',
                print_upi_qr: 'required',
            }

            if (data.print_upi_qr === '1') {
                rules['upi_id'] = 'required|string'
                let qrSchema: any
                // if (record === null) {
                //     qrSchema = schema.create({
                //         qr_code: schema.file({
                //             size: '5mb',
                //             extnames: ['jpeg', 'jpg'],
                //         }),
                //     })
                // } else {
                qrSchema = schema.create({
                    qr_code_file: schema.file.optional({
                        size: '5mb',
                        extnames: ['jpeg', 'jpg'],
                    }),
                })
                // }

                let payload = await request.validate({
                    schema: qrSchema,
                })
                if (payload.qr_code_file) {
                    data.qr_code = await fileUploadToS3(
                        payload.qr_code_file.extname,
                        payload.qr_code_file
                    )
                }
            }
            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            // data.qr_code = await imageValidationAndUpdload(data.qr_code)

            let bank_account = record
            if (bank_account === null) {
                let check_account = await BankAccount.query()
                    .where('account_number', data.account_number)
                    .first()
                if (check_account) {
                    return response.badRequest({ message: 'Bank Account Number already present!' })
                }
                bank_account = new BankAccount()
            }

            each(data, (value, key) => {
                bank_account![key] = value
            })

            bank_account = await bank_account.save()
            await bank_account.log(auth.user, {
                message: `Bank account ${record === null ? 'Created' : 'Updated'} Successfully`,
                type: 'INFO',
            })
            return response.json({
                message: `Bank account ${record === null ? 'Created' : 'Updated'} Successfully`,
                id: bank_account.id,
            })
        } catch (exception) {
            return exception.message.includes('E_VALIDATION_FAILURE')
                ? response.internalServerError({ message: 'QR_Code file is invalid or not found' })
                : response.internalServerError({ message: exception.message })
        }
    }
}
