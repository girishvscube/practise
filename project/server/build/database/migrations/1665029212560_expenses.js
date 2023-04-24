"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'expenses';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.timestamp('date_of_expense').notNullable();
            table.string('expense_type').notNullable();
            table.string('sub_category').nullable();
            table.string('item_name').notNullable();
            table.string('payee').notNullable();
            table.double('amount').notNullable();
            table
                .integer('account_id')
                .notNullable()
                .unsigned()
                .references('id')
                .inTable('bank_accounts');
            table.string('reference_img').nullable();
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1665029212560_expenses.js.map