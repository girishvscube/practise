"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const CustomerDeliveryDetail_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CustomerDeliveryDetail"));
class default_1 extends Seeder_1.default {
    async run() {
        await CustomerDeliveryDetail_1.default.create({
            customer_id: 1,
            address_1: 'Test',
            address_2: 'Test',
            pincode: 560001,
            address_type: 'work',
            city: 'Bangalore',
            state: 'Karnataka',
            phone: '7351023654',
            landmark: '',
            location: '',
            location_name: 'Test',
            customer_poc_id: 1,
            is_fuel_price_checked: false,
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=CustomerDeliveryDetail.js.map