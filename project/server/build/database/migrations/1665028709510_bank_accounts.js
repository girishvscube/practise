"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'bank_accounts';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('account_name');
            table.string('bank_name', 50);
            table.string('account_number');
            table.string('ifsc_code');
            table.double('opening_balance');
            table.timestamp('as_of_date');
            table.boolean('print_ac_number').defaultTo(false);
            table.string('account_type');
            table.boolean('print_upi_qr').defaultTo(false);
            table.string('upi_id');
            table.boolean('is_active').defaultTo(true);
            table.string('qr_code');
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1665028709510_bank_accounts.js.map