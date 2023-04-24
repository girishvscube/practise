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
const Customer_1 = __importDefault(require("./Customer"));
const Expense_1 = __importDefault(require("./Expense"));
const moment_1 = __importDefault(require("moment"));
const Model_1 = __importDefault(require("./Model"));
const PayOut_1 = __importDefault(require("./PayOut"));
const PayIn_1 = __importDefault(require("./PayIn"));
class CashInHand extends Model_1.default {
    static async listing(query_string) {
        let { page = 1, start_date = '', end_date = '', search_key = '', type = '' } = query_string;
        const limit = 10;
        let total_count = this.query().count('id as count').first();
        let query = this.query()
            .leftJoin('customers as c', 'c.id', 'cash_in_hands.customer_id')
            .leftJoin('suppliers as s', 's.id', 'cash_in_hands.supplier_id')
            .preload('pay_in', (q) => q.select('*'))
            .preload('expense', (q) => q.select('*'))
            .preload('pay_out', (q) => q.select('*'));
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.where('cash_in_hands.created_at', '>=', start);
            query.where('cash_in_hands.created_at', '<=', end);
        }
        if (search_key) {
            query.orWhere('c.name', 'like', `%${search_key}%`);
            query.orWhere('s.name', 'like', `%${search_key}%`);
        }
        if (type) {
            query.where('cash_in_hands.type', type);
        }
        let data = await query
            .select('cash_in_hands.*')
            .orderBy('cash_in_hands.id', 'desc')
            .paginate(page, limit);
        return { total_count: total_count, data: data };
    }
    static async count(query_string) {
        let { start_date = '', end_date = '' } = query_string;
        let query = this.query().sum('amount as amount');
        let query1 = this.query().sum('amount as amount').where('type', 'Cash Increase');
        let query2 = this.query().sum('amount as amount').where('type', 'Cash Decrease');
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
        let cash_in = await query1;
        let cash_out = await query2;
        return { total: total[0].amount, cash_in: cash_in[0].amount, cash_out: cash_out[0].amount };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], CashInHand.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], CashInHand.prototype, "type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CashInHand.prototype, "amount", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CashInHand.prototype, "supplier_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CashInHand.prototype, "customer_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CashInHand.prototype, "pay_out_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CashInHand.prototype, "pay_in_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], CashInHand.prototype, "expense_id", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], CashInHand.prototype, "adjustment_date", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Supplier_1.default, { foreignKey: 'supplier_id' }),
    __metadata("design:type", Object)
], CashInHand.prototype, "supplier", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Customer_1.default, { foreignKey: 'customer_id' }),
    __metadata("design:type", Object)
], CashInHand.prototype, "customer", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => PayOut_1.default, { foreignKey: 'pay_out_id' }),
    __metadata("design:type", Object)
], CashInHand.prototype, "pay_out", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => PayIn_1.default, { foreignKey: 'pay_in_id' }),
    __metadata("design:type", Object)
], CashInHand.prototype, "pay_in", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Expense_1.default, { foreignKey: 'expense_id' }),
    __metadata("design:type", Object)
], CashInHand.prototype, "expense", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], CashInHand.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], CashInHand.prototype, "updatedAt", void 0);
exports.default = CashInHand;
//# sourceMappingURL=CashInHand.js.map