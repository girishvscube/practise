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
const Bowser_1 = __importDefault(require("./Bowser"));
const moment_1 = __importDefault(require("moment"));
const Model_1 = __importDefault(require("./Model"));
class BowserDriver extends Model_1.default {
    static async listing(id, query_string) {
        let { page = 1, start_date = null, end_date = null } = query_string;
        const limit = 10;
        let total_count = await this.query().count('id as count').where('bowser_id', id).first();
        let query = this.query()
            .preload('user', (q) => q.select('name'))
            .where('bowser_id', id);
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
        let data = await query.orderBy('id', 'desc').paginate(page, limit);
        return { data: data, total_count: total_count.$extras.count };
    }
}
__decorate([
    (0, Orm_1.column)({ isPrimary: true }),
    __metadata("design:type", Number)
], BowserDriver.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], BowserDriver.prototype, "user_id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], BowserDriver.prototype, "bowser_id", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], BowserDriver.prototype, "start_time", void 0);
__decorate([
    Orm_1.column.dateTime(),
    __metadata("design:type", luxon_1.DateTime)
], BowserDriver.prototype, "end_time", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", String)
], BowserDriver.prototype, "status", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true }),
    __metadata("design:type", luxon_1.DateTime)
], BowserDriver.prototype, "createdAt", void 0);
__decorate([
    Orm_1.column.dateTime({ autoCreate: true, autoUpdate: true }),
    __metadata("design:type", luxon_1.DateTime)
], BowserDriver.prototype, "updatedAt", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => User_1.default, { foreignKey: 'user_id' }),
    __metadata("design:type", Object)
], BowserDriver.prototype, "user", void 0);
__decorate([
    (0, Orm_1.belongsTo)(() => Bowser_1.default, { foreignKey: 'bowser_id' }),
    __metadata("design:type", Object)
], BowserDriver.prototype, "bowser", void 0);
exports.default = BowserDriver;
//# sourceMappingURL=BowserDriver.js.map