"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const ParkingStation_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ParkingStation"));
class default_1 extends Seeder_1.default {
    async run() {
        await ParkingStation_1.default.createMany([
            {
                station_name: 'Section 57 Station 1',
                capacity: 5,
                address: 'test',
                city: 'Bangalore',
                pincode: 560062,
                state: 'Karnataka',
            },
            {
                station_name: 'Section 57 Station 2',
                capacity: 5,
                address: 'test',
                city: 'Bangalore',
                pincode: 560062,
                state: 'Karnataka',
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=ParkingStation.js.map