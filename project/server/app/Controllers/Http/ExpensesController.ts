import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import { imageValidationAndUpdload } from 'App/Helpers/upload'
import { schema } from '@ioc:Adonis/Core/Validator'
import { fileUploadToS3 } from 'App/Helpers/upload'
import BankAccount from 'App/Models/BankAccount'
import CashInHand from 'App/Models/CashInHand'

import Expense from 'App/Models/Expense'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class ExpensesController {
    public async count({ request, response }: HttpContextContract) {
        try {
            let data = await Expense.count(request.qs())
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async index({ request, response }: HttpContextContract) {
        try {
            let data = await Expense.listing(request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await Expense.query()
                .preload('bank_account')
                .where('id', request.params().id)
                .first()
            data!.logs = await data!.getLogs()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async store(ctx) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let expense = ctx.request.expense as Expense
        return await this.save(ctx, expense)
    }

    private async save(
        { request, auth, response }: HttpContextContract,
        record: Expense | null = null
    ) {
        let data = request.only([
            'date_of_expense',
            'expense_type',
            'sub_category',
            'item_name',
            'payee',
            'amount',
            'account_id',
            'reference_img',
        ]) as Expense

        let rules = {
            date_of_expense: 'required|date',
            expense_type: 'required',
            sub_category: 'required',
            item_name: 'required',
            payee: 'required',
            amount: 'required|numeric',
        }

        // data.reference_img = await imageValidationAndUpdload(data.reference_img)

        const validation = new Validator(request.all(), rules)
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors)
        }

        let imgSchema = schema.create({
            reference_img_file: schema.file.optional({
                size: '5mb',
                extnames: ['jpeg', 'jpg'],
            }),
        })

        let payload = await request.validate({ schema: imgSchema })
        if (payload.reference_img_file) {
            data.reference_img = await fileUploadToS3(
                payload.reference_img_file.extname,
                payload.reference_img_file
            )
        }

        let expense = record
        let bank_acc = await BankAccount.findOrFail(data.account_id)
        if (expense === null) {
            expense = new Expense()
        }

        each(data, (value, key) => {
            expense![key] = value
        })

        expense = await expense.save()
        if (bank_acc.account_type === 'Cash In Hand') {
            let cashinhand: CashInHand | null = null
            if (record) {
                cashinhand = await CashInHand.query().where('expense_id', record.id).first()
            }
            if (cashinhand === null) {
                cashinhand = new CashInHand()
            }
            cashinhand!.type = 'Cash Decrease'
            cashinhand!.amount = -data.amount
            cashinhand!.adjustment_date = data.date_of_expense
            cashinhand!.expense_id = expense.id
            await cashinhand!.save()
            await cashinhand!.log(auth.user, {
                message: `Cash in hand ${record === null ? 'Created' : 'Updated'} Successfully`,
            })
        }
        await expense.log(auth.user, {
            message: `Expense with amount Rs.${expense.amount} was deducted from  ${
                record === null ? 'Created' : 'Updated'
            } Successfully`,
            type: 'ACTION',
        })

        return response.json({
            message: `Expense ${record === null ? 'Created' : 'Updated'} Successfully`,
            id: expense.id,
        })
    }
}
