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
const PayOut_1 = __importDefault(require("./PayOut"));
const PurchaseOrder_1 = __importDefault(require("./PurchaseOrder"));
const Model_1 = __importDefault(require("./Model"));
class PayOutInvoice extends Model_1.default {
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], PayOutInvoice.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PayOutInvoice.prototype, "pay_out_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PayOutInvoice.prototype, "purchase_order_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PayOutInvoice.prototype, "amount", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => PayOut_1.default, { foreignKey: 'pay_out_id' }),
    __metadata("design:type", Object)
], PayOutInvoice.prototype, "payout", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => PurchaseOrder_1.default, { foreignKey: 'purchase_order_id' }),
    __metadata("design:type", Object)
], PayOutInvoice.prototype, "purchaseorder", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], PayOutInvoice.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], PayOutInvoice.prototype, "updatedAt", void 0);
exports.default = PayOutInvoice;
//# sourceMappingURL=PayOutInvoice.js.map