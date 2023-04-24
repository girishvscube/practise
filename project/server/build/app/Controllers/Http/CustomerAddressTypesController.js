"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomerAddressType_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CustomerAddressType"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class CustomerAddressTypesController {
    async index({ response }) {
        try {
            let data = await CustomerAddressType_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await CustomerAddressType_1.default.query().where('id', request.params().id).first();
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
        let customeraddresstype = ctx.request.customeraddresstype;
        return await this.save(ctx, customeraddresstype);
    }
    async destroy(ctx) {
        let customeraddresstype = ctx.request.customeraddresstype;
        await customeraddresstype.delete();
        if (customeraddresstype.$isDeleted) {
            customeraddresstype.log(ctx.auth.user, {
                message: 'Address Type Deleted!',
                type: 'ACTION',
            });
            return ctx.response.json({ message: 'Address Type Deleted!' });
        }
        else {
            customeraddresstype.log(ctx.auth.user, {
                message: 'Address Type Deletion Failed!',
                type: 'ACTION',
            });
            return ctx.response.json({ message: 'Address Type Deletion Failed!' });
        }
    }
    async save({ request, auth, response }, record = null) {
        try {
            let data = request.only(['name']);
            let rules = {
                name: 'required',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let customer_address_type = record;
            if (record === null) {
                customer_address_type = new CustomerAddressType_1.default();
            }
            customer_address_type.name = data.name;
            customer_address_type = await customer_address_type.save();
            customer_address_type.log(auth.user, {
                message: `Address Type ${record === null ? 'Added' : 'Updated'}!`,
                type: 'INFO',
            });
            return response.json({
                message: `Address Type ${record === null ? 'Added' : 'Updated'}!`,
                id: customer_address_type.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = CustomerAddressTypesController;
//# sourceMappingURL=CustomerAddressTypesController.js.map