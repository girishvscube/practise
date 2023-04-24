"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Supplier_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Supplier"));
class default_1 extends Seeder_1.default {
    async run() {
        await Supplier_1.default.createMany([
            {
                account_name: 'Laksken Industrial Diesel ICICI',
                account_number: '012354698752',
                address: 'Test',
                bank_name: 'ICICI',
                city: 'Test',
                email: 'test@gmail.com',
                gst: 'GSTIN123456789',
                ifsc_code: 'ICIC012345',
                name: 'Test',
                phone: '9563021545',
                pincode: 424505,
                state: 'Karnataka',
                type: 'Distributor',
            },
            {
                account_name: 'Sri Durga Ms HDFC',
                account_number: '0100000698752',
                address: 'Test',
                bank_name: 'HDFC',
                city: 'Test',
                email: 'test1@gmail.com',
                gst: 'GSTIN123456789',
                ifsc_code: 'HDFC012345',
                name: 'Test',
                phone: '9563021541',
                pincode: 424505,
                state: 'Karnataka',
                type: 'Distributor',
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=Supplier.js.map