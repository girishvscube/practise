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
const supplier_constants_1 = global[Symbol.for('ioc.use')]("App/Helpers/supplier.constants");
const moment_1 = __importDefault(require("moment"));
const PurchaseOrder_1 = __importDefault(require("./PurchaseOrder"));
const Model_1 = __importDefault(require("./Model"));
class Supplier extends Model_1.default {
    static async dropdown() {
        return await this.query().select('*');
    }
    static async listing(query_string) {
        try {
            let { page = 1, search_key = '' } = query_string;
            const limit = 10;
            let total_count = await this.query().count('id as count').first();
            let query = this.query();
            if (search_key) {
                query.orWhere('name', 'like', `%${search_key}%`);
                query.orWhere('phone', 'like', `%${search_key}%`);
                query.orWhere('email', 'like', `%${search_key}%`);
            }
            let data = await query.select('*').orderBy('id', 'desc').paginate(page, limit);
            return { data: data, total_count: total_count.$extras.count };
        }
        catch (exception) {
            throw exception;
        }
    }
    static async count() {
        try {
            let query = this.query();
            let query1 = this.query();
            let query2 = this.query();
            let totalCount = await query.count('id as count');
            let distributorCount = await query1
                .count('id as count')
                .where('type', supplier_constants_1.SUPPLIER_TYPE[0].name);
            let terminalCount = await query2
                .count('id as count')
                .where('type', supplier_constants_1.SUPPLIER_TYPE[1].name);
            return {
                total: totalCount[0].$extras.count,
                distributor: distributorCount[0].$extras.count,
                terminal: terminalCount[0].$extras.count,
            };
        }
        catch (exception) {
            throw exception;
        }
    }
    static async viewPOCount(id, query_string) {
        let { start_date = '', end_date = '' } = query_string;
        let query = PurchaseOrder_1.default.query();
        let query1 = PurchaseOrder_1.default.query();
        query.count('id as count').where('id', id);
        query1.sum('total_amount as total').where('id', id);
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
        }
        let totalCount = await query;
        let distributorCount = await query1;
        return {
            count: totalCount[0].$extras.count,
            total: distributorCount[0].$extras.total,
        };
    }
    static async priceListing(query_string) {
        let { page = 1, search_key = '', start_date = '', end_date = '' } = query_string;
        const limit = 10;
        let query = this.query().select('id', 'name', 'per_litre_price', 'updated_at');
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
            query.where('name', 'like', `%${search_key}%`);
        }
        return await query
            .select('name', 'updated_at', 'per_litre_price')
            .orderBy('updated_at', 'desc')
            .paginate(page, limit);
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Supplier.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "phone", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "address", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "city", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "location", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Supplier.prototype, "pincode", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "state", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "account_number", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "account_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "bank_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "ifsc_code", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "cancelled_cheque", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "gst", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "gst_certificate", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Supplier.prototype, "image", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Supplier.prototype, "per_litre_price", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Supplier.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Supplier.prototype, "updatedAt", void 0);
exports.default = Supplier;
//# sourceMappingURL=Supplier.js.map