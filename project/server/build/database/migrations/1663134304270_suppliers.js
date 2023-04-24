"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'suppliers';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('name', 100).notNullable();
            table.string('phone', 20).notNullable();
            table.string('email', 200).notNullable().unique();
            table.string('type', 50).notNullable();
            table.string('address', 150).notNullable();
            table.string('city', 100).notNullable();
            table.string('location').nullable();
            table.integer('pincode').notNullable();
            table.string('state', 100).notNullable();
            table.string('account_number').notNullable();
            table.string('account_name').notNullable();
            table.string('bank_name').notNullable();
            table.string('ifsc_code').notNullable();
            table.string('cancelled_cheque').nullable();
            table.string('gst').nullable();
            table.string('gst_certificate').nullable();
            table.string('image').nullable();
            table.double('per_litre_price').nullable();
            table.timestamp('created_at', { useTz: true }).nullable();
            table.timestamp('updated_at', { useTz: true }).nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1663134304270_suppliers.js.map