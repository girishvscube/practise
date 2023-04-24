"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'customer_delivery_details';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.integer('customer_id').unsigned().references('id').inTable('customers');
            table.string('address_1', 500).notNullable();
            table.string('address_2', 500).nullable();
            table.integer('pincode').notNullable();
            table.string('address_type', 100).notNullable();
            table.string('city', 50).notNullable();
            table.string('state', 100);
            table.string('phone', 20).notNullable();
            table.string('landmark', 100).nullable();
            table.string('location').nullable();
            table.string('location_name').nullable();
            table.boolean('is_fuel_price_checked').notNullable().defaultTo(false);
            table.double('fuel_price').nullable();
            table.boolean('is_deleted').notNullable().defaultTo(false);
            table.integer('customer_poc_id').unsigned().references('id').inTable('customer_pocs');
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1662302395911_customer_delivery_details.js.map