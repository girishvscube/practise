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
const User_1 = __importDefault(require("./User"));
const CreditNetDue_1 = __importDefault(require("./CreditNetDue"));
const moment_1 = __importDefault(require("moment"));
const Model_1 = __importDefault(require("./Model"));
const Order_1 = __importDefault(require("./Order"));
class Customer extends Model_1.default {
    static dropdown() {
        return this.query().select('id', 'company_name', 'email', 'phone');
    }
    static async listing(request) {
        const { page = 1, search_key = '', is_credit_availed = null, customer_type = '', sales_executive_id = '', } = request.qs();
        const limit = 10;
        let total_count = await this.query().count('customers.id as count').first();
        let query = this.query();
        if (customer_type) {
            query.where('customers.customer_type', customer_type);
        }
        if (search_key) {
            query = query.where((query) => {
                query
                    .orWhere('customers.company_name', 'LIKE', `%${search_key}%`)
                    .orWhere('customers.id', 'LIKE', `%${search_key}%`)
                    .orWhere('customers.phone', 'LIKE', `%${search_key}%`)
                    .orWhere('customers.email', 'LIKE', `%${search_key}%`);
            });
        }
        if (is_credit_availed) {
            let credit_availed = is_credit_availed === '1' ? true : false;
            query.where('customers.is_credit_availed', credit_availed);
        }
        if (sales_executive_id && !isNaN(sales_executive_id)) {
            query.where('customers.sales_executive_id', '=', sales_executive_id);
        }
        let data = await query
            .leftJoin('orders as o', 'customers.id', 'o.customer_id')
            .preload('user', (query) => {
            query.select('name');
        })
            .count('o.id as order_count')
            .sum('o.grand_total as total_revenue')
            .select('customers.id', 'customers.customer_type', 'customers.company_name', 'customers.email', 'customers.phone', 'customers.is_credit_availed', 'customers.sales_executive_id')
            .groupBy('customers.id')
            .orderBy('customers.id', 'desc')
            .paginate(page, limit);
        return { data: data, total_count: total_count.$extras.count };
    }
    static async getLateChargesList(query_string) {
        const { page = 1, start_date = '', end_date = '', search_key = '' } = query_string;
        let query = this.query();
        let limit = 10;
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
        if (search_key) {
            query = query.where((query) => {
                query
                    .orWhere('company_name', 'LIKE', `%${search_key}%`)
                    .orWhere('id', 'LIKE', `%${search_key}%`)
                    .orWhere('phone', 'LIKE', `%${search_key}%`)
                    .orWhere('email', 'LIKE', `%${search_key}%`);
            });
        }
        return await query
            .preload('credit_net_due')
            .select('id', 'company_name', 'credit_limit', 'credit_net_due_id', 'late_charges', 'grace_period', 'credit_net_due_id', 'charges_type')
            .paginate(page, limit);
    }
    static async getListByCustomerId(id, query_string) {
        let { page = 1, payment_status = '', start_date = '', end_date = '' } = query_string;
        const limit = 10;
        let query = Order_1.default.query()
            .preload('customer')
            .where('o.customer_id', id);
        if (payment_status) {
            query.where('order_payments.payment_status', payment_status);
        }
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.where('order_payments.created_at', '>=', start);
            query.where('order_payments.created_at', '<=', end);
        }
        return await query.paginate(page, limit);
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Customer.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "company_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "industry_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "equipment", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "customer_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "address", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "city", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Customer.prototype, "pincode", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "state", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "image", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Customer.prototype, "sales_executive_id", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, {
        foreignKey: 'sales_executive_id',
    }),
    __metadata("design:type", Object)
], Customer.prototype, "user", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "account_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "account_number", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "bank_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "ifsc_code", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "cancelled_cheque", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "gst_no", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "gst_certificate", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Customer.prototype, "is_credit_availed", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Customer.prototype, "credit_limit", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Customer.prototype, "credit_net_due_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "credit_pan", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "credit_aadhaar", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "credit_bank_statement", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "credit_blank_cheque", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "credit_cibil", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Customer.prototype, "outstanding_amount", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Customer.prototype, "late_charges", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Customer.prototype, "charges_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Customer.prototype, "grace_period", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Customer.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Customer.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, {
        foreignKey: 'sales_executive_id',
    }),
    __metadata("design:type", Object)
], Customer.prototype, "sales_executive", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => CreditNetDue_1.default, {
        foreignKey: 'credit_net_due_id',
    }),
    __metadata("design:type", Object)
], Customer.prototype, "credit_net_due", void 0);
exports.default = Customer;
//# sourceMappingURL=Customer.js.map