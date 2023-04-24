"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Bowser_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Bowser"));
class default_1 extends Seeder_1.default {
    async run() {
        await Bowser_1.default.create({
            name: '1B 5000L',
            fuel_capacity: 5000,
            registration_no: 'REGD12345678912',
            status: 'Available',
            parking_station_id: 1,
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=Bowser.js.map