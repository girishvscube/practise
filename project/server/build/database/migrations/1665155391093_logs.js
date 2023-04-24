"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class Logs extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'logs';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id');
            table.integer('model_id');
            table.string('model', 100);
            table.integer('user_id').unsigned().references('id').inTable('users').notNullable();
            table.string('message', 500);
            table.string('type', 30).defaultTo('ACTION');
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = Logs;
//# sourceMappingURL=1665155391093_logs.js.map