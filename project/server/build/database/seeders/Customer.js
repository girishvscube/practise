"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Customer_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Customer"));
class default_1 extends Seeder_1.default {
    async run() {
        await Customer_1.default.create({
            company_name: 'SCUBE',
            phone: '7351656985',
            email: 'rockyshinde@scube.me',
            industry_type: 'Small Scale',
            equipment: 'Bowser 4KL',
            address: `Scubeelate Technologies Pvt.Ltd.
            Sy.No:66/2,67/1,Trifecta Adatto,13th Floor ITPL Main Road,
            Garudacharpalya,Mahadevapura Post`,
            city: 'Bengaluru',
            pincode: 560048,
            state: 'Karnataka',
            image: 'https://atd-admin.s3.amazonaws.com/1662976287932_.jpeg',
            sales_executive_id: 1,
            account_name: 'SCUBE-ICICI',
            account_number: '012345639874',
            bank_name: 'ICICI BANK, Bangalore',
            ifsc_code: 'ICIC0000002',
            cancelled_cheque: 'https://atd-admin.s3.amazonaws.com/1662976287932_.jpeg',
            gst_no: 'GTIN021333510252552',
            gst_certificate: 'https://atd-admin.s3.amazonaws.com/1662976287932_.jpeg',
            is_credit_availed: true,
            credit_limit: 1000000,
            credit_net_due_id: 1,
            credit_pan: 'https://atd-admin.s3.amazonaws.com/1662976287932_.jpeg',
            credit_aadhaar: 'https://atd-admin.s3.amazonaws.com/1662976287932_.jpeg',
            credit_bank_statement: 'https://atd-admin.s3.amazonaws.com/1662976287932_.jpeg',
            credit_blank_cheque: 'https://atd-admin.s3.amazonaws.com/1662976287932_.jpeg',
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=Customer.js.map