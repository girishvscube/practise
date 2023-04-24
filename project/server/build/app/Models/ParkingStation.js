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
const Model_1 = __importDefault(require("./Model"));
class ParkingStation extends Model_1.default {
    static async dropdown() {
        let query = this.query();
        return await query.where('is_active', true);
    }
    static async listing(query_string) {
        let { page = 1, search_key = null } = query_string;
        const limit = 10;
        let query = this.query();
        let total_count = await this.query().count('id as count').first();
        if (search_key) {
            query
                .orWhere('station_name', 'like', `%${search_key}%`)
                .orWhere('city', 'like', `%${search_key}%`);
        }
        let data = await query.orderBy('id', 'desc').paginate(page, limit);
        return { data: data, total_count: total_count.$extras.count };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], ParkingStation.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ParkingStation.prototype, "station_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ParkingStation.prototype, "capacity", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ParkingStation.prototype, "address", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ParkingStation.prototype, "city", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], ParkingStation.prototype, "pincode", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], ParkingStation.prototype, "state", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], ParkingStation.prototype, "is_active", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ParkingStation.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], ParkingStation.prototype, "updatedAt", void 0);
exports.default = ParkingStation;
//# sourceMappingURL=ParkingStation.js.map