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
const CustomerPoc_1 = __importDefault(require("./CustomerPoc"));
const Model_1 = __importDefault(require("./Model"));
class CustomerDeliveryDetail extends Model_1.default {
    static dropdown(id) {
        return this.query()
            .select('id', 'customer_id', 'address_1', 'address_2', 'pincode', 'address_type', 'phone', 'state', 'fuel_price')
            .where('is_deleted', '=', false)
            .andWhere('customer_id', id);
    }
    static listing(id) {
        return this.query()
            .preload('poc')
            .select('*')
            .where('is_deleted', '=', false)
            .where('customer_id', id);
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], CustomerDeliveryDetail.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CustomerDeliveryDetail.prototype, "customer_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerDeliveryDetail.prototype, "address_1", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerDeliveryDetail.prototype, "address_2", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CustomerDeliveryDetail.prototype, "pincode", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerDeliveryDetail.prototype, "address_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerDeliveryDetail.prototype, "city", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerDeliveryDetail.prototype, "state", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerDeliveryDetail.prototype, "phone", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerDeliveryDetail.prototype, "landmark", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerDeliveryDetail.prototype, "location_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerDeliveryDetail.prototype, "location", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CustomerDeliveryDetail.prototype, "customer_poc_id", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => CustomerPoc_1.default, {
        foreignKey: 'customer_poc_id',
    }),
    __metadata("design:type", Object)
], CustomerDeliveryDetail.prototype, "poc", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], CustomerDeliveryDetail.prototype, "is_fuel_price_checked", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CustomerDeliveryDetail.prototype, "fuel_price", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerDeliveryDetail.prototype, "is_deleted", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], CustomerDeliveryDetail.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], CustomerDeliveryDetail.prototype, "updatedAt", void 0);
exports.default = CustomerDeliveryDetail;
//# sourceMappingURL=CustomerDeliveryDetail.js.map