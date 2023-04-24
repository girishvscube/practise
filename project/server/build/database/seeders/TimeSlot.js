"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const TimeSlot_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TimeSlot"));
class default_1 extends Seeder_1.default {
    async run() {
        TimeSlot_1.default.createMany([
            {
                start: '6:00',
                end: '12:00',
            },
            {
                start: '12:00',
                end: '18:00',
            },
            {
                start: '18:00',
                end: '23:59',
            },
            {
                start: '1:00',
                end: '6:00',
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=TimeSlot.js.map