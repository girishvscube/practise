"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'purchase_orders';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('supplier_id').unsigned().references('id').inTable('suppliers');
            table.integer('bowser_id').unsigned().references('id').inTable('bowsers');
            table.integer('fuel_qty').notNullable();
            table.timestamp('purchase_date').notNullable();
            table.double('price_per_litre').notNullable();
            table.double('total_amount').notNullable();
            table.string('additional_notes').nullable();
            table.string('status').notNullable().defaultTo('PO_PROCESSING');
            table.double('balance').notNullable().defaultTo(0.0);
            table.string('payment_status').notNullable().defaultTo('UNPAID');
            table.boolean('is_order_confirmed').notNullable().defaultTo(false);
            table.boolean('is_order_delivered').notNullable().defaultTo(false);
            table.integer('no_of_order_linked').notNullable().defaultTo(0);
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1663757933123_purchase_orders.js.map