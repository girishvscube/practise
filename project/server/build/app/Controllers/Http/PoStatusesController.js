"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PoStatus_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PoStatus"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class PoStatusesController {
    async index({ response }) {
        try {
            let data = await PoStatus_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await PoStatus_1.default.query().where('id', request.params().id).first();
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
        let postatus = ctx.request.postatus;
        return await this.save(ctx, postatus);
    }
    async destroy(ctx) {
        try {
            let postatus = ctx.request.postatus;
            await postatus.delete();
            if (postatus.$isDeleted) {
                return ctx.response.json({ message: 'Status Deleted' });
            }
            else {
                return ctx.response.json({ message: 'Status Deletion Failed' });
            }
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge });
        }
    }
    async save({ request, response }, record = null) {
        try {
            let data = request.only(['name', 'color']);
            let rules = {
                name: 'required',
                color: 'string',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let po_status = record;
            if (record === null) {
                po_status = new PoStatus_1.default();
            }
            po_status.name = data.name.toUpperCase().replace(' ', '_');
            po_status.color = data.color;
            po_status = await po_status.save();
            return response.json({
                message: ` Status ${record === null ? 'Added' : 'Updated'}!`,
                id: po_status.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = PoStatusesController;
//# sourceMappingURL=PoStatusesController.js.map