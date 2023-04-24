"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PaymentTerm_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PaymentTerm"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class PaymentTermsController {
    async index({ response }) {
        try {
            let data = await PaymentTerm_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await PaymentTerm_1.default.query().where('id', request.params().id).first();
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
        const { paymentterm } = ctx.request;
        return this.save(ctx, paymentterm);
    }
    async save({ request, response }, record = null) {
        try {
            let data = request.only(['name', 'rules']);
            let rules = {
                name: 'required|max:50',
                rules: 'required',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let payment_term = record;
            if (record === null) {
                payment_term = new PaymentTerm_1.default();
            }
            each(data, (value, key) => {
                payment_term[key] = value;
            });
            await payment_term.save();
            response.json({
                message: `Payment Term ${record ? 'Updated' : 'Created'} Successfully`,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = PaymentTermsController;
//# sourceMappingURL=PaymentTermsController.js.map