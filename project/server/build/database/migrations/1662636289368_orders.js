"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'orders';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table
                .integer('customer_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('customers');
            table.string('order_type').notNullable();
            table.date('delivery_date').notNullable();
            table.string('fuel_qty').notNullable();
            table.string('discount_type').nullable();
            table.double('discount').nullable();
            table.double('per_litre_cost').nullable();
            table.double('total_amount').nullable();
            table.double('delivery_charges').nullable().defaultTo(0);
            table.double('grand_total').nullable();
            table.double('balance').nullable().defaultTo(0.0);
            table.timestamp('due_date').nullable();
            table.timestamp('last_date').nullable();
            table.string('payment_type').nullable();
            table.string('payment_rules').nullable();
            table.string('payment_status').nullable().defaultTo('UN_PAID');
            table.string('additional_notes').nullable();
            table.json('customer_delivery_details');
            table.string('time_slot');
            table
                .integer('sales_executive_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('users');
            table.string('status').notNullable();
            table.boolean('is_order_confirmed').notNullable().defaultTo(false);
            table.boolean('is_order_delivered').notNullable().defaultTo(false);
            table.boolean('is_order_cancelled').notNullable().defaultTo(false);
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1662636289368_orders.js.map