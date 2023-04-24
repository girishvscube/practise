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
const BankAccount_1 = __importDefault(require("./BankAccount"));
const moment_1 = __importDefault(require("moment"));
const Model_1 = __importDefault(require("./Model"));
class Expense extends Model_1.default {
    static async count(query_string) {
        let { start_date = '', end_date = '' } = query_string;
        let query = this.query().sum('amount as amount');
        let query1 = this.query().sum('amount as amount').where('expense_type', 'Direct');
        let query2 = this.query().sum('amount as amount').where('expense_type', 'Indirect');
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
        let total = await query.first();
        let direct = await query1.first();
        let indirect = await query2.first();
        return { total: total.amount, direct: direct.amount, indirect: indirect.amount };
    }
    static async listing(query_string) {
        const { page = 1, start_date = '', end_date = '', expense_type = '', account_id = '', search_key = '', } = query_string;
        let limit = 10;
        let total_count = await this.query().count('id as count').first();
        let query = this.query().preload('bank_account', (q) => q.select('*'));
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
        if (expense_type) {
            query.where('expense_type', expense_type);
        }
        if (account_id) {
            query.where('account_id', account_id);
        }
        if (search_key) {
            query.orWhere('item_name', 'LIKE', `%${search_key}%`);
            query.orWhere('amount', 'LIKE', `%${search_key}%`);
        }
        let data = await query.orderBy('id', 'desc').paginate(page, limit);
        return { data: data, total_count: total_count.$extras.count };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Expense.prototype, "id", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Expense.prototype, "date_of_expense", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Expense.prototype, "expense_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Expense.prototype, "sub_category", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Expense.prototype, "item_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Expense.prototype, "payee", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Expense.prototype, "amount", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Expense.prototype, "account_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Expense.prototype, "reference_img", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => BankAccount_1.default, { foreignKey: 'account_id' }),
    __metadata("design:type", Object)
], Expense.prototype, "bank_account", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Expense.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Expense.prototype, "updatedAt", void 0);
exports.default = Expense;
//# sourceMappingURL=Expense.js.map