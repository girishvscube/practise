"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class UsersSchema extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'users';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('name', 50).notNullable();
            table.string('email', 255).notNullable().unique();
            table.string('phone', 15).notNullable();
            table.string('password', 180).notNullable();
            table.string('address', 500).notNullable();
            table.string('city', 50).notNullable();
            table.string('state', 50).notNullable();
            table.string('pincode', 6).notNullable();
            table.string('image', 255).nullable();
            table.boolean('is_active').defaultTo(1);
            table.boolean('is_new_user').defaultTo(1);
            table.string('reset_token', 255).nullable();
            table.string('dl_image', 255).nullable();
            table.integer('role_id').unsigned().references('id').inTable('roles').notNullable();
            table.integer('created_by').unsigned().references('id').inTable('users').nullable();
            table.json('images');
            table.json('bank_details');
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = UsersSchema;
//# sourceMappingURL=1660277699085_users.js.map