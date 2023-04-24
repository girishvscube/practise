"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Role_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Role"));
class default_1 extends Seeder_1.default {
    async run() {
        await Role_1.default.createMany([
            {
                name: 'Admin',
                slug: 'admin',
            },
            {
                name: 'Manager',
                slug: 'manager',
            },
            {
                name: 'Sales Manager',
                slug: 'sales_manager',
            },
            {
                name: 'Sales Executive',
                slug: 'sales_executive',
            },
            {
                name: 'Driver',
                slug: 'driver',
            },
            {
                name: 'Support Manager',
                slug: 'support_manager',
            },
            {
                name: 'Support Executive',
                slug: 'support_executive',
            },
            {
                name: 'Accounting Manager',
                slug: 'accounting_manager',
            },
            {
                name: 'Fleet Manager',
                slug: 'fleet_manager',
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=Role.js.map