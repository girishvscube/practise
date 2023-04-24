"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Bowser_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Bowser"));
const Customer_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Customer"));
const Order_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Order"));
const OrderTracking_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/OrderTracking"));
const PurchaseOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PurchaseOrder"));
const PurchaseSalesOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PurchaseSalesOrder"));
const Trip_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Trip"));
const TripScheduleLog_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TripScheduleLog"));
const TripSoOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TripSoOrder"));
const luxon_1 = require("luxon");
const validatorjs_1 = __importDefault(require("validatorjs"));
class TripScheduleLogsController {
    async listingByTripId({ request, response }) {
        try {
            let id = request.params().id;
            let data = await TripScheduleLog_1.default.listingByTripId(id);
            let count = await TripScheduleLog_1.default.count(id);
            return response.json({ data: data, count: count });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async listingByBowserId({ request, response }) {
        try {
            let data = await TripScheduleLog_1.default.listingByBowserId(request.params().id, request.qs());
            let result = [];
            data.data.forEach((e) => {
                result.push({
                    id: e.id,
                    po_id: e.po_id,
                    so_id: e.so_id,
                    type: e.type,
                    assigned_driver: e.$extras.driver_name,
                    fuel_left: e.$extras.fuel_left,
                    odometer_end: e.odometer_end,
                    odometer_start: e.odometer_start,
                    start_time: e.start_time,
                    end_time: e.end_time,
                    trip_status: e.$extras.trip_status,
                });
            });
            return response.send({
                meta: data.data.getMeta(),
                data: result,
                total_count: data.total_count,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async odometerDetailByTripId({ request, response }) {
        try {
            let data = await TripScheduleLog_1.default.query().where('trip_id', request.params().id);
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async tripDetails({ request, response }) {
        try {
            let data = await TripScheduleLog_1.default.query()
                .preload('order')
                .preload('purchaseOrder')
                .where('trip_id', request.params().id);
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async updateStatus({ request, response }) {
        try {
            let record = request.tripschedulelog;
            let data = request.only(['status', 'odometer']);
            let rules = {
                status: 'required',
                odometer: 'required',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            if (!record) {
                return response.badRequest({ message: 'Trip details not found' });
            }
            let count = await TripScheduleLog_1.default.query()
                .where('trip_id', record.trip_id)
                .where('status', 'STARTED')
                .orWhere('status', 'NOT_STARTED');
            record.status = data.status.toUpperCase();
            if (record.status === 'STARTED') {
                record.start_time = luxon_1.DateTime.now();
                record.odometer_start = data.odometer;
            }
            else {
                record.end_time = luxon_1.DateTime.now();
                record.odometer_end = data.odometer;
            }
            let trip = await Trip_1.default.findOrFail(record.trip_id);
            if (record.type === 'po' && record.status === 'STARTED') {
                let po = await PurchaseOrder_1.default.find(record.po_id);
                trip.status = 'IN_TRANSIT';
                await trip.save();
                let bowser = await Bowser_1.default.find(po.bowser_id);
                bowser.status = 'ON_TRIP';
                await bowser.save();
                let trip_so_order = await TripSoOrder_1.default.query().where('trip_id', trip.id);
                for (let index = 0; index < trip_so_order.length; index++) {
                    const element = trip_so_order[index];
                    let tripschedulelog = new TripScheduleLog_1.default();
                    tripschedulelog.type = 'so';
                    tripschedulelog.so_id = element.so_id;
                    tripschedulelog.trip_id = trip.id;
                    tripschedulelog.status = 'NOT_STARTED';
                    tripschedulelog = await tripschedulelog.save();
                    po.no_of_order_linked = trip_so_order.length;
                    await po.save();
                }
            }
            if (record.type === 'po' && record.status === 'ENDED') {
                let po = await PurchaseOrder_1.default.find(record.po_id);
                trip.distance_travelled =
                    trip.distance_travelled +
                        (Number(record.odometer_end) - Number(record.odometer_start));
                po.status = 'PURCHASE_DONE';
                po.is_order_delivered = true;
                let pos = await PurchaseSalesOrder_1.default.findBy('po_id', po.id);
                if (pos === null) {
                    let trip1 = await Trip_1.default.query().where('id', record.trip_id).first();
                    trip1.actual_end_time = record.end_time;
                    trip1.status = 'TRIP_COMPLETED';
                    await trip1.save();
                    let bowser = await Bowser_1.default.findOrFail(po.bowser_id);
                    bowser.status = 'AVAILABLE';
                    await bowser.save();
                }
                await po.save();
            }
            let bowser = await Bowser_1.default.findOrFail(trip.bowser_id);
            if (record.type === 'so' && record.status === 'ENDED') {
                trip.distance_travelled =
                    trip.distance_travelled +
                        (Number(record.odometer_end) - Number(record.odometer_start));
                let order = await Order_1.default.query()
                    .preload('customer', (q) => q.preload('credit_net_due'))
                    .where('id', record.so_id)
                    .first();
                bowser.fuel_left = Number(bowser.fuel_left) - Number(order.fuel_qty);
                trip.fuel_left_at_end = bowser.fuel_left;
                order.status = 'DELIVERED';
                order = await this.getDueDateAndLastDate(order);
                order.is_order_delivered = true;
                let orderTracking = new OrderTracking_1.default();
                orderTracking.order_id = order.id;
                orderTracking.status = order.status;
                orderTracking.order_updated_at = luxon_1.DateTime.now();
                await orderTracking.save();
                await order.save();
            }
            if (count.length === 1 && record.status === 'ENDED') {
                let trip1 = await Trip_1.default.query()
                    .preload('purchase_order', (q) => q.preload('bowser'))
                    .select('*')
                    .where('id', record.trip_id)
                    .first();
                trip1.actual_end_time = record.end_time;
                trip1.status = 'TRIP_COMPLETED';
                await trip1.save();
                bowser.status = 'AVAILABLE';
            }
            await bowser.save();
            await trip.save();
            await record.save();
            return response.json({ message: `Trip ${data.status} successfully!` });
        }
        catch (exception) {
            console.log(exception);
            return response.internalServerError({ message: exception.message });
        }
    }
    async updateCredit(customer_id, grand_total) {
        try {
            let customer = await Customer_1.default.find(customer_id);
            customer.credit_limit = customer.credit_limit - grand_total;
            customer.outstanding_amount = customer.outstanding_amount + grand_total;
            await customer.save();
        }
        catch (exception) {
            throw exception;
        }
    }
    async getDueDateAndLastDate(order) {
        if (order.payment_type === 'POD') {
            order.due_date = luxon_1.DateTime.now();
            order.last_date = order.due_date.plus({
                days: order.customer.grace_period,
            });
        }
        if (order.customer.is_credit_availed && !order.is_order_delivered) {
            order.due_date = luxon_1.DateTime.now().plus({ days: order.customer.credit_net_due.days });
            order.last_date = order.due_date.plus({
                days: order.customer.credit_net_due.days + order.customer.grace_period,
            });
            if (!order.is_order_delivered) {
                await this.updateCredit(order.customer_id, order.grand_total);
            }
        }
        return order;
    }
}
exports.default = TripScheduleLogsController;
//# sourceMappingURL=TripScheduleLogsController.js.map