"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const DeliveryCharge_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/DeliveryCharge"));
class default_1 extends Seeder_1.default {
    async run() {
        await DeliveryCharge_1.default.createMany([
            {
                id: 1,
                charges: 0,
                type: 'Regular',
            },
            {
                id: 2,
                charges: 500,
                type: 'Express',
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=DeliveryCharge.js.map