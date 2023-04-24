"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'permissions';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('role_id').unsigned().references('id').inTable('roles').notNullable();
            table
                .integer('module_id')
                .unsigned()
                .references('id')
                .inTable('role_modules')
                .notNullable();
            table.boolean('is_read').defaultTo(false);
            table.boolean('is_write').defaultTo(false);
            table.boolean('is_delete').defaultTo(false);
            table.boolean('is_update').defaultTo(false);
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1668769635710_permissions.js.map