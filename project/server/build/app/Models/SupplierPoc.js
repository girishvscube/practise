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
const Supplier_1 = __importDefault(require("./Supplier"));
const Model_1 = __importDefault(require("./Model"));
class SupplierPoc extends Model_1.default {
    static async listing(qs) {
        let { page = 1 } = qs;
        let limit = 10;
        return await this.query().select('*').paginate(page, limit);
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], SupplierPoc.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], SupplierPoc.prototype, "supplier_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupplierPoc.prototype, "poc_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupplierPoc.prototype, "designation", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], SupplierPoc.prototype, "contact", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupplierPoc.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupplierPoc.prototype, "image", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], SupplierPoc.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], SupplierPoc.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Supplier_1.default, { foreignKey: 'supplier_id' }),
    __metadata("design:type", Object)
], SupplierPoc.prototype, "supplier", void 0);
exports.default = SupplierPoc;
//# sourceMappingURL=SupplierPoc.js.map