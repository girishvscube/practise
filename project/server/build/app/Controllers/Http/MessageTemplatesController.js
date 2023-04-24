"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MessageTemplate_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/MessageTemplate"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class MessageTemplatesController {
    async index({ response }) {
        try {
            let data = await MessageTemplate_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await MessageTemplate_1.default.query().where('id', request.params().id).first();
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
        let messagetemplate = ctx.request.messagetemplate;
        return await this.save(ctx, messagetemplate);
    }
    async destroy(ctx) {
        try {
            let messagetemplate = ctx.request.messagetemplate;
            await messagetemplate.delete();
            if (messagetemplate.$isDeleted) {
                return ctx.response.json({ message: 'Template Deleted' });
            }
            else {
                return ctx.response.json({ message: 'Template Deletion Failed' });
            }
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge });
        }
    }
    async save({ request, response }, record = null) {
        try {
            let data = request.only(['type', 'message']);
            let rules = {
                type: 'required',
                message: 'required',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let message_template = record;
            if (record === null) {
                message_template = new MessageTemplate_1.default();
            }
            message_template.type = data.type;
            message_template.message = data.message;
            message_template = await message_template.save();
            return response.json({
                message: ` Message Template ${record === null ? 'Added' : 'Updated'}!`,
                id: message_template.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = MessageTemplatesController;
//# sourceMappingURL=MessageTemplatesController.js.map