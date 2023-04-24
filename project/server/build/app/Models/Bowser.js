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
const ParkingStation_1 = __importDefault(require("./ParkingStation"));
const User_1 = __importDefault(require("./User"));
const Model_1 = __importDefault(require("./Model"));
class Bowser extends Model_1.default {
    static async count() {
        let query = this.query();
        let query1 = this.query();
        let query2 = this.query();
        let query3 = this.query();
        query.count('id as count');
        query1.count('id as count').andWhere('status', 'On Trip');
        query2.count('id as count').andWhere('status', 'Available');
        query3.count('id as count').andWhere('status', 'Out of Service');
        let total = await query;
        let on_trip = await query1;
        let available = await query2;
        let out_of_service = await query3;
        return {
            total: total[0].$extras.count,
            on_trip: on_trip[0].$extras.count,
            available: available[0].$extras.count,
            out_of_service: out_of_service[0].$extras.count,
        };
    }
    static async dropdown() {
        let query = Bowser.query()
            .leftJoin('bowser_drivers as bd', 'bd.bowser_id', 'bowsers.id')
            .leftJoin('parking_stations as ps', 'ps.id', 'bowsers.parking_station_id')
            .leftJoin('users as u', 'u.id', 'bowsers.last_driver_id')
            .select('bowsers.id', 'bowsers.name', 'bowsers.registration_no', 'bowsers.last_trip_id', 'bowsers.fuel_capacity', 'bowsers.parking_station_id', 'bowsers.last_driver_id', 'bowsers.fuel_left', 'u.name as driver_name', 'ps.station_name as station_name', 'ps.id as station_id')
            .max('bd.end_time as end_time')
            .where('bowsers.status', 'AVAILABLE')
            .groupBy('bowsers.id');
        let bowsers = await query;
        let data = [];
        bowsers.forEach((el) => {
            data.push({
                id: el.id,
                name: el.name,
                registration_no: el.registration_no,
                fuel_capacity: el.fuel_capacity,
                fuel_left: el.fuel_left,
                driver: { id: el.last_driver_id, name: el.$extras.driver_name },
                last_trip: el.$extras.end_time,
                parkingstation: {
                    id: el.parking_station_id,
                    name: el.$extras.station_name,
                },
            });
        });
        return data;
    }
    static async listing(query_string) {
        let { page = 1, status = null, driver = '', search_key = null } = query_string;
        let limit = 10;
        let total_count = await this.query().count('id as count').first();
        let query = this.query();
        if (status) {
            query.where('status', '=', status);
        }
        if (search_key) {
            query = query
                .where('name', 'LIKE', `%${search_key}%`)
                .orWhere('registration_no', 'LIKE', `%${search_key}%`);
        }
        if (driver) {
            query = query.where('last_driver_id', driver);
        }
        let data = await query
            .preload('parkingstation', (q) => q.select('station_name'))
            .preload('driver', (q) => q.select('name'))
            .orderBy('id', 'desc')
            .paginate(page, limit);
        return { total_count: total_count.$extras.count, data: data };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Bowser.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Bowser.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Bowser.prototype, "registration_no", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Bowser.prototype, "last_trip_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Bowser.prototype, "fuel_capacity", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Bowser.prototype, "fuel_left", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Bowser.prototype, "image", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Bowser.prototype, "registration", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Bowser.prototype, "registration_validity", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Bowser.prototype, "pollution_cert", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Bowser.prototype, "pollution_cert_validity", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Bowser.prototype, "vehicle_fitness", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Bowser.prototype, "vehicle_fitness_validity", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Bowser.prototype, "heavy_vehicle", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Bowser.prototype, "heavy_vehicle_validity", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Bowser.prototype, "other_doc", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Bowser.prototype, "other_doc_validity", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Bowser.prototype, "parking_station_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Bowser.prototype, "last_driver_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Bowser.prototype, "status", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => ParkingStation_1.default, { foreignKey: 'parking_station_id' }),
    __metadata("design:type", Object)
], Bowser.prototype, "parkingstation", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, { foreignKey: 'last_driver_id' }),
    __metadata("design:type", Object)
], Bowser.prototype, "driver", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Bowser.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Bowser.prototype, "updatedAt", void 0);
exports.default = Bowser;
//# sourceMappingURL=Bowser.js.map