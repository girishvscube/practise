"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LeadSource_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/LeadSource"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class LeadSourcesController {
    async index({ response }) {
        try {
            let data = await LeadSource_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await LeadSource_1.default.query().where('id', request.params().id).first();
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
        let leadsource = ctx.request.leadsource;
        return await this.save(ctx, leadsource);
    }
    async destroy(ctx) {
        try {
            let leadsource = ctx.request.leadsource;
            await leadsource.delete();
            if (leadsource.$isDeleted) {
                return ctx.response.json({ message: 'Source Deleted ' });
            }
            else {
                return ctx.response.json({ message: 'Source Deletion Failed' });
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
            let lead_source = record;
            if (record === null) {
                lead_source = new LeadSource_1.default();
            }
            lead_source.name = data.name;
            lead_source = await lead_source.save();
            return response.json({
                message: ` Source ${record === null ? 'Added' : 'Updated'}!`,
                id: lead_source.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = LeadSourcesController;
//# sourceMappingURL=LeadSourcesController.js.map