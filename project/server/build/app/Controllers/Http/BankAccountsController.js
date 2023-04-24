"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_1 = global[Symbol.for('ioc.use')]("App/Helpers/upload");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const BankAccount_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/BankAccount"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const cashInHand_constants_1 = global[Symbol.for('ioc.use')]("App/Helpers/cashInHand.constants");
const { each } = require('lodash');
class BankAccountsController {
    async bankListDropdown({ response }) {
        return response.json(cashInHand_constants_1.BANK_LIST);
    }
    async index({ response }) {
        try {
            let data = await BankAccount_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await BankAccount_1.default.query()
                .select('*')
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
        let bankaccount = ctx.request.bankaccount;
        return await this.save(ctx, bankaccount);
    }
    async updateStatus({ request, auth, response }) {
        let bankaccount = request.bankaccount;
        let is_active = request.body().is_active;
        if (is_active === 1 || is_active === 0) {
            bankaccount.is_active = is_active;
            await bankaccount.save();
            await bankaccount.log(auth.user, {
                message: `Bank account ${is_active === 1 ? 'restored!' : 'temporarily deleted'}`,
                type: 'ACTION',
            });
            return response.json({
                message: `Bank account ${is_active === 1 ? 'restored!' : 'temporarily deleted'}`,
            });
        }
        else {
            return response.badRequest({ messsage: 'Invalid payload was sent' });
        }
    }
    async save({ request, auth, response }, record = null) {
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
            ]);
            let rules = {
                account_name: 'required',
                bank_name: 'required',
                account_number: 'required',
                ifsc_code: 'required',
                opening_balance: 'required|numeric',
                as_of_date: 'required|date',
                print_ac_number: 'required',
                print_upi_qr: 'required',
            };
            if (data.print_upi_qr === '1') {
                rules['upi_id'] = 'required|string';
                let qrSchema;
                qrSchema = Validator_1.schema.create({
                    qr_code_file: Validator_1.schema.file.optional({
                        size: '5mb',
                        extnames: ['jpeg', 'jpg'],
                    }),
                });
                let payload = await request.validate({
                    schema: qrSchema,
                });
                if (payload.qr_code_file) {
                    data.qr_code = await (0, upload_1.fileUploadToS3)(payload.qr_code_file.extname, payload.qr_code_file);
                }
            }
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let bank_account = record;
            if (bank_account === null) {
                let check_account = await BankAccount_1.default.query()
                    .where('account_number', data.account_number)
                    .first();
                if (check_account) {
                    return response.badRequest({ message: 'Bank Account Number already present!' });
                }
                bank_account = new BankAccount_1.default();
            }
            each(data, (value, key) => {
                bank_account[key] = value;
            });
            bank_account = await bank_account.save();
            await bank_account.log(auth.user, {
                message: `Bank account ${record === null ? 'Created' : 'Updated'} Successfully`,
                type: 'INFO',
            });
            return response.json({
                message: `Bank account ${record === null ? 'Created' : 'Updated'} Successfully`,
                id: bank_account.id,
            });
        }
        catch (exception) {
            return exception.message.includes('E_VALIDATION_FAILURE')
                ? response.internalServerError({ message: 'QR_Code file is invalid or not found' })
                : response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = BankAccountsController;
//# sourceMappingURL=BankAccountsController.js.map