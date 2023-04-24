"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const upload_1 = global[Symbol.for('ioc.use')]("App/Helpers/upload");
const BankAccount_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/BankAccount"));
const CashInHand_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CashInHand"));
const Expense_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Expense"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class ExpensesController {
    async count({ request, response }) {
        try {
            let data = await Expense_1.default.count(request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let data = await Expense_1.default.listing(request.qs());
            return response.send(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await Expense_1.default.query()
                .preload('bank_account')
                .where('id', request.params().id)
                .first();
            data.logs = await data.getLogs();
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
        let expense = ctx.request.expense;
        return await this.save(ctx, expense);
    }
    async save({ request, auth, response }, record = null) {
        let data = request.only([
            'date_of_expense',
            'expense_type',
            'sub_category',
            'item_name',
            'payee',
            'amount',
            'account_id',
            'reference_img',
        ]);
        let rules = {
            date_of_expense: 'required|date',
            expense_type: 'required',
            sub_category: 'required',
            item_name: 'required',
            payee: 'required',
            amount: 'required|numeric',
        };
        const validation = new validatorjs_1.default(request.all(), rules);
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors);
        }
        let imgSchema = Validator_1.schema.create({
            reference_img_file: Validator_1.schema.file.optional({
                size: '5mb',
                extnames: ['jpeg', 'jpg'],
            }),
        });
        let payload = await request.validate({ schema: imgSchema });
        if (payload.reference_img_file) {
            data.reference_img = await (0, upload_1.fileUploadToS3)(payload.reference_img_file.extname, payload.reference_img_file);
        }
        let expense = record;
        let bank_acc = await BankAccount_1.default.findOrFail(data.account_id);
        if (expense === null) {
            expense = new Expense_1.default();
        }
        each(data, (value, key) => {
            expense[key] = value;
        });
        expense = await expense.save();
        if (bank_acc.account_type === 'Cash In Hand') {
            let cashinhand = null;
            if (record) {
                cashinhand = await CashInHand_1.default.query().where('expense_id', record.id).first();
            }
            if (cashinhand === null) {
                cashinhand = new CashInHand_1.default();
            }
            cashinhand.type = 'Cash Decrease';
            cashinhand.amount = -data.amount;
            cashinhand.adjustment_date = data.date_of_expense;
            cashinhand.expense_id = expense.id;
            await cashinhand.save();
            await cashinhand.log(auth.user, {
                message: `Cash in hand ${record === null ? 'Created' : 'Updated'} Successfully`,
            });
        }
        await expense.log(auth.user, {
            message: `Expense with amount Rs.${expense.amount} was deducted from  ${record === null ? 'Created' : 'Updated'} Successfully`,
            type: 'ACTION',
        });
        return response.json({
            message: `Expense ${record === null ? 'Created' : 'Updated'} Successfully`,
            id: expense.id,
        });
    }
}
exports.default = ExpensesController;
//# sourceMappingURL=ExpensesController.js.map