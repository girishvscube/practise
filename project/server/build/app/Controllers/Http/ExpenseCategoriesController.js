"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ExpenseCategory_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ExpenseCategory"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class ExpenseCategoriesController {
    async index({ request, response }) {
        try {
            let name = request.params().name;
            let data = await ExpenseCategory_1.default.listing(name);
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async update(ctx) {
        let expensecategory = ctx.request.expensecategory;
        return await this.save(ctx, expensecategory);
    }
    async destroy(ctx) {
        let expensecategory = ctx.request.expensecategory;
        await expensecategory.delete();
        if (expensecategory.$isDeleted) {
            return ctx.response.json({
                message: `Expense Category Deleted Successfully!`,
            });
        }
        else {
            return ctx.response.json({
                message: `Something went wrong while deleting ${expensecategory.sub_category}!`,
            });
        }
    }
    async save({ request, response }, record = null) {
        let data = request.only(['name', 'sub_category']);
        let rules = {
            name: 'required',
            sub_category: 'required|string',
        };
        const validation = new validatorjs_1.default(request.all(), rules);
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors);
        }
        if (data.name === 'Direct' || data.name === 'Indirect') {
            let expense_category = record;
            if (expense_category === null) {
                expense_category = new ExpenseCategory_1.default();
            }
            each(data, (value, key) => {
                expense_category[key] = value;
            });
            expense_category = await expense_category.save();
            return response.json({
                message: `Expense Category ${record === null ? 'Created' : 'Updated'} Successfully`,
                id: expense_category.id,
            });
        }
        else {
            return response.badRequest({
                message: `name can only be 'Direct' or 'Indirect'`,
            });
        }
    }
}
exports.default = ExpenseCategoriesController;
//# sourceMappingURL=ExpenseCategoriesController.js.map