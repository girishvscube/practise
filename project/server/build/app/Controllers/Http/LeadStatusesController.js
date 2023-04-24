"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LeadStatus_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/LeadStatus"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class LeadStatusesController {
    async index({ response }) {
        try {
            let data = await LeadStatus_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await LeadStatus_1.default.query().where('id', request.params().id).first();
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
        let leadstatus = ctx.request.leadstatus;
        return await this.save(ctx, leadstatus);
    }
    async destroy(ctx) {
        try {
            let leadstatus = ctx.request.leadstatus;
            await leadstatus.delete();
            if (leadstatus.$isDeleted) {
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
            let lead_status = record;
            if (record === null) {
                lead_status = new LeadStatus_1.default();
            }
            lead_status.name = data.name.toUpperCase().replace(' ', '_');
            lead_status.color = data.color;
            lead_status = await lead_status.save();
            return response.json({
                message: ` Status ${record === null ? 'Added' : 'Updated'}!`,
                id: lead_status.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = LeadStatusesController;
//# sourceMappingURL=LeadStatusesController.js.map