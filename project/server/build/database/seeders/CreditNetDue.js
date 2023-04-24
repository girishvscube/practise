"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const CreditNetDue_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CreditNetDue"));
class default_1 extends Seeder_1.default {
    async run() {
        await CreditNetDue_1.default.createMany([
            {
                name: '10 Days',
                days: 10,
            },
            {
                name: '15 Days',
                days: 15,
            },
            {
                name: '20 Days',
                days: 20,
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=CreditNetDue.js.map