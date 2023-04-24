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
const Trip_1 = __importDefault(require("./Trip"));
const Order_1 = __importDefault(require("./Order"));
const PurchaseOrder_1 = __importDefault(require("./PurchaseOrder"));
const moment_1 = __importDefault(require("moment"));
const Model_1 = __importDefault(require("./Model"));
const TripSoOrder_1 = __importDefault(require("./TripSoOrder"));
const Bowser_1 = __importDefault(require("./Bowser"));
class TripScheduleLog extends Model_1.default {
    static async listingById(id, query_string) {
        let { start_date = '', end_date = '', page = 1 } = query_string;
        let limit = 10;
        let query = Trip_1.default.query()
            .preload('purchase_order', (q) => q.select('no_of_order_linked'))
            .preload('driver', (q) => q.select('name'))
            .where('bowser_id', id);
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
        }
        return await query.orderBy('id', 'desc').paginate(page, limit);
    }
    static async count(id) {
        let trip = await Trip_1.default.query().preload('purchase_order').where('id', id).first();
        let trip_so = await TripSoOrder_1.default.query()
            .leftJoin('orders as o', 'o.id', 'trip_so_orders.so_id')
            .sum('o.fuel_qty as fuel_qty')
            .where('trip_id', id)
            .where('o.status', 'DELIVERED');
        let bowser = await Bowser_1.default.query().where('id', trip.purchase_order.bowser_id).first();
        return {
            ordered: trip.purchase_order.fuel_qty,
            delivered: trip_so[0].$extras.fuel_qty,
            left: bowser.fuel_left,
        };
    }
    static async listingByTripId(id) {
        let query = this.query()
            .preload('order', (q) => q.preload('customer'))
            .preload('trip')
            .where('trip_id', id)
            .where('type', 'so');
        return await query;
    }
    static async listingByBowserId(id, query_string) {
        let { page = 1, start_date = null, end_date = null } = query_string;
        const limit = 10;
        let query = this.query()
            .innerJoin('trips as t', 't.id', '=', 'trip_schedule_logs.trip_id')
            .innerJoin('purchase_orders as po', 'po.id', '=', 'trip_schedule_logs.po_id')
            .innerJoin('bowsers as b', 'b.id', '=', 'po.bowser_id')
            .leftJoin('bowser_drivers as bd', 'bd.bowser_id', '=', 'b.id')
            .leftJoin('users as u', 'u.id', '=', 'bd.user_id')
            .where('po.bowser_id', id)
            .where('bd.status', '=', 'Assigned');
        let total_count = await this.query()
            .where('po.bowser_id', id)
            .where('bd.status', '=', 'Assigned')
            .count('id as count')
            .first();
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
        }
        let record = await query
            .select('trip_schedule_logs.id', 'trip_schedule_logs.trip_id', 'trip_schedule_logs.start_time', 'trip_schedule_logs.end_time', 'trip_schedule_logs.so_id', 'trip_schedule_logs.po_id', 'trip_schedule_logs.type', 'trip_schedule_logs.odometer_start', 'trip_schedule_logs.odometer_end', 'trip_schedule_logs.status', 't.status as trip_status', 'b.fuel_left as fuel_left', 'u.name as driver_name')
            .paginate(page, limit);
        return { data: record, total_count: total_count.$extras.count };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TripScheduleLog.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TripScheduleLog.prototype, "trip_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TripScheduleLog.prototype, "so_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TripScheduleLog.prototype, "po_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TripScheduleLog.prototype, "type", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], TripScheduleLog.prototype, "start_time", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], TripScheduleLog.prototype, "end_time", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TripScheduleLog.prototype, "odometer_start", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TripScheduleLog.prototype, "odometer_end", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], TripScheduleLog.prototype, "status", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], TripScheduleLog.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], TripScheduleLog.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Trip_1.default, { foreignKey: 'trip_id' }),
    __metadata("design:type", Object)
], TripScheduleLog.prototype, "trip", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Order_1.default, { foreignKey: 'so_id' }),
    __metadata("design:type", Object)
], TripScheduleLog.prototype, "order", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => PurchaseOrder_1.default, { foreignKey: 'po_id' }),
    __metadata("design:type", Object)
], TripScheduleLog.prototype, "purchaseOrder", void 0);
exports.default = TripScheduleLog;
//# sourceMappingURL=TripScheduleLog.js.map