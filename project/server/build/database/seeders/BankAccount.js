"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const BankAccount_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/BankAccount"));
const luxon_1 = require("luxon");
class default_1 extends Seeder_1.default {
    async run() {
        BankAccount_1.default.createMany([
            {
                account_name: 'ATD CASH IN HAND',
                account_type: 'Cash In Hand',
                account_number: '000000000000',
                as_of_date: luxon_1.DateTime.now(),
                bank_name: 'ATD CASH IN HAND',
                ifsc_code: 'ACIH000000',
                opening_balance: 0,
                print_ac_number: false,
                is_active: false,
            },
            {
                account_name: 'ATD ICICI',
                account_type: 'Current',
                account_number: '012345678912',
                as_of_date: luxon_1.DateTime.now(),
                bank_name: 'ICICI',
                ifsc_code: 'ICIC123456',
                opening_balance: 1234567,
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=BankAccount.js.map