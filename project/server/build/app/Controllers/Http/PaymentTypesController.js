"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PaymentType_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PaymentType"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class PaymentTypesController {
    async index({ response }) {
        try {
            let data = await PaymentType_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await PaymentType_1.default.query().where('id', request.params().id).first();
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
        let paymenttype = ctx.request.paymenttype;
        return await this.save(ctx, paymenttype);
    }
    async destroy(ctx) {
        try {
            let paymenttype = ctx.request.paymenttype;
            if (paymenttype.name === 'Bank Transfer' || paymenttype.name === 'Cash') {
                return ctx.response.badRequest({
                    messge: `Type: ${paymenttype.name} cannot be deleted`,
                });
            }
            await paymenttype.delete();
            if (paymenttype.$isDeleted) {
                return ctx.response.json({ message: `Type: ${paymenttype.name} is deleted` });
            }
            else {
                return ctx.response.badRequest({ message: 'Failed to delete' });
            }
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.message });
        }
    }
    async save({ request, response }, record = null) {
        let data = request.only(['name']);
        let rules = {
            name: 'required',
        };
        const validation = new validatorjs_1.default(request.all(), rules);
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors);
        }
        let payment_type = record;
        if (payment_type === null) {
            payment_type = new PaymentType_1.default();
        }
        each(data, (value, key) => {
            payment_type[key] = value;
        });
        payment_type = await payment_type.save();
        return response.json({
            message: `Payment Type ${record === null ? 'Added' : 'Updated'} Successfully`,
            id: payment_type.id,
        });
    }
}
exports.default = PaymentTypesController;
//# sourceMappingURL=PaymentTypesController.js.map