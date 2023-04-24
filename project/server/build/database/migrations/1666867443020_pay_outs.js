"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'pay_outs';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table
                .integer('supplier_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('suppliers');
            table
                .integer('bank_account_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('bank_accounts');
            table.integer('no_of_invoices').notNullable();
            table.timestamp('payout_date').notNullable();
            table.double('amount').notNullable();
            table.string('notes').nullable();
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1666867443020_pay_outs.js.map