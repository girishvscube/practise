"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const IndustryType_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/IndustryType"));
class default_1 extends Seeder_1.default {
    async run() {
        await IndustryType_1.default.createMany([
            {
                name: 'Small Scale',
            },
            {
                name: 'Mid Scale',
            },
            {
                name: 'Large Scale',
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=IndustryType.js.map