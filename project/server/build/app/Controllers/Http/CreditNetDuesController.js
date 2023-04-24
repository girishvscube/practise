"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CreditNetDue_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CreditNetDue"));
class CreditNetDuesController {
    async dropdown({ response }) {
        try {
            let list = await CreditNetDue_1.default.dropdown();
            return response.json(list);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = CreditNetDuesController;
//# sourceMappingURL=CreditNetDuesController.js.map