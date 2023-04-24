"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'notifications';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('message').notNullable();
            table
                .integer('module_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('role_modules');
            table.integer('reference_id');
            table.integer('notify_to').nullable().unsigned().references('id').inTable('users');
            table.integer('assignee');
            table.boolean('is_read').defaultTo(false);
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1669286071480_notifications.js.map