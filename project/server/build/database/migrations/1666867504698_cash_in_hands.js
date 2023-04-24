"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'cash_in_hands';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('type').notNullable();
            table.double('amount').notNullable();
            table.integer('customer_id').unsigned().references('id').inTable('customers');
            table.integer('supplier_id').unsigned().references('id').inTable('suppliers');
            table.integer('expense_id').unsigned().references('id').inTable('expenses');
            table.integer('pay_in_id').unsigned().references('id').inTable('pay_ins');
            table.integer('pay_out_id').unsigned().references('id').inTable('pay_outs');
            table.timestamp('adjustment_date').notNullable();
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1666867504698_cash_in_hands.js.map