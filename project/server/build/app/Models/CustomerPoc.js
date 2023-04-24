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
class CustomerPoc extends Model_1.default {
    static dropdown(id) {
        return this.query()
            .select('id', 'customer_id', 'poc_name', 'designation')
            .where('is_deleted', '=', false)
            .where('customer_id', id);
    }
    static listing(id) {
        return this.query()
            .select('id', 'customer_id', 'poc_name', 'designation', 'phone', 'email', 'image')
            .where('is_deleted', '=', false)
            .where('customer_id', id);
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], CustomerPoc.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CustomerPoc.prototype, "customer_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerPoc.prototype, "poc_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerPoc.prototype, "designation", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerPoc.prototype, "phone", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerPoc.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CustomerPoc.prototype, "image", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], CustomerPoc.prototype, "is_deleted", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], CustomerPoc.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], CustomerPoc.prototype, "updatedAt", void 0);
exports.default = CustomerPoc;
//# sourceMappingURL=CustomerPoc.js.map