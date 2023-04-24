"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'roles';
    }
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.boolean('is_deleted').defaultTo(false);
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('is_deleted');
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=1669121085277_role_soft_deletes.js.map