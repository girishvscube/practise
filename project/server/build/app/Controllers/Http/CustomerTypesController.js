"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomerType_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CustomerType"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class CustomerTypesController {
    async index({ response }) {
        try {
            let data = await CustomerType_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await CustomerType_1.default.query().where('id', request.params().id).first();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.mesasge });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async update(ctx) {
        let customertype = ctx.request.customertype;
        return await this.save(ctx, customertype);
    }
    async destroy(ctx) {
        try {
            let customertype = ctx.request.customertype;
            await customertype.delete();
            if (customertype.$isDeleted) {
                return ctx.response.json({ message: 'Type Deleted' });
            }
            else {
                return ctx.response.json({ message: 'Type Deletion failed' });
            }
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge });
        }
    }
    async save({ request, response }, record = null) {
        try {
            let data = request.only(['name']);
            let rules = {
                name: 'required',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let customer_type = record;
            if (record === null) {
                customer_type = new CustomerType_1.default();
            }
            customer_type.name = data.name;
            customer_type = await customer_type.save();
            return response.json({
                message: ` Type ${record === null ? 'Added' : 'Updated'}!`,
                id: customer_type.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = CustomerTypesController;
//# sourceMappingURL=CustomerTypesController.js.map