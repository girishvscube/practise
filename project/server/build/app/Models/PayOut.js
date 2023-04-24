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
const moment_1 = __importDefault(require("moment"));
const Model_1 = __importDefault(require("./Model"));
const BankAccount_1 = __importDefault(require("./BankAccount"));
class PayOut extends Model_1.default {
    static async listing(query_string) {
        let { page = 1, search_key = '', start_date = '', end_date = '', bank_account_id = '', } = query_string;
        let limit = 10;
        let total_count = await this.query().count('id as count').first();
        let query = this.query()
            .leftJoin('suppliers as s', 's.id', 'pay_outs.supplier_id')
            .preload('supplier', (q) => q.select('*'))
            .select('pay_outs.*');
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.where('pay_outs.created_at', '>=', start);
            query.where('pay_outs.created_at', '<=', end);
        }
        if (bank_account_id) {
            query.where('pay_outs.bank_account_id', bank_account_id);
        }
        if (search_key) {
            query = query.where('s.name', 'LIKE', `%${search_key}%`);
        }
        let data = await query.orderBy('id', 'desc').paginate(page, limit);
        return { data: data, total_count: total_count.$extras.count };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], PayOut.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PayOut.prototype, "supplier_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PayOut.prototype, "bank_account_id", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], PayOut.prototype, "payout_date", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PayOut.prototype, "amount", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PayOut.prototype, "no_of_invoices", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], PayOut.prototype, "notes", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], PayOut.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], PayOut.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Supplier_1.default, { foreignKey: 'supplier_id' }),
    __metadata("design:type", Object)
], PayOut.prototype, "supplier", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => BankAccount_1.default, { foreignKey: 'bank_account_id' }),
    __metadata("design:type", Object)
], PayOut.prototype, "bank_account", void 0);
exports.default = PayOut;
//# sourceMappingURL=PayOut.js.map