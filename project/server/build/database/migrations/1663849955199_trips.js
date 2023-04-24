"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'trips';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table
                .integer('po_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('purchase_orders');
            table.timestamp('start_time').nullable();
            table.timestamp('end_time').nullable();
            table.timestamp('po_arrival_time').nullable();
            table.integer('driver_id').nullable().unsigned().references('id').inTable('users');
            table.integer('bowser_id').nullable().unsigned().references('id').inTable('bowsers');
            table.integer('distance_travelled').notNullable().defaultTo(0);
            table.timestamp('actual_end_time').nullable();
            table.integer('fuel_left_at_end').nullable();
            table.string('status').notNullable().defaultTo('NOT_SCHEDULED');
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1663849955199_trips.js.map