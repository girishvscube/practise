"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trip_constants_1 = global[Symbol.for('ioc.use')]("App/Helpers/trip.constants");
const Trip_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Trip"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class TripsController {
    async dropdown({ response }) {
        return response.json(trip_constants_1.TRIP_STATUS);
    }
    async count({ request, response }) {
        try {
            let data = await Trip_1.default.count(request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let data = await Trip_1.default.listing(request.qs());
            return response.send(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async updateStatus({ request, response, auth }) {
        try {
            let trip = request.trip;
            let { status, notes } = request.body();
            const rules = {
                status: 'required',
                notes: 'string|max:500',
            };
            const validation = new validatorjs_1.default(request.body(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            trip.status = status;
            await trip.save();
            if (notes) {
                await trip.log(auth.user, { message: notes, type: 'NOTE' });
            }
            await trip.log(auth.user, {
                message: `<strong>${auth.user.name}</strong> modified the status to <span>${status}</span>`,
                type: 'STATUS',
            });
            return response.json({ message: `Status changed to ${status}` });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = TripsController;
//# sourceMappingURL=TripsController.js.map