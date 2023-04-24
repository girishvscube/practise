"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cashInHand_constants_1 = global[Symbol.for('ioc.use')]("App/Helpers/cashInHand.constants");
const CashInHand_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CashInHand"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class CashInHandsController {
    async dropdown({ response }) {
        return response.json(cashInHand_constants_1.ADJUSTMENT_TYPE);
    }
    async count({ request, response }) {
        try {
            let data = await CashInHand_1.default.count(request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let data = await CashInHand_1.default.listing(request.qs());
            return response.send(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let cashinhand = await CashInHand_1.default.query()
                .preload('customer', (q) => q.select('*'))
                .preload('expense', (q) => q.select('*'))
                .preload('supplier', (q) => q.select('*'))
                .where('id', request.params().id)
                .first();
            cashinhand.logs = await cashinhand.getLogs();
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async update(ctx) {
        let cashinhand = ctx.request.cashinhand;
        return await this.save(ctx, cashinhand);
    }
    async save({ request, auth, response }, record = null) {
        try {
            let data = request.only(['type', 'amount', 'adjustment_date']);
            let rules = {
                type: 'required',
                amount: 'required|numeric',
                adjustment_date: 'required|date',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let cashInHand = record;
            if (cashInHand === null) {
                cashInHand = new CashInHand_1.default();
            }
            each(data, (value, key) => {
                cashInHand[key] = value;
            });
            if (data.type === 'Cash Decrease' || data.type === 'Pay Out') {
                cashInHand.amount = -data.amount;
            }
            cashInHand = await cashInHand.save();
            cashInHand.log(auth.user, {
                message: `Amount: <strong>${data.amount}</strong> </spam>${data.type}</spam> was ${record === null ? 'Added' : 'Updated'}`,
                type: 'INFO',
            });
            return response.json({
                message: `${data.type} ${record === null ? 'Added' : 'Updated'}`,
                id: cashInHand.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = CashInHandsController;
//# sourceMappingURL=CashInHandsController.js.map