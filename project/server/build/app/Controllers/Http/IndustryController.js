"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IndustryType_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/IndustryType"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class IndustryController {
    async dropdown({ response }) {
        try {
            let industries = await IndustryType_1.default.dropdown();
            return response.json(industries);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ response }) {
        try {
            let industries = await IndustryType_1.default.listing();
            return response.json(industries);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async show({ request, response }) {
        try {
            let industry = request.industrytype;
            return response.json(industry);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { industrytype } = ctx.request;
        return this.save(ctx, industrytype);
    }
    async destroy(ctx) {
        try {
            const industrytype = ctx.request.industrytype;
            await industrytype.delete();
            if (industrytype.$isDeleted) {
                return ctx.response.json({
                    message: `Industry Type Deleted!`,
                });
            }
            else {
                return ctx.response.badRequest({
                    message: `Something went wrong, Industry Type was not Deleted!`,
                });
            }
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.message });
        }
    }
    async save({ request, response }, record = null) {
        try {
            const data = request.only(['name']);
            const rules = {
                name: 'required|max:50',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            const IndustryNameExists = await IndustryType_1.default.query().where('name', data.name).first();
            let industry = record;
            if (record === null) {
                industry = new IndustryType_1.default();
            }
            if (IndustryNameExists && IndustryNameExists.id !== industry.id) {
                return response.badRequest({
                    message: 'Industry name already exists',
                });
            }
            each(data, (value, key) => {
                industry[key] = value;
            });
            await industry.save();
            return response.json({
                message: `Industry ${record ? 'Updated' : 'Created'} Successfully`,
            });
        }
        catch (exception) {
            throw exception;
        }
    }
}
exports.default = IndustryController;
//# sourceMappingURL=IndustryController.js.map