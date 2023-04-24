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
const User_1 = __importDefault(require("./User"));
const moment_1 = __importDefault(require("moment"));
const Model_1 = __importDefault(require("./Model"));
class SupportTicket extends Model_1.default {
    static async count(query_string) {
        let { start_date = '', end_date = '' } = query_string;
        let query = this.query();
        let query1 = this.query();
        let query2 = this.query();
        let query3 = this.query();
        query.count('id as count');
        query1.count('id as count').where('status', 'Open');
        query2.count('id as count').where('status', 'Close');
        query3.count('id as count').where('status', 'Unassigned');
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
        let openCount = await query1;
        let closedCount = await query2;
        let unassignedCount = await query3;
        return {
            total: totalCount[0].$extras.count,
            open: openCount[0].$extras.count,
            closed: closedCount[0].$extras.count,
            unassigned: unassignedCount[0].$extras.count,
        };
    }
    static async listing(query_string) {
        let { page = 1, start_date = null, end_date = null, status = null, created_by = null, search_key = null, } = query_string;
        let query = this.query();
        const limit = 10;
        let total_count = await this.query().count('id as count').first();
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
        if (status) {
            query.where('status', status);
        }
        if (created_by) {
            query.where('created_by', created_by);
        }
        if (search_key) {
            query.orWhere('customer_name', 'like', `%${search_key}%`);
            query.orWhere('phone', 'like', `%${search_key}%`);
        }
        let data = await query
            .preload('assigned_user', (user_q) => user_q.select('name', 'id'))
            .preload('created_user', (user_q) => user_q.select('name', 'id'))
            .select('*')
            .paginate(page, limit);
        return { data: data, total_count: total_count.$extras.count };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], SupportTicket.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], SupportTicket.prototype, "order_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupportTicket.prototype, "customer_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupportTicket.prototype, "issue_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupportTicket.prototype, "phone", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], SupportTicket.prototype, "call_back_time", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupportTicket.prototype, "more_info", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], SupportTicket.prototype, "sales_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupportTicket.prototype, "priority", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupportTicket.prototype, "image", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupportTicket.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], SupportTicket.prototype, "is_reassign_requested", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], SupportTicket.prototype, "reassign_notes", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], SupportTicket.prototype, "reassign_date", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], SupportTicket.prototype, "created_by", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], SupportTicket.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], SupportTicket.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Order_1.default, { foreignKey: 'order_id' }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "order", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, { foreignKey: 'sales_id' }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "assigned_user", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, { foreignKey: 'created_by' }),
    __metadata("design:type", Object)
], SupportTicket.prototype, "created_user", void 0);
exports.default = SupportTicket;
//# sourceMappingURL=SupportTicket.js.map