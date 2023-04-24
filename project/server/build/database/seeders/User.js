"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
class default_1 extends Seeder_1.default {
    async run() {
        await User_1.default.createMany([
            {
                name: 'SCUBE Admin-1',
                email: 'venkatesh@scube.me',
                phone: '9874563214',
                address: `Scubeelate Technologies Pvt.Ltd.
Sy.No:66/2,67/1,Trifecta Adatto,13th Floor ITPL Main Road,
Garudacharpalya,Mahadevapura Post,
Bengaluru,Karnataka - 560048`,
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560048',
                password: 'admin123',
                role_id: 1,
            },
            {
                name: 'Rocky',
                email: 'rockyshinde@scube.me',
                phone: '7352159807',
                address: `Scubeelate Technologies Pvt.Ltd.
Sy.No:66/2,67/1,Trifecta Adatto,13th Floor ITPL Main Road,
Garudacharpalya,Mahadevapura Post,
Bengaluru,Karnataka - 560048`,
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560048',
                password: 'Admin123',
                role_id: 1,
            },
            {
                name: 'Sanket',
                email: 'sanket@scube.me',
                phone: '7052109807',
                address: `Scubeelate Technologies Pvt.Ltd.
Sy.No:66/2,67/1,Trifecta Adatto,13th Floor ITPL Main Road,
Garudacharpalya,Mahadevapura Post,
Bengaluru,Karnataka - 560048`,
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560048',
                password: 'admin123',
                role_id: 1,
            },
            {
                name: 'Pravesh',
                email: 'pravesh@scube.me',
                phone: '7000109807',
                address: `Scubeelate Technologies Pvt.Ltd.
Sy.No:66/2,67/1,Trifecta Adatto,13th Floor ITPL Main Road,
Garudacharpalya,Mahadevapura Post,
Bengaluru,Karnataka - 560048`,
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560048',
                password: 'admin123',
                role_id: 1,
            },
            {
                name: 'Girish',
                email: 'girish@scube.me',
                phone: '7000109807',
                address: `Scubeelate Technologies Pvt.Ltd.
Sy.No:66/2,67/1,Trifecta Adatto,13th Floor ITPL Main Road,
Garudacharpalya,Mahadevapura Post,
Bengaluru,Karnataka - 560048`,
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560048',
                password: 'admin123',
                role_id: 1,
            },
        ]);
    }
}
exports.default = default_1;
//# sourceMappingURL=User.js.map