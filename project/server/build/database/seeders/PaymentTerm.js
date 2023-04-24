"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const PaymentTerm_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PaymentTerm"));
class default_1 extends Seeder_1.default {
    async run() {
        PaymentTerm_1.default.createMany([
            {
                id: 1,
                name: 'Credit',
                rules: '1. Should be paid before due date \n 2. If not some interest will be applied on outstanding amount',
            },
            {
                id: 2,
                name: 'PIA',
                rules: '1. Should pay 100% in advance',
            },
            {
                id: 3,
                name: 'POD',
                rules: '1. Should pay paid after delivery',
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=PaymentTerm.js.map