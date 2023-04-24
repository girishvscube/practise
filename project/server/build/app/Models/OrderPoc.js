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
const Order_1 = __importDefault(require("./Order"));
const CustomerPoc_1 = __importDefault(require("./CustomerPoc"));
const Model_1 = __importDefault(require("./Model"));
class OrderPoc extends Model_1.default {
    static async checkPocForSameOrder(poc_id, order_id) {
        let is_poc_already_assigned = await this.query()
            .where('customer_poc_id', poc_id)
            .andWhere('order_id', order_id)
            .first();
        if (is_poc_already_assigned) {
            return true;
        }
        else {
            return false;
        }
    }
    static async saveOrderPoc(order_id, poc_ids) {
        try {
            let result;
            for (let index = 0; index < poc_ids.length; index++) {
                const e = poc_ids[index];
                let is_poc_already_present = await this.checkPocForSameOrder(e, order_id);
                if (is_poc_already_present) {
                    result = {
                        status: is_poc_already_present,
                        message: `poc_id: ${e} is already linked to order`,
                    };
                    return result;
                }
                else {
                    await this.create({ customer_poc_id: e, order_id: order_id });
                }
            }
        }
        catch (exception) {
            console.log(exception);
            throw exception;
        }
    }
    static async getAllByOrderId(order_id) {
        try {
            return await this.query()
                .preload('customer_poc', (q) => q.select('*'))
                .preload('order', (q) => q.select('*'))
                .where('order_id', order_id);
        }
        catch (exception) {
            throw exception;
        }
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], OrderPoc.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], OrderPoc.prototype, "order_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], OrderPoc.prototype, "customer_poc_id", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Order_1.default, { foreignKey: 'order_id' }),
    __metadata("design:type", Object)
], OrderPoc.prototype, "order", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => CustomerPoc_1.default, { foreignKey: 'customer_poc_id' }),
    __metadata("design:type", Object)
], OrderPoc.prototype, "customer_poc", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], OrderPoc.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], OrderPoc.prototype, "updatedAt", void 0);
exports.default = OrderPoc;
//# sourceMappingURL=OrderPoc.js.map