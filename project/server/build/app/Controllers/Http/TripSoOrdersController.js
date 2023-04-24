"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Order_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Order"));
const OrderPoc_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/OrderPoc"));
const PurchaseOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PurchaseOrder"));
const PurchaseSalesOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PurchaseSalesOrder"));
const Trip_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Trip"));
const TripScheduleLog_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TripScheduleLog"));
const TripSoOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TripSoOrder"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class TripSoOrdersController {
    async getAllConfirmedOrders({ request, response }) {
        try {
            let data = await Order_1.default.confirmedOrder(request.qs(), request.params().id);
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let data = await TripSoOrder_1.default.listing(request.params().id);
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let id = request.params().id;
            let trip = await Trip_1.default.query()
                .preload('purchase_order', (query) => {
                query
                    .preload('bowser', (sub_query) => sub_query
                    .preload('driver', (u_query) => {
                    u_query.select('name');
                })
                    .preload('parkingstation', (u_query) => {
                    u_query.select('station_name');
                })
                    .select('last_driver_id', 'name', 'parking_station_id', 'registration_no', 'fuel_capacity', 'fuel_left'))
                    .preload('supplier', (sup_query) => {
                    sup_query.select('name', 'address', 'city', 'state', 'pincode');
                })
                    .select('created_at', 'purchase_date', 'fuel_qty', 'supplier_id', 'bowser_id');
            })
                .preload('driver')
                .where('id', id)
                .select('created_at', 'po_id', 'id', 'driver_id', 'start_time', 'end_time', 'po_arrival_time', 'status')
                .first();
            if (!trip) {
                return response.notFound({ message: `Bowser Not Found` });
            }
            let tripSoOrder = [];
            let count;
            let tsl = await TripScheduleLog_1.default.query()
                .where('po_id', trip.po_id)
                .andWhere('type', 'po')
                .first();
            if (tsl.status === 'NOT_STARTED') {
                let tSoOrder = await TripSoOrder_1.default.query()
                    .preload('order', (query) => {
                    query.preload('customer').select('*');
                })
                    .where('trip_id', id);
                for (let index = 0; index < tSoOrder.length; index++) {
                    const element = tSoOrder[index];
                    let order_poc = await OrderPoc_1.default.query()
                        .preload('customer_poc')
                        .where('order_id', element.so_id)
                        .first();
                    let soObj = {
                        actual_start_time: null,
                        actual_time_of_delivery: null,
                        company_name: element.order.customer.company_name,
                        customer_id: element.order.customer_id,
                        customer_delivery_detail: JSON.parse(element.order.customer_delivery_details),
                        est_delivery_time: element.schedule_time,
                        fuel_qty: element.order.fuel_qty,
                        id: null,
                        order_id: element.so_id,
                        payment_term: element.order.payment_type,
                        phone: order_poc.customer_poc.phone,
                        status: 'NOT_STARTED',
                    };
                    tripSoOrder.push(soObj);
                }
            }
            else {
                let tSoOrder = await TripSoOrder_1.default.query()
                    .preload('order', (query) => {
                    query.preload('customer').select('*');
                })
                    .where('trip_id', id);
                let tslOrder = await TripScheduleLog_1.default.listingByTripId(id);
                for (let index = 0; index < tslOrder.length; index++) {
                    const element = tslOrder[index];
                    let order_poc = await OrderPoc_1.default.query()
                        .preload('customer_poc')
                        .where('order_id', element.so_id)
                        .first();
                    let soObj = {
                        actual_start_time: element.start_time,
                        actual_time_of_delivery: element.end_time,
                        company_name: element.order.customer.company_name,
                        customer_id: element.order.customer_id,
                        customer_delivery_detail: JSON.parse(element.order.customer_delivery_details),
                        est_delivery_time: tSoOrder[index].schedule_time,
                        fuel_qty: element.order.fuel_qty,
                        id: element.id,
                        order_id: element.so_id,
                        payment_term: element.order.payment_type,
                        phone: order_poc.customer_poc.phone,
                        status: element.status,
                    };
                    tripSoOrder.push(soObj);
                }
            }
            count = await TripScheduleLog_1.default.count(id);
            trip.logs = await trip.getLogs();
            let po = {
                actual_start_time: tsl.start_time,
                actual_time_of_delivery: tsl.end_time,
                delivery_detail: `${trip.purchase_order.supplier.address}, ${trip.purchase_order.supplier.city}, ${trip.purchase_order.supplier.state} ${trip.purchase_order.supplier.pincode}`,
                est_delivery_time: trip.po_arrival_time,
                fuel_qty: trip.purchase_order.fuel_qty,
                id: tsl.id,
                payment_term: 'N/A',
                poc_phone: trip.purchase_order.supplier.phone,
                status: tsl.status,
                supplier_id: trip.purchase_order.supplier_id,
                supplier_name: trip.purchase_order.supplier.name,
            };
            return response.json({
                count: count,
                trip: trip,
                schedule_trip: {
                    start_time: trip.start_time,
                    po: po,
                    orders: tripSoOrder,
                    end_time: trip.end_time,
                },
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async destroy({ request, response }) {
        try {
            let tripSoOrder = request.tripsoorder;
            let trip = await Trip_1.default.find(tripSoOrder.trip_id);
            if (trip?.status === 'IN_TRANSIT') {
                return response.badRequest({
                    message: 'Trip has already started, Cannot delete order',
                });
            }
            else {
                await tripSoOrder.delete();
                let tripschedulelog = await TripScheduleLog_1.default.findBy('so_id', tripSoOrder.so_id);
                await tripschedulelog.delete();
                return response.json({ message: 'Order removed from the trip' });
            }
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        return await this.save(ctx);
    }
    async save({ request, response }) {
        try {
            let id = request.params().id;
            let data = request.only(['start_time', 'end_time', 'po_arrival_time', 'orders']);
            let rules = {
                'start_time': 'required|date',
                'po_arrival_time': 'required|date',
                'orders': 'array',
                'orders.*.so_id': 'numeric',
                'orders.*.schedule_time': 'date',
                'end_time': 'required|date',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let trip = await Trip_1.default.findOrFail(id);
            if (trip.status === 'IN_TRANSIT') {
                return response.badRequest('Cannot reschedule on going trip');
            }
            trip.start_time = data.start_time;
            trip.end_time = data.end_time;
            trip.po_arrival_time = data.po_arrival_time;
            trip.status = 'SCHEDULED';
            let trip_orders_list = [];
            let total_fuel = 0;
            let po = await PurchaseOrder_1.default.query().preload('bowser').where('id', trip.po_id).first();
            if (data.orders) {
                for (let index = 0; index < data.orders.length; index++) {
                    const order_id = data.orders[index];
                    let order = await Order_1.default.findOrFail(order_id.so_id);
                    total_fuel += Number(order.fuel_qty);
                }
                if (total_fuel > po.bowser.fuel_left) {
                    return response.badRequest({ message: `Fuel limit exceeds!` });
                }
            }
            let present_orders = [];
            let new_order = [];
            let pos = await PurchaseSalesOrder_1.default.query().where('po_id', trip.po_id);
            for (let index = 0; index < data.orders.length; index++) {
                const element = data.orders[index];
                let order = pos.find((e) => e.so_id === element.so_id);
                if (order) {
                    present_orders.push(order.so_id);
                }
                else {
                    new_order.push(element);
                }
            }
            if (present_orders.length !== pos.length) {
                for (var i = pos.length - 1; i >= 0; i--) {
                    for (var j = 0; j < present_orders.length; j++) {
                        if (pos[i].so_id === present_orders[j]) {
                            pos.splice(i, 1);
                        }
                    }
                }
                for (let index = 0; index < pos.length; index++) {
                    const element = pos[index];
                    let tripSoOrder = await TripSoOrder_1.default.findBy('so_id', element.so_id);
                    if (tripSoOrder) {
                        await tripSoOrder.delete();
                    }
                    await element.delete();
                }
            }
            for (let index = 0; index < new_order.length; index++) {
                const element = new_order[index];
                let pos = new PurchaseSalesOrder_1.default();
                pos.po_id = trip.po_id;
                pos.so_id = element.so_id;
                await pos.save();
            }
            for (let index = 0; index < data.orders.length; index++) {
                const e = data.orders[index];
                let tripSoOrder = await TripSoOrder_1.default.query().where('so_id', e.so_id).first();
                if (tripSoOrder === null) {
                    tripSoOrder = new TripSoOrder_1.default();
                }
                else if (tripSoOrder.trip_id !== trip.id) {
                    return response.badRequest({
                        message: 'Order is already linked with another PO',
                    });
                }
                tripSoOrder.so_id = e.so_id;
                tripSoOrder.trip_id = trip.id;
                tripSoOrder.schedule_time = e.schedule_time;
                tripSoOrder.priority = index + 1;
                tripSoOrder = await tripSoOrder.save();
                trip_orders_list.push({ trip_so_id: tripSoOrder.id, so_id: tripSoOrder.so_id });
            }
            trip = await trip.save();
            return response.json({
                message: 'Trip scheduled successfully! ',
                trip_id: trip.id,
                trip_orders_list: trip_orders_list,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = TripSoOrdersController;
//# sourceMappingURL=TripSoOrdersController.js.map