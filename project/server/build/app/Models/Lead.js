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
const moment_1 = __importDefault(require("moment"));
const Model_1 = __importDefault(require("./Model"));
class Lead extends Model_1.default {
    static async listing(request, user) {
        const { page = 1, start_date = '', end_date = '', status = '', source = '', assigned_to = '', search_key = '', } = request.qs();
        let limit = 10;
        let total_count = await this.query().count('id as count').first();
        let query = this.query();
        if (user.role.slug != 'admin' && user.role.slug != 'manager') {
            query.where((query) => {
                query.where('assigned_to', '=', user.id).where('is_reassign_req', 0);
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
            query.where('created_at', '>=', start);
            query.where('created_at', '<=', end);
        }
        if (status) {
            query.where('status', status);
        }
        if (source) {
            query.where('source', source);
        }
        if (assigned_to) {
            query.where('assigned_to', assigned_to);
        }
        if (search_key) {
            query.orWhere('company_name', 'LIKE', `%${search_key}%`);
            query.orWhere('company_phone', 'LIKE', `%${search_key}%`);
            query.orWhere('email', 'LIKE', `%${search_key}%`);
            query.orWhere('contact_person_name', 'LIKE', `%${search_key}%`);
            query.orWhere('contact_person_phone', 'LIKE', `%${search_key}%`);
        }
        let data = await query
            .preload('user', (query) => {
            query.select('name');
        })
            .preload('userObj', (query) => {
            query.select('name as created_by');
        })
            .select('id', 'source', 'company_name', 'company_phone', 'contact_person_name', 'contact_person_phone', 'assigned_to', 'status', 'created_by', 'created_at', 'is_reassign_req', 're_assign_notes', 're_assign_date')
            .orderBy('id', 'desc')
            .paginate(page, limit);
        return {
            data: data,
            total_count: total_count.$extras.count,
        };
    }
    static async count(query_string) {
        let { start_date = '', end_date = '' } = query_string;
        let query = this.query();
        let query1 = this.query();
        let query2 = this.query();
        query.count('id as count');
        query1.count('id as count').andWhere('status', 'Converted');
        query2.count('id as count').andWhere('status', 'Not Interested');
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
        let createdCount = await query;
        let convertedCount = await query1;
        let notInterestedCount = await query2;
        return {
            total: createdCount[0].$extras.count,
            converted: convertedCount[0].$extras.count,
            not_interested: notInterestedCount[0].$extras.count,
        };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], Lead.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "company_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "company_phone", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "email", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "contact_person_name", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "contact_person_phone", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "status", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "industry_type", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Lead.prototype, "fuel_usage_per_month", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "source", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Lead.prototype, "assigned_to", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "address", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "city", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "state", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "pincode", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Boolean)
], Lead.prototype, "is_reassign_req", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], Lead.prototype, "callback_time", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], Lead.prototype, "re_assign_notes", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Object)
], Lead.prototype, "re_assign_date", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Lead.prototype, "created_by", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Lead.prototype, "created_at", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], Lead.prototype, "updated_at", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, {
        foreignKey: 'assigned_to',
    }),
    __metadata("design:type", Object)
], Lead.prototype, "user", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, {
        foreignKey: 'created_by',
    }),
    __metadata("design:type", Object)
], Lead.prototype, "userObj", void 0);
exports.default = Lead;
//# sourceMappingURL=Lead.js.map