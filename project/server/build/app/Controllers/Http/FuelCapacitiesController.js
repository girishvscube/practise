"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FuelCapacity_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/FuelCapacity"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class FuelCapacitiesController {
    async index({ response }) {
        try {
            let data = await FuelCapacity_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await FuelCapacity_1.default.query().where('id', request.params().id).first();
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
        let fuelcapacity = ctx.request.fuelcapacity;
        return await this.save(ctx, fuelcapacity);
    }
    async destroy(ctx) {
        try {
            let fuelcapacity = ctx.request.fuelcapacity;
            await fuelcapacity.delete();
            if (fuelcapacity.$isDeleted) {
                return ctx.response.json({ message: 'Fuel Capacity Record Deleted' });
            }
            else {
                return ctx.response.json({ message: 'Fuel Capacity Record Deletion Failed' });
            }
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge });
        }
    }
    async save({ request, response }, record = null) {
        try {
            let data = request.only(['name', 'capacity']);
            let rules = {
                name: 'required',
                capacity: 'required|numeric',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let fuel_capacity = record;
            if (record === null) {
                fuel_capacity = new FuelCapacity_1.default();
            }
            fuel_capacity.name = data.name;
            fuel_capacity.capacity = data.capacity;
            fuel_capacity = await fuel_capacity.save();
            return response.json({
                message: ` Fuel Capacity ${record === null ? 'Added' : 'Updated'}!`,
                id: fuel_capacity.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = FuelCapacitiesController;
//# sourceMappingURL=FuelCapacitiesController.js.map