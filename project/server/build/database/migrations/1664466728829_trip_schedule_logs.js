"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'trip_schedule_logs';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('trip_id').unsigned().references('id').inTable('trips');
            table.integer('so_id').unsigned().references('id').inTable('orders');
            table.integer('po_id').unsigned().references('id').inTable('purchase_orders');
            table.string('type');
            table.timestamp('start_time').nullable();
            table.timestamp('end_time').nullable();
            table.string('odometer_start');
            table.string('odometer_end');
            table.string('status');
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1664466728829_trip_schedule_logs.js.map