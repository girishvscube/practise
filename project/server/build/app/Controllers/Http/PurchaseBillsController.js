"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PurchaseOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PurchaseOrder"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const pdf = require('html-pdf');
const View_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/View"));
const fs_1 = require("fs");
var fs = require('fs');
const path_1 = __importDefault(require("path"));
const OrdersController_1 = require("./OrdersController");
const moment_1 = __importDefault(require("moment"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const utils_1 = global[Symbol.for('ioc.use')]("App/Helpers/utils");
const SupplierPoc_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SupplierPoc"));
class PurchaseBillsController {
    async count({ request, response }) {
        try {
            let data = await PurchaseOrder_1.default.purchaseBillStats(request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let data = await PurchaseOrder_1.default.purchaseBillList(request.qs());
            return response.send(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async downloadPurchaseBill({ request, response }) {
        try {
            let id = request.params().id;
            let data = await PurchaseOrder_1.default.query()
                .preload('bowser', (bowser) => {
                bowser.select('*');
            })
                .preload('supplier', (supplier) => {
                supplier.select('*');
            })
                .where('id', id)
                .select('*')
                .first();
            let filePath = await this.generateInvoice(data);
            let base64String = '';
            if (fs.statSync(filePath).isFile()) {
                base64String = await (0, OrdersController_1.base64ToNode)((0, fs_1.readFileSync)(path_1.default.resolve(filePath)).toString('base64'));
            }
            if ((0, fs_1.existsSync)(filePath))
                (0, fs_1.unlinkSync)(filePath);
            return response.json({ base64String: base64String });
        }
        catch (exception) {
            response.internalServerError({ message: exception.message });
        }
    }
    async sendPurchaseBill({ request, response }) {
        try {
            let id = request.params().id;
            let data = request.only(['to', 'cc', 'subject', 'message']);
            let record = await PurchaseOrder_1.default.query()
                .preload('bowser', (bowser) => {
                bowser.select('*');
            })
                .preload('supplier', (supplier) => {
                supplier.select('*');
            })
                .where('id', id)
                .select('*')
                .first();
            data.cc = data.cc.replace(' ', '');
            let filePath = await this.generateInvoice(record);
            if (fs.statSync(filePath).isFile()) {
                await Event_1.default.emit('send-po-customer', { record: data, pdf: filePath });
            }
            return response.json({ message: 'Purchase Bill sent successfully' });
        }
        catch (exception) {
            response.internalServerError({ message: exception.message });
        }
    }
    async mailList({ request, response }) {
        let id = request.params().id;
        let po = await PurchaseOrder_1.default.query()
            .preload('supplier', (q) => q.select('email'))
            .where('id', id)
            .select('id', 'supplier_id')
            .first();
        let supplier_poc = await SupplierPoc_1.default.query()
            .where('supplier_id', id)
            .select('supplier_id', 'email');
        return response.json({ primary_email: po.supplier.email, poc_email: supplier_poc });
    }
    generateInvoice(po) {
        return new Promise(async (reslove, reject) => {
            const options = {
                format: 'A4',
                orientation: 'portrait',
                footer: {
                    height: '8mm',
                    contents: `<div class="footer">
                    <p   style="padding-top:5px;text-align: center;border-top: 1px solid #ccc;">For Support and Queries Please call:<b>0425-454525</b> or Email:<b>info@anytimediesel.com</b></p>
                    </div>`,
                },
            };
            po.created_at = (0, moment_1.default)(new Date(po.createdAt)).format('DD-MM-YYYY');
            po.purchase_date = (0, moment_1.default)(new Date(po.purchase_date)).format('DD-MM-YYYY');
            let inWords = (0, utils_1.NumInWords)(Number(po.total_amount));
            let filePath = Application_1.default.tmpPath('uploads') + '/' + po.id + '.pdf';
            let html = await View_1.default.render('purchase_bill', {
                data: po,
                inWords,
            });
            await pdf.create(html, options).toFile(filePath, (err, _buffer) => {
                if (err) {
                    reject(err.message);
                }
                reslove(filePath);
            });
        });
    }
}
exports.default = PurchaseBillsController;
//# sourceMappingURL=PurchaseBillsController.js.map