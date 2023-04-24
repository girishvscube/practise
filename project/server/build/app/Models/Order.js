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
const moment_1 = __importDefault(require("moment"));
const Customer_1 = __importDefault(require("./Customer"));
const User_1 = __importDefault(require("./User"));
const Model_1 = __importDefault(require("./Model"));
const Trip_1 = __importDefault(require("./Trip"));
const PurchaseSalesOrder_1 = __importDefault(require("./PurchaseSalesOrder"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
class Order extends Model_1.default {
    static async listing(query_string) {
        try {
            let { page = 1, start_date = null, end_date = null, status = '', sales_executive_id = '', search_key = '', } = query_string;
            const limit = 10;
            let total_count = await this.query().count('id as count').first();
            let query = this.query();
            if (search_key) {
                query = query.where((query) => {
                    query
                        .orWhere('orders.id', 'LIKE', `%${search_key}%`)
                        .orWhere('customers.company_name', 'LIKE', `%${search_key}%`)
                        .orWhere('customers.phone', 'LIKE', `%${search_key}%`)
                        .orWhere('customers.email', 'LIKE', `%${search_key}%`);
                });
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
                query.where('orders.created_at', '>=', start);
                query.where('orders.created_at', '<=', end);
            }
            if (status) {
                query.where('orders.status', status);
            }
            if (sales_executive_id) {
                query.where('orders.sales_executive_id', sales_executive_id);
            }
            let record = await query
                .join('customers', (query) => {
                query.on('customers.id', '=', 'orders.customer_id');
            })
                .preload('customer', (query) => {
                query.select('id', 'company_name', 'phone', 'email');
            })
                .preload('user', (query) => {
                query.select('id', 'name', 'phone', 'email');
            })
                .select('orders.id', 'orders.customer_id', 'orders.created_at', 'orders.delivery_date', 'orders.time_slot', 'orders.sales_executive_id', 'orders.fuel_qty', 'orders.status', 'orders.payment_status', 'orders.customer_delivery_details', 'orders.is_order_confirmed', 'orders.is_order_cancelled')
                .orderBy('orders.id', 'desc')
                .paginate(page, limit);
            let orderList = [];
            for (let index = 0; index < record.length; index++) {
                const element = record[index];
                let orderObj = {
                    created_at: element.createdAt,
                    customer: element.customer,
                    customer_delivery_details: JSON.parse(element.customer_delivery_details),
                    customer_id: element.customer_id,
                    delivery_date: element.delivery_date,
                    fuel_qty: element.fuel_qty,
                    id: element.id,
                    payment_status: element.payment_status,
                    sale_executive_id: element.sales_executive_id,
                    status: element.status,
                    time_slot: element.time_slot,
                    user: element.user,
                    is_order_confirmed: element.is_order_confirmed
                };
                orderList.push(orderObj);
            }
            return {
                total_count: total_count.$extras.count,
                data: { meta: record.getMeta(), data: orderList },
            };
        }
        catch (exception) {
            throw exception;
        }
    }
    static async getOrdersByCustomerId(id, query_string) {
        let { page = 1, start_date = null, end_date = null } = query_string;
        const limit = 10;
        let query = this.query();
        let statsQuery = ``;
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
            statsQuery = `and created_at >= '${start}' and created_at <= '${end}'`;
        }
        let total_count = await this.query().count('id as count').where('customer_id', id).first();
        let list = await query
            .where('customer_id', id)
            .select('id', 'customer_id', 'created_at', 'delivery_date', 'fuel_qty', 'status', 'payment_status', 'grand_total')
            .orderBy('id', 'desc')
            .paginate(page, limit);
        let [[[count]], [[paidOrders]]] = await Promise.all([
            Database_1.default.rawQuery(`SELECT count(id) as total_orders  from orders where customer_id = ${id} ${statsQuery}`),
            Database_1.default.rawQuery(`SELECT  sum(total_amount) as total_amount from orders where customer_id = ${id} and payment_status = "PAID" ${statsQuery}`),
        ]);
        return {
            data: list,
            total_orders: count.total_orders || 0,
            total_order_amount: paidOrders.total_amount || 0,
            total_count: total_count.$extras.count,
        };
    }
    static async count(query_string) {
        let { start_date = '', end_date = '' } = query_string;
        let query = this.query();
        let query1 = this.query();
        let query2 = this.query();
        let query3 = this.query();
        query.count('orders.id as count');
        query1.count('orders.id as count').andWhere('status', 'DELIVERED');
        query2
            .count('id as count')
            .andWhereNot('status', 'DELIVERED')
            .andWhereNot('status', 'ORDER_CANCELLED');
        query3.sum('fuel_qty as fuel_qty').andWhere('status', 'DELIVERED');
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
        let totalCount = await query;
        let deliveredCount = await query1;
        let inProgressCount = await query2;
        let sumFuelQty = await query3;
        return {
            total: totalCount[0].$extras,
            delivered: deliveredCount[0].$extras,
            in_progress: inProgressCount[0].$extras,
            fuel_qty: sumFuelQty[0].fuel_qty,
        };
    }
    static async confirmedOrder(query_string, id) {
        let so_list = [];
        let trip = await Trip_1.default.findOrFail(id);
        let linked_orders = await PurchaseSalesOrder_1.default.query()
            .preload('order', (q) => q.select('id', 'created_at', 'order_type', 'fuel_qty', 'customer_delivery_details', 'delivery_date', 'time_slot'))
            .where('po_id', trip.po_id);
        let { order_type = '', time_slot = '', start_date = '', end_date = '' } = query_string;
        let query = Order.query()
            .leftJoin('purchase_sales_orders as pso', 'pso.so_id', 'orders.id')
            .where('is_order_confirmed', true)
            .where('is_order_cancelled', false)
            .whereNull('pso.po_id');
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.where('orders.created_at', '>=', start);
            query.where('orders.created_at', '<=', end);
        }
        if (order_type) {
            query.where('orders.order_type', order_type);
        }
        if (time_slot) {
            query.where('orders.time_slot', 'LIKE', `%${time_slot}%`);
        }
        let data = await query.select('orders.id', 'orders.created_at', 'orders.order_type', 'orders.fuel_qty', 'orders.delivery_date', 'orders.customer_delivery_details', 'orders.time_slot');
        for (let index = 0; index < linked_orders.length; index++) {
            const element = linked_orders[index];
            let so = {
                customer_delivery_details: JSON.parse(element.order.customer_delivery_details),
                created_at: element.order.createdAt,
                delivery_date: element.order.delivery_date,
                fuel_qty: element.order.fuel_qty,
                id: element.order.id,
                order_type: element.order.order_type,
                time_slot: element.order.time_slot,
            };
            so_list.push(so);
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let so = {
                customer_delivery_details: JSON.parse(element.customer_delivery_details),
                created_at: element.createdAt,
                delivery_date: element.delivery_date,
                fuel_qty: element.fuel_qty,
                id: element.id,
                order_type: element.order_type,
                time_slot: element.time_slot,
            };
            so_list.push(so);
        }
        return so_list;
    }
    static async invoiceList(query_string) {
        let { page = 1, start_date = '', end_date = '', status = '', search_key = '', } = query_string;
        const limit = 10;
        let total_count = await this.query()
            .count('id as count')
            .where('orders.status', 'DELIVERED')
            .first();
        let query = this.query()
            .innerJoin('customers as c', 'c.id', 'orders.customer_id')
            .preload('customer', (q) => q.select('company_name', 'customer_type'))
            .select('orders.id', 'orders.customer_id', 'orders.created_at', 'orders.grand_total', 'orders.due_date', 'orders.balance', 'orders.payment_status')
            .where('orders.status', 'DELIVERED');
        if (start_date && end_date) {
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            query.where('orders.created_at', '>=', start);
            query.where('orders.created_at', '<=', end);
        }
        if (status) {
            query.where('orders.payment_status', status);
        }
        if (search_key) {
            query.orWhere('orders.id', 'LIKE', `%${search_key}%`);
            query.orWhere('c.company_name', 'LIKE', `%${search_key}%`);
        }
        let data = await query.paginate(page, limit);
        return { data: data, total_count: total_count.$extras.count };
    }
    static async invoiceStats(query_string) {
        let { start_date = '', end_date = '' } = query_string;
        let query = this.query().count('id as count').where('status', 'DELIVERED');
        let query1 = this.query()
            .count('id as count')
            .where('status', 'DELIVERED')
            .where('payment_status', 'PAID');
        let query2 = this.query()
            .count('id as count')
            .where('status', 'DELIVERED')
            .where('payment_status', 'UN_PAID');
        let query3 = this.query()
            .count('id as count')
            .where('status', 'DELIVERED')
            .where('payment_status', 'PARTIALLY_PAID');
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
        let total = await query.first();
        let paid = await query1.first();
        let unpaid = await query2.first();
        let partially_paid = await query3.first();
        return {
            total: total.$extras.count,
            paid: paid.$extras.count,
            unpaid: unpaid.$extras.count,
            partially_paid: partially_paid.$extras.count,
        };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Order.prototype, "customer_id", void 0);
__decorate([
    (0, Orm_1.column)({
        prepare: (value) => JSON.stringify(value),
        serialize: (value) => {
            return value && typeof value === 'string' ? JSON.parse(value) : value;
        },
    }),
    __metadata("design:type", Object)
], Order.prototype, "customer_delivery_details", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Order.prototype, "order_type", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Order.prototype, "delivery_date", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Order.prototype, "time_slot", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Order.prototype, "fuel_qty", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Order.prototype, "sales_executive_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Order.prototype, "discount_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Order.prototype, "discount", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Order.prototype, "per_litre_cost", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Order.prototype, "total_amount", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Order.prototype, "delivery_charges", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Order.prototype, "grand_total", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Order.prototype, "balance", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Order.prototype, "due_date", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Order.prototype, "last_date", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Order.prototype, "payment_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Order.prototype, "payment_rules", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Order.prototype, "payment_status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Order.prototype, "additional_notes", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Order.prototype, "is_order_confirmed", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Order.prototype, "is_order_cancelled", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Order.prototype, "is_order_delivered", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Order.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Order.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Customer_1.default, { foreignKey: 'customer_id' }),
    __metadata("design:type", Object)
], Order.prototype, "customer", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, { foreignKey: 'sales_executive_id' }),
    __metadata("design:type", Object)
], Order.prototype, "user", void 0);
exports.default = Order;
//# sourceMappingURL=Order.js.map