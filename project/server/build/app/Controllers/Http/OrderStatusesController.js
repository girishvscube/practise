"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrderStatus_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/OrderStatus"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class OrderStatusesController {
    async index({ response }) {
        try {
            let data = await OrderStatus_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await OrderStatus_1.default.query().where('id', request.params().id).first();
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
        let orderstatus = ctx.request.orderstatus;
        return await this.save(ctx, orderstatus);
    }
    async destroy(ctx) {
        try {
            let orderstatus = ctx.request.orderstatus;
            await orderstatus.delete();
            if (orderstatus.$isDeleted) {
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
            let order_status = record;
            if (record === null) {
                order_status = new OrderStatus_1.default();
            }
            order_status.name = data.name.toUpperCase().replace(' ', '_');
            order_status.color = data.color;
            order_status = await order_status.save();
            return response.json({
                message: ` Status ${record === null ? 'Added' : 'Updated'}!`,
                id: order_status.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = OrderStatusesController;
//# sourceMappingURL=OrderStatusesController.js.map