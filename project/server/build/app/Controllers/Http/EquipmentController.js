"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Equipment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Equipment"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class EquipmentController {
    async dropdown({ response }) {
        try {
            let equipmentList = await Equipment_1.default.dropdown();
            return response.json(equipmentList);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ response }) {
        try {
            let equipmentList = await Equipment_1.default.listing();
            return response.json(equipmentList);
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
            let equipment = request.equipment;
            return response.json(equipment);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { equipment } = ctx.request;
        return this.save(ctx, equipment);
    }
    async destroy(ctx) {
        try {
            const equipment = ctx.request.equipment;
            await equipment.delete();
            if (equipment.$isDeleted) {
                return ctx.response.json({ message: `Equipment Deleted!` });
            }
            else {
                return ctx.response.badRequest({
                    message: `Something went wrong, Equipment was not Deleted!`,
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
            const EquipmentNameExists = await Equipment_1.default.query().where('name', data.name).first();
            let equipment = record;
            if (record === null) {
                equipment = new Equipment_1.default();
            }
            if (EquipmentNameExists && EquipmentNameExists.id !== equipment.id) {
                return response.badRequest({
                    message: 'Equipment name already exists',
                });
            }
            each(data, (value, key) => {
                equipment[key] = value;
            });
            await equipment.save();
            return response.json({
                message: `Equipment ${record ? 'Updated' : 'Created'} Successfully`,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = EquipmentController;
//# sourceMappingURL=EquipmentController.js.map