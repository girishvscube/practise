"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'support_tickets';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('order_id').nullable().unsigned().references('id').inTable('orders');
            table.string('customer_name').notNullable();
            table.string('issue_type').notNullable().defaultTo('Other');
            table.string('phone', 20).nullable();
            table.timestamp('call_back_time').nullable();
            table.string('more_info').nullable();
            table.integer('sales_id').nullable().unsigned().references('id').inTable('users');
            table.string('priority').nullable();
            table.string('image').nullable();
            table.string('status').nullable();
            table.boolean('is_reassign_requested').nullable();
            table.string('reassign_notes').nullable();
            table.timestamp('reassign_date').nullable();
            table.integer('created_by').nullable().unsigned().references('id').inTable('users');
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1664202785572_support_tickets.js.map