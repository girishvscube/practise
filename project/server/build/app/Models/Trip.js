"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luxon_1 = require("luxon");
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
const PurchaseOrder_1 = __importDefault(require("./PurchaseOrder"));
const moment_1 = __importDefault(require("moment"));
const TripScheduleLog_1 = __importDefault(require("./TripScheduleLog"));
const Bowser_1 = __importDefault(require("./Bowser"));
const Model_1 = __importDefault(require("./Model"));
const User_1 = __importDefault(require("./User"));
class Trip extends Model_1.default {
    static async count(query_string) {
        let { start_date = '', end_date = '' } = query_string;
        let query = this.query();
        let query1 = this.query();
        let query2 = this.query();
        query.count('id as count');
        query1.count('id as count').where('status', 'Trip Completed');
        query2.count('id as count').where('status', 'Not Scheduled');
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.where('created_at', '>=', start);
            query.where('created_at', '<=', end);
            query1.where('created_at', '>=', start);
            query1.where('created_at', '<=', end);
            query2.where('created_at', '>=', start);
            query2.where('created_at', '<=', end);
        }
        let total = await query;
        let completed = await query1;
        let not_scheduled = await query2;
        return {
            total: total[0].$extras.count,
            completed: completed[0].$extras.count,
            not_scheduled: not_scheduled[0].$extras.count,
        };
    }
    static async listing(query_string) {
        const { page = 1, bowser_id = null, status = null, start_date = null, end_date = null, search_key = null, } = query_string;
        const limit = 10;
        let query = this.query();
        let total_count = await this.query().count('id as count').first();
        let trips = [];
        if (status) {
            query.where('status', status);
        }
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.where('start_time', '>=', start);
            query.where('start_time', '<=', end);
        }
        if (bowser_id) {
            query.where('bowser_id', bowser_id);
        }
        let data = await query
            .preload('bowser', (bowser_query) => {
            if (search_key)
                bowser_query.where('name', 'LIKE', `%${search_key}%`);
            bowser_query.select('name', 'fuel_left');
        })
            .preload('purchase_order', (po_query) => {
            po_query.preload('supplier', (q) => q.select('name', 'address', 'city', 'state', 'pincode'));
            po_query.select('*');
        })
            .select('*')
            .paginate(page, limit);
        for (let index = 0; index < data.length; index++) {
            let trip = {
                all_orders: null,
                bowser_name: '',
                delivered_fuel: 0,
                id: 0,
                no_orders_delivered: 0,
                no_orders_linked: 0,
                po_id: 0,
                remaining_fuel: 0,
                trip_end_time: null,
                trip_start_time: null,
                trip_status: '',
            };
            const element = data[index];
            trip.bowser_name = element.bowser.name;
            trip.id = element.id;
            trip.no_orders_linked = element.purchase_order.no_of_order_linked;
            trip.no_orders_delivered = 0;
            trip.po_id = element.po_id;
            trip.trip_end_time = element.actual_end_time;
            trip.trip_start_time = element.start_time;
            trip.trip_status = element.status;
            trip.remaining_fuel = element.bowser.fuel_left;
            trip.delivered_fuel = 0;
            let pos = await TripScheduleLog_1.default.query()
                .preload('order', (q) => q.preload('customer'))
                .preload('purchaseOrder', (q) => q.preload('supplier'))
                .where('trip_id', element.id);
            let orders = [];
            for (let index = 0; index < pos.length; index++) {
                const element = pos[index];
                let order = {
                    created_at: element.type === 'po'
                        ? element.purchaseOrder.createdAt
                        : element.order.createdAt,
                    delivery_location: element.type === 'po'
                        ? {
                            city: element.purchaseOrder.supplier.city,
                            address: element.purchaseOrder.supplier.address,
                            pincode: element.purchaseOrder.supplier.pincode,
                        }
                        : JSON.parse(element.order.customer_delivery_details),
                    fuel_qty: element.type === 'po'
                        ? element.purchaseOrder.fuel_qty
                        : element.order.fuel_qty,
                    id: element.type === 'po' ? element.po_id : element.so_id,
                    name: element.type === 'po'
                        ? element.purchaseOrder.supplier.name
                        : element.order.customer.company_name,
                    purchase_or_delivery_date: element.type === 'po'
                        ? element.purchaseOrder.purchase_date
                        : element.order.delivery_date,
                    status: element.type === 'po' ? element.purchaseOrder.status : element.order.status,
                    total_amount: element.type === 'po'
                        ? element.purchaseOrder.total_amount
                        : element.order.grand_total,
                    type: element.type,
                };
                trip.delivered_fuel =
                    element.type === 'so'
                        ? element.order.is_order_delivered
                            ? trip.delivered_fuel + element.order.fuel_qty
                            : trip.delivered_fuel + 0
                        : trip.delivered_fuel + 0;
                trip.no_orders_delivered =
                    element.type === 'so'
                        ? element.order.is_order_delivered
                            ? trip.no_orders_delivered + 1
                            : trip.no_orders_delivered + 0
                        : trip.no_orders_delivered + 0;
                orders.push(order);
            }
            trip.all_orders = orders;
            trips.push(trip);
        }
        return { data: trips, meta: data.getMeta(), total_count: total_count.$extras.count };
    }
    static async saveTrip(po_id) {
        try {
            let checkTrip = await Trip.query().where('po_id', po_id).first();
            if (checkTrip) {
                return;
            }
            let trip = new Trip();
            trip.po_id = po_id;
            let po = await PurchaseOrder_1.default.find(trip.po_id);
            trip.bowser_id = po.bowser_id;
            trip = await trip.save();
            let bowser = await Bowser_1.default.find(po.bowser_id);
            bowser.last_trip_id = trip.id;
            bowser.fuel_left = bowser.fuel_left + po.fuel_qty;
            await bowser.save();
            let tripScheduleLog = new TripScheduleLog_1.default();
            tripScheduleLog.trip_id = trip.id;
            tripScheduleLog.po_id = trip.po_id;
            tripScheduleLog.type = 'po';
            tripScheduleLog.status = 'NOT_STARTED';
            await tripScheduleLog.save();
        }
        catch (exception) {
            throw new Error(exception.message);
        }
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Trip.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "po_id", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "start_time", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "end_time", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "actual_end_time", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "po_arrival_time", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Trip.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "driver_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "bowser_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "distance_travelled", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Trip.prototype, "fuel_left_at_end", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Bowser_1.default, { foreignKey: 'bowser_id' }),
    __metadata("design:type", Object)
], Trip.prototype, "bowser", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => PurchaseOrder_1.default, { foreignKey: 'po_id' }),
    __metadata("design:type", Object)
], Trip.prototype, "purchase_order", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, { foreignKey: 'driver_id' }),
    __metadata("design:type", Object)
], Trip.prototype, "driver", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Trip.prototype, "updatedAt", void 0);
exports.default = Trip;
//# sourceMappingURL=Trip.js.map