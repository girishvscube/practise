"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TripStatus_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TripStatus"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class TripStatusesController {
    async index({ response }) {
        try {
            let data = await TripStatus_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await TripStatus_1.default.query().where('id', request.params().id).first();
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
        let tripstatus = ctx.request.tripstatus;
        return await this.save(ctx, tripstatus);
    }
    async destroy(ctx) {
        try {
            let tripstatus = ctx.request.tripstatus;
            await tripstatus.delete();
            if (tripstatus.$isDeleted) {
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
            let trip_status = record;
            if (record === null) {
                trip_status = new TripStatus_1.default();
            }
            trip_status.name = data.name.toUpperCase().replace(' ', '_');
            trip_status.color = data.color;
            trip_status = await trip_status.save();
            return response.json({
                message: ` Status ${record === null ? 'Added' : 'Updated'}!`,
                id: trip_status.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = TripStatusesController;
//# sourceMappingURL=TripStatusesController.js.map