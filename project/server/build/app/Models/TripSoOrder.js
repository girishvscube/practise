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
const Model_1 = __importDefault(require("./Model"));
class TripSoOrder extends Model_1.default {
    static async listing(id) {
        let query = this.query();
        return await query
            .preload('order', (order_query) => {
            order_query.select('*');
        })
            .preload('trip', (trip_query) => {
            trip_query.select('*');
        })
            .select('*')
            .where('trip_id', id);
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], TripSoOrder.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TripSoOrder.prototype, "trip_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TripSoOrder.prototype, "so_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], TripSoOrder.prototype, "priority", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], TripSoOrder.prototype, "schedule_time", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], TripSoOrder.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], TripSoOrder.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Trip_1.default, { foreignKey: 'trip_id' }),
    __metadata("design:type", Object)
], TripSoOrder.prototype, "trip", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Order_1.default, { foreignKey: 'so_id' }),
    __metadata("design:type", Object)
], TripSoOrder.prototype, "order", void 0);
exports.default = TripSoOrder;
//# sourceMappingURL=TripSoOrder.js.map