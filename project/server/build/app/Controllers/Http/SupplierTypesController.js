"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SupplierType_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SupplierType"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class SupplierTypesController {
    async index({ response }) {
        try {
            let data = await SupplierType_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await SupplierType_1.default.query().where('id', request.params().id).first();
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
        let suppliertype = ctx.request.suppliertype;
        return await this.save(ctx, suppliertype);
    }
    async destroy(ctx) {
        let suppliertype = ctx.request.suppliertype;
        await suppliertype.delete();
        return ctx.response.json({ message: 'Supplier Type Deleted!' });
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
            let supplier_type = record;
            if (record === null) {
                supplier_type = new SupplierType_1.default();
            }
            supplier_type.name = data.name;
            supplier_type = await supplier_type.save();
            return response.json({
                message: `Supplier Type ${record === null ? 'Added' : 'Updated'}!`,
                id: supplier_type.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = SupplierTypesController;
//# sourceMappingURL=SupplierTypesController.js.map