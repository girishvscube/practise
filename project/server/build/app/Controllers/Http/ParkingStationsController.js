"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ParkingStation_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ParkingStation"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class ParkingStationsController {
    async dropdown({ response }) {
        try {
            let data = await ParkingStation_1.default.dropdown();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let data = await ParkingStation_1.default.listing(request.qs());
            return response.send(data);
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
            let parkingstation = await ParkingStation_1.default.query()
                .where('id', request.param('id'))
                .first()
                .then((serialize) => serialize?.toJSON());
            if (!parkingstation) {
                return response.notFound({ message: `Parking Station Not Found` });
            }
            return response.json(parkingstation);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { parkingstation } = ctx.request;
        return this.save(ctx, parkingstation);
    }
    async updateStatus(ctx) {
        const { parkingstation } = ctx.request;
        let data = ctx.request.body();
        const rules = {
            is_active: 'required|boolean',
        };
        const validation = new validatorjs_1.default(data, rules);
        if (validation.fails()) {
            return ctx.response.badRequest(validation.errors.errors);
        }
        parkingstation.is_active = data.is_active;
        await parkingstation.save();
        return ctx.response.json({
            message: `Parking Station is ${data.is_active ? 'Restored' : 'Deleted'}`,
        });
    }
    async save({ request, response }, record = null) {
        try {
            const data = request.only([
                'station_name',
                'capacity',
                'address',
                'city',
                'pincode',
                'state',
            ]);
            const rules = {
                station_name: 'required|max:150',
                capacity: 'required|numeric',
                address: 'required|max:255',
                city: 'required',
                pincode: 'required|numeric|min:100000|max:999999',
                state: 'required',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let parkingstation = record;
            if (record === null) {
                parkingstation = new ParkingStation_1.default();
            }
            each(data, (value, key) => {
                parkingstation[key] = value;
            });
            await parkingstation.save();
            response.json({
                message: `Parking Station ${record ? 'Updated' : 'Added'} Successfully`,
            });
        }
        catch (exception) {
            if (exception.message && exception.message.includes('ER_DUP_ENTRY')) {
                return response.internalServerError({
                    message: 'Parking Station name already present!',
                });
            }
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = ParkingStationsController;
//# sourceMappingURL=ParkingStationsController.js.map