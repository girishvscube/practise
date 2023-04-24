"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const purchaseorder_constants_1 = global[Symbol.for('ioc.use')]("App/Helpers/purchaseorder.constants");
const Bowser_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Bowser"));
const Order_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Order"));
const PurchaseOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PurchaseOrder"));
const PurchaseSalesOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PurchaseSalesOrder"));
const Trip_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Trip"));
const moment_1 = __importDefault(require("moment"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class PurchaseOrdersController {
    async statusDropdown({ response }) {
        return response.json(purchaseorder_constants_1.PO_STATUS);
    }
    async count({ request, response }) {
        try {
            let data = await PurchaseOrder_1.default.count(request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let data = await PurchaseOrder_1.default.listing(request.qs());
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
            let purchaseOrder = await PurchaseOrder_1.default.query()
                .preload('bowser', (query) => query.select('*'))
                .preload('supplier', (query) => query.select('*'))
                .where('id', request.param('id'))
                .first();
            if (!purchaseOrder) {
                return response.notFound({ message: `Purchase order Not Found` });
            }
            purchaseOrder.logs = await purchaseOrder.getLogs();
            return response.json(purchaseOrder);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { purchaseorder } = ctx.request;
        return this.save(ctx, purchaseorder);
    }
    async supplierConfirmation({ request, response, auth }) {
        const purchaseorder = request.purchaseorder;
        purchaseorder.is_order_confirmed = true;
        purchaseorder.status = 'PO_CONFIRMED';
        await purchaseorder.save();
        await Trip_1.default.saveTrip(purchaseorder.id);
        await Promise.all([
            purchaseorder.log(auth.user, { message: `Updated PO as Confirmed`, type: 'ACTION' }),
            purchaseorder.log(auth.user, {
                message: `<strong>${auth.user.name}</strong> modified the status to <span>PO_CONFIRMED</span>`,
                type: 'STATUS',
            }),
        ]);
        return response.json({ message: 'PO Confirmed By Supplier' });
    }
    async updateStatus({ request, response, auth }) {
        const { purchaseorder } = request;
        let data = request.body();
        const rules = {
            status: 'required',
            notes: 'string|max:500',
        };
        const validation = new validatorjs_1.default(data, rules);
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors);
        }
        purchaseorder.status = data.status;
        if (data.notes) {
            await purchaseorder.log(auth.user, { message: data.notes, type: 'NOTE' });
        }
        await purchaseorder.log(auth.user, {
            message: `<strong>${auth.user.name}</strong> modified the status to <span>${data.status}</span>`,
            type: 'STATUS',
        }),
            await purchaseorder.save();
        return response.json({
            message: `Purchase Order status changed to ${data.status}`,
        });
    }
    async listOfAssossiatedOrdersByPoId({ request, response }) {
        try {
            let id = parseInt(request.params().id);
            let data = await PurchaseSalesOrder_1.default.query()
                .preload('order')
                .preload('purchase_order')
                .where('po_id', id);
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async assosiateSO({ request, response }) {
        let data = request.only(['so_ids']);
        let id = request.params().id;
        if (data.so_ids && data.so_ids.length > 0) {
            let fuel_val = await this.checkIsFuelAvailable(id, data.so_ids);
            if (fuel_val.is_fuel_available) {
                for (let index = 0; index < data.so_ids.length; index++) {
                    const element = data.so_ids[index];
                    let pso = await PurchaseSalesOrder_1.default.query().where('so_id', element).first();
                    if (pso && pso.po_id !== +id) {
                        return response.badRequest({
                            message: `Order:${element} is already linked to another Purchase Order`,
                        });
                    }
                    if (pso === null) {
                        pso = new PurchaseSalesOrder_1.default();
                    }
                    pso.so_id = element;
                    pso.po_id = id;
                    await pso.save();
                    let order = await Order_1.default.findOrFail(pso.so_id);
                    order.status = 'PO_LINKED';
                    await order.save();
                }
                return response.json({ message: 'Order Linked Successfully' });
            }
            else {
                return response.badRequest({
                    message: `fuel is exceeding by ${Math.abs(fuel_val.fuel_left)}L`,
                });
            }
        }
        else {
            response.badRequest({ message: 'so_ids needed!' });
        }
    }
    async listOfConfirmedSO({ request, response }) {
        try {
            let { order_type = '', time_slot = '', start_date = '', end_date = '' } = request.qs();
            let query = Order_1.default.query()
                .leftJoin('purchase_sales_orders as pso', 'pso.so_id', 'orders.id')
                .where('orders.is_order_confirmed', true)
                .where('orders.is_order_cancelled', false)
                .whereNull('pso.po_id');
            if (start_date && end_date) {
                let start = (0, moment_1.default)(start_date)
                    .utcOffset('+05:30')
                    .startOf('day')
                    .format('YYYY-MM-DD HH:mm:ss');
                let end = (0, moment_1.default)(end_date)
                    .utcOffset('+05:30')
                    .endOf('day')
                    .format('YYYY-MM-DD HH:mm:ss');
                query.where('orders.created_at', '>=', start);
                query.where('orders.created_at', '<=', end);
            }
            if (order_type) {
                query.where('orders.order_type', order_type);
            }
            if (time_slot) {
                query.where('orders.time_slot', 'LIKE', `%${time_slot}%`);
            }
            let data = await query.select('orders.id', 'orders.created_at', 'orders.order_type', 'orders.fuel_qty', 'orders.delivery_date', 'orders.time_slot');
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async deletePOS({ request, response }) {
        let purchasesalesorder = request.purchasesalesorder;
        let order = await Order_1.default.findOrFail(purchasesalesorder.so_id);
        order.status = 'ORDER_CONFIRMED';
        await purchasesalesorder.delete();
        if (purchasesalesorder.$isDeleted) {
            return response.json({ message: 'Order is unlinked from Purchase Order' });
        }
        else {
            return response.internalServerError({
                message: 'Something went wrong while unlinking order',
            });
        }
    }
    async save({ request, response }, record = null) {
        try {
            const data = request.only([
                'supplier_id',
                'bowser_id',
                'fuel_qty',
                'purchase_date',
                'price_per_litre',
                'additional_notes',
            ]);
            const rules = {
                supplier_id: 'required|numeric',
                bowser_id: 'required|numeric',
                fuel_qty: 'required|numeric',
                purchase_date: 'required|date',
                price_per_litre: 'required|numeric',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            if (record === null) {
                let bowser = await Bowser_1.default.query()
                    .where('id', data.bowser_id)
                    .where('status', 'Available')
                    .first();
                if (!bowser)
                    return response.badRequest({
                        message: 'Bowser not found or already in assigned to another order!',
                    });
                if (data.fuel_qty > bowser.fuel_capacity - bowser.fuel_left) {
                    return response.badRequest({ message: 'Bowser capacity exceeding' });
                }
                bowser.status = 'On Hold';
                await bowser.save();
            }
            data.total_amount = data.fuel_qty * data.price_per_litre;
            data.balance = data.total_amount;
            let purchaseorder = record;
            if (record === null) {
                purchaseorder = new PurchaseOrder_1.default();
            }
            each(data, (value, key) => {
                purchaseorder[key] = value;
            });
            purchaseorder = await purchaseorder.save();
            response.json({
                message: `Purchase Order ${record ? 'Updated' : 'Created'} Successfully`,
                id: purchaseorder.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async checkIsFuelAvailable(po_id, so_ids) {
        let fuel_qty = 0;
        let pos = await PurchaseSalesOrder_1.default.query()
            .preload('order', (q) => q.select('fuel_qty'))
            .where('po_id', po_id);
        fuel_qty = pos.reduce(function (accumulator, curValue) {
            return accumulator + +curValue.order.fuel_qty;
        }, 0);
        for (let index = 0; index < so_ids.length; index++) {
            const id = so_ids[index];
            let order = await Order_1.default.query().where('id', id).first();
            fuel_qty += +order.fuel_qty;
        }
        let po = await PurchaseOrder_1.default.query().where('id', po_id).first();
        return {
            is_fuel_available: fuel_qty <= po.fuel_qty ? true : false,
            fuel_left: po.fuel_qty - fuel_qty,
        };
    }
}
exports.default = PurchaseOrdersController;
//# sourceMappingURL=PurchaseOrdersController.js.map