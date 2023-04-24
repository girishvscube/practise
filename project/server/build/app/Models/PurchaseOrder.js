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
const Bowser_1 = __importDefault(require("./Bowser"));
const moment_1 = __importDefault(require("moment"));
const Model_1 = __importDefault(require("./Model"));
class PurchaseOrder extends Model_1.default {
    static async count(query_string) {
        let { start_date = '', end_date = '' } = query_string;
        let query = this.query();
        let query1 = this.query();
        let query2 = this.query();
        let query3 = this.query();
        query.sum('fuel_qty as fuel_qty');
        query1.sum('fuel_qty as fuel_delivered').where('status', 'Purchase Done');
        query2.count('id as po_raised').where('status', 'PO Raised');
        query3.count('id as po_done').where('status', 'Purchase Done');
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
            query3.where('created_at', '>=', start);
            query3.where('created_at', '<=', end);
        }
        let total_fuel_qty = await query;
        let fuel_delivered = await query1;
        let po_raised = await query2;
        let po_done = await query3;
        return {
            total_fuel_qty: total_fuel_qty[0].fuel_qty,
            fuel_delivered: fuel_delivered[0].$extras.fuel_delivered,
            po_raised: po_raised[0].$extras.po_raised,
            po_done: po_done[0].$extras.po_done,
        };
    }
    static async getListBySupplierId(id, query_string) {
        let { page = 1, start_date = null, end_date = null } = query_string;
        const limit = 10;
        let total_count = await this.query().count('id as count').where('supplier_id', id).first();
        let query = this.query().where('supplier_id', id);
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.where('purchase_date', '>=', start);
            query.where('purchase_date', '<=', end);
        }
        let data = await query.preload('supplier', (q) => q.select('*')).paginate(page, limit);
        return { data: data, total_count: total_count.$extras.count };
    }
    static async listing(query_string) {
        let { page = 1, start_date = null, end_date = null, status = null, search_key = null, } = query_string;
        const limit = 10;
        let total_count = await this.query().count('id as count').first();
        let query = this.query().innerJoin('suppliers as s', 's.id', 'purchase_orders.supplier_id');
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.whereBetween('purchase_orders.created_at', [start, end]);
        }
        if (status) {
            query.where('status', status);
        }
        query.preload('supplier', (supplier) => {
            supplier.select('name');
        });
        if (search_key) {
            query.where('s.name', 'like', `%${search_key}%`);
        }
        let data = await query
            .select('purchase_orders.id', 'purchase_orders.created_at', 'purchase_orders.purchase_date', 'purchase_orders.supplier_id', 'purchase_orders.fuel_qty', 'purchase_orders.no_of_order_linked', 'purchase_orders.status', 'purchase_orders.payment_status')
            .paginate(page, limit);
        return { data: data, total_count: total_count.$extras.count };
    }
    static async purchaseBillStats(query_string) {
        let { start_date = null, end_date = null } = query_string;
        let query = this.query().count('id as count').where('purchase_orders.is_order_confirmed', 1);
        let query1 = this.query()
            .count('id as count')
            .where('is_order_confirmed', 1)
            .where('payment_status', 'Paid');
        let query2 = this.query()
            .count('id as count')
            .where('is_order_confirmed', 1)
            .whereNot('payment_status', '=', 'Paid');
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.where('purchase_orders.purchase_date', '>=', start);
            query.where('purchase_orders.purchase_date', '<=', end);
            query1.where('purchase_orders.purchase_date', '>=', start);
            query1.where('purchase_orders.purchase_date', '<=', end);
            query2.where('purchase_orders.purchase_date', '>=', start);
            query2.where('purchase_orders.purchase_date', '<=', end);
        }
        let total = await query.first();
        let paid = await query1.first();
        let unpaid = await query2.first();
        return {
            total: total.$extras.count,
            paid: paid.$extras.count,
            unpaid: unpaid.$extras.count,
        };
    }
    static async purchaseBillList(query_string) {
        let { page = 1, start_date = null, end_date = null, status = null, search_key = null, } = query_string;
        const limit = 10;
        let total_count = await this.query().count('id as count').first();
        let query = this.query()
            .leftJoin('suppliers as s', 's.id', 'purchase_orders.supplier_id')
            .preload('supplier', (q) => q.select('name'))
            .select('purchase_orders.id')
            .select('purchase_orders.supplier_id')
            .select('purchase_orders.supplier_id')
            .select('purchase_orders.bowser_id')
            .select('purchase_orders.total_amount')
            .select('purchase_orders.balance')
            .select('purchase_orders.payment_status')
            .select('purchase_orders.purchase_date')
            .where('status', 'PURCHASE_DONE');
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.where('purchase_orders.purchase_date', '>=', start);
            query.where('purchase_orders.purchase_date', '<=', end);
        }
        if (search_key) {
            query.orWhere('purchase_orders.id', 'LIKE', `%${search_key}%`);
            query.orWhere('s.name', 'LIKE', `%${search_key}%`);
        }
        if (status) {
            query.where('purchase_orders.payment_status', status);
        }
        let data = await query.orderBy('id', 'desc').paginate(page, limit);
        return { data: data, total_count: total_count.$extras.count };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "supplier_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "bowser_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "fuel_qty", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], PurchaseOrder.prototype, "purchase_date", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "price_per_litre", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "total_amount", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "balance", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "additional_notes", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], PurchaseOrder.prototype, "payment_status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], PurchaseOrder.prototype, "is_order_confirmed", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], PurchaseOrder.prototype, "no_of_order_linked", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], PurchaseOrder.prototype, "is_order_delivered", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], PurchaseOrder.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], PurchaseOrder.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Supplier_1.default, { foreignKey: 'supplier_id' }),
    __metadata("design:type", Object)
], PurchaseOrder.prototype, "supplier", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Bowser_1.default, { foreignKey: 'bowser_id' }),
    __metadata("design:type", Object)
], PurchaseOrder.prototype, "bowser", void 0);
exports.default = PurchaseOrder;
//# sourceMappingURL=PurchaseOrder.js.map