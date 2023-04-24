"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TimeSlot_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TimeSlot"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class TimeSlotsController {
    async index({ response }) {
        try {
            let data = await TimeSlot_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await TimeSlot_1.default.query().where('id', request.params().id);
            return response.json(data);
        }
        catch (exception) {
            response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async update(ctx) {
        const { timeslot } = ctx.request;
        return this.save(ctx, timeslot);
    }
    async destroy({ request, response }) {
        try {
            let timeslot = request.params().timeslot;
            await timeslot.delete();
            if (timeslot.$isDeleted) {
                return response.json({ message: 'Timeslot deleted!' });
            }
            else {
                return response.internalServerError({
                    message: 'Something went wrong while deleting timeslot',
                });
            }
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async save({ request, response }, record = null) {
        try {
            let data = request.only(['start', 'end']);
            let rules = {
                start: 'required',
                end: 'required',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let time_slot = record;
            if (record === null) {
                time_slot = new TimeSlot_1.default();
            }
            each(data, (value, key) => {
                time_slot[key] = value;
            });
            await time_slot.save();
            response.json({
                message: `Time Slot ${record ? 'Updated' : 'Created'} Successfully`,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = TimeSlotsController;
//# sourceMappingURL=TimeSlotsController.js.map