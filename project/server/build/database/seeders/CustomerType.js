"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const CustomerType_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CustomerType"));
class default_1 extends Seeder_1.default {
    async run() {
        await CustomerType_1.default.createMany([
            {
                id: 1,
                name: 'Company',
            },
            {
                id: 2,
                name: 'Individual',
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=CustomerType.js.map