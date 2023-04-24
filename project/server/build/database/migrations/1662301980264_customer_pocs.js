"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'customer_pocs';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('customer_id').unsigned().references('id').inTable('customers');
            table.string('poc_name', 100).notNullable();
            table.string('designation', 100).notNullable();
            table.string('phone', 20).notNullable();
            table.string('email', 200).notNullable();
            table.string('image').nullable();
            table.boolean('is_deleted').notNullable().defaultTo(false);
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1662301980264_customer_pocs.js.map