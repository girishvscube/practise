"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BankAccount_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/BankAccount"));
const CashInHand_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CashInHand"));
const PayOut_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PayOut"));
const PayOutInvoice_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PayOutInvoice"));
const PurchaseOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PurchaseOrder"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class PayOutsController {
    async getInvoiceBySupplierId({ request, response }) {
        try {
            let id = request.params().id;
            let data = await PurchaseOrder_1.default.query()
                .where('supplier_id', id)
                .where('status', 'PURCHASE_DONE')
                .whereNot('payment_status', 'Paid')
                .select('id', 'purchase_date', 'payment_status', 'total_amount', 'balance');
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let data = await PayOut_1.default.listing(request.qs());
            return response.send(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let id = request.params().id;
            let data = await PayOut_1.default.query().preload('supplier').where('id', id).first();
            let invoices = await PayOutInvoice_1.default.query()
                .preload('purchaseorder')
                .where('pay_out_id', id);
            return response.json({ data: data, invoices: invoices });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        try {
            await this.save(ctx);
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        try {
            let payout = ctx.request.payout;
            await this.save(ctx, payout);
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.message });
        }
    }
    async save({ request, auth, response }, record = null) {
        try {
            let data = request.only([
                'supplier_id',
                'bank_account_id',
                'payout_date',
                'notes',
                'invoices',
            ]);
            let rules = {
                supplier_id: 'required|numeric',
                bank_account_id: 'required',
                payout_date: 'required|date',
            };
            if (record === null) {
                rules['invoices'] = 'required|array';
                rules['invoices.*.id'] = 'required|numeric';
                rules['invoices.*.amount'] = 'required|numeric';
            }
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let total_amt = 0;
            let bank_acc = await BankAccount_1.default.findOrFail(data.bank_account_id);
            if (record === null && data.invoices) {
                total_amt = data.invoices.reduce((sum, obj) => sum + obj.amount, 0);
                for (let index = 0; index < data.invoices.length; index++) {
                    const el = data.invoices[index];
                    let po = await PurchaseOrder_1.default.query().where('id', el.id).first();
                    if (po === null) {
                        return response.badRequest({
                            message: `PurchaseOrder: ${el.id} Not Found!`,
                        });
                    }
                    else {
                        if (Math.abs(Number(po.balance)) < Math.abs(Number(el.amount))) {
                            return response.badRequest({
                                message: `${el.amount} exceeds balance ${po.balance}`,
                            });
                        }
                        else {
                            po.balance -= el.amount;
                            if (po.balance < 0.9) {
                                po.balance = 0;
                            }
                            po.payment_status = po.balance === 0 ? 'PAID' : 'PARTIALLY_PAID';
                            await po.log(auth.user, {
                                message: `Amount: <strong>${el.amount}</strong> was <strong>${po.payment_status}</strong> for Purchase Order: <strong>${po.id}</strong>`,
                                type: 'ACTION',
                            });
                        }
                    }
                    await po.save();
                }
            }
            let payout = record;
            if (record === null) {
                payout = new PayOut_1.default();
                payout.amount = total_amt;
                payout.no_of_invoices = data.invoices.length;
            }
            each(data, (value, key) => {
                payout[key] = value;
            });
            payout = await payout.save();
            if (bank_acc.account_type === 'Cash In Hand') {
                let cash_in_hands = new CashInHand_1.default();
                cash_in_hands.type = 'Pay Out';
                cash_in_hands.pay_out_id = payout.id;
                cash_in_hands.supplier_id = payout.supplier_id;
                cash_in_hands.adjustment_date = payout.pay_in_date;
                cash_in_hands.amount = payout.amount;
                await cash_in_hands.save();
                await cash_in_hands.log(auth.user, {
                    message: `Pay out:<strong>${payout.id}</strong> with amount <strong>${payout.amount}</strong>`,
                });
            }
            let payout_invoices = [];
            if (record === null && data.invoices) {
                for (let index = 0; index < data.invoices.length; index++) {
                    const el = data.invoices[index];
                    let payoutinvoice = await PayOutInvoice_1.default.query()
                        .where('purchase_order_id', el.id)
                        .where('pay_out_id', payout.id)
                        .first();
                    if (payoutinvoice === null) {
                        payoutinvoice = new PayOutInvoice_1.default();
                    }
                    payoutinvoice.pay_out_id = payout.id;
                    payoutinvoice.purchase_order_id = el.id;
                    payoutinvoice.amount = el.amount;
                    payoutinvoice = await payoutinvoice.save();
                    payout_invoices.push(payoutinvoice.id);
                }
            }
            return response.json({
                message: `Pay Out ${record === null ? 'Added' : 'Updated'} Successfully`,
                payout_id: payout.id,
                payout_invoices: payout_invoices,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = PayOutsController;
//# sourceMappingURL=PayOutsController.js.map