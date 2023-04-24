"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Equipment_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Equipment"));
class default_1 extends Seeder_1.default {
    async run() {
        await Equipment_1.default.createMany([
            {
                name: 'Bowser 4KL',
            },
            {
                name: 'Bowser 6KL',
            },
            {
                name: 'Bowser 8KL',
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=Equipment.js.map