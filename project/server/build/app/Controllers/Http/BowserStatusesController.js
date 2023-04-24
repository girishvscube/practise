"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BowserStatus_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/BowserStatus"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class BowserStatusesController {
    async index({ response }) {
        try {
            let data = await BowserStatus_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await BowserStatus_1.default.query().where('id', request.params().id).first();
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
        let bowserstatus = ctx.request.bowserstatus;
        return await this.save(ctx, bowserstatus);
    }
    async destroy(ctx) {
        try {
            let bowserstatus = ctx.request.bowserstatus;
            await bowserstatus.delete();
            if (bowserstatus.$isDeleted) {
                await bowserstatus.log(ctx.auth.user, { message: `Staus Deleted` });
                return ctx.response.json({ message: 'Status Deleted' });
            }
            else {
                await bowserstatus.log(ctx.auth.user, { message: `Staus Deletion Failed` });
                return ctx.response.json({ message: 'Status Deletion Failed' });
            }
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge });
        }
    }
    async save({ request, auth, response }, record = null) {
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
            let bowser_status = record;
            if (record === null) {
                bowser_status = new BowserStatus_1.default();
            }
            bowser_status.name = data.name;
            bowser_status.color = data.color;
            bowser_status = await bowser_status.save();
            bowser_status.log(auth.user, {
                message: `Status ${record === null ? 'Added' : 'Updated'}!`,
                type: 'INFO',
            });
            return response.json({
                message: `Status ${record === null ? 'Added' : 'Updated'}!`,
                id: bowser_status.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = BowserStatusesController;
//# sourceMappingURL=BowserStatusesController.js.map