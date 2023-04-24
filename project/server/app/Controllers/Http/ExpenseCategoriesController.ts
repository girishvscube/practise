import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExpenseCategory from 'App/Models/ExpenseCategory'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class ExpenseCategoriesController {
    /**
     * @param response
     * @returns ExpenseCategory[]
     */
    public async index({ request, response }: HttpContextContract) {
        try {
            let name = request.params().name
            let data = await ExpenseCategory.listing(name)
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let expensecategory = ctx.request.expensecategory
        return await this.save(ctx, expensecategory)
    }

    public async destroy(ctx) {
        let expensecategory = ctx.request.expensecategory as ExpenseCategory
        await expensecategory.delete()
        if (expensecategory.$isDeleted) {
            return ctx.response.json({
                message: `Expense Category Deleted Successfully!`,
            })
        } else {
            return ctx.response.json({
                message: `Something went wrong while deleting ${expensecategory.sub_category}!`,
            })
        }
    }

    private async save({ request, response }, record: ExpenseCategory | null = null) {
        let data = request.only(['name', 'sub_category'])

        let rules = {
            name: 'required',
            sub_category: 'required|string',
        }

        const validation = new Validator(request.all(), rules)
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors)
        }
        if (data.name === 'Direct' || data.name === 'Indirect') {
            let expense_category = record
            if (expense_category === null) {
                expense_category = new ExpenseCategory()
            }

            each(data, (value, key) => {
                expense_category![key] = value
            })

            expense_category = await expense_category.save()
            return response.json({
                message: `Expense Category ${record === null ? 'Created' : 'Updated'} Successfully`,
                id: expense_category.id,
            })
        } else {
            return response.badRequest({
                message: `name can only be 'Direct' or 'Indirect'`,
            })
        }
    }
}
