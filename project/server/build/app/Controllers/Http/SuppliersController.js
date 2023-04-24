"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supplier_constants_1 = global[Symbol.for('ioc.use')]("App/Helpers/supplier.constants");
const PurchaseOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PurchaseOrder"));
const Supplier_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Supplier"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const upload_1 = global[Symbol.for('ioc.use')]("App/Helpers/upload");
class SuppliersController {
    async dropdown({ response }) {
        try {
            let data = await Supplier_1.default.dropdown();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async count({ response }) {
        try {
            let data = await Supplier_1.default.count();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async poStats({ request, response }) {
        try {
            let data = await Supplier_1.default.viewPOCount(request.params().id, request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async type({ response }) {
        return response.json(supplier_constants_1.SUPPLIER_TYPE);
    }
    async index(ctx) {
        try {
            return await Supplier_1.default.listing(ctx.request.qs());
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async show({ request, response }) {
        try {
            let supplier = await Supplier_1.default.query().where('id', request.param('id')).first();
            if (!supplier) {
                return response.notFound({ message: `Supplier Not Found` });
            }
            supplier.logs = await supplier.getLogs();
            return response.json(supplier);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { supplier } = ctx.request;
        return this.save(ctx, supplier);
    }
    async getPOListById({ request, response }) {
        try {
            let data = await PurchaseOrder_1.default.getListBySupplierId(request.params().id, request.qs());
            return response.send(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async save({ request, response }, record = null) {
        try {
            const data = request.only([
                'name',
                'phone',
                'email',
                'type',
                'address',
                'city',
                'location',
                'pincode',
                'state',
                'account_number',
                'account_name',
                'bank_name',
                'ifsc_code',
                'cancelled_cheque',
                'gst',
                'gst_certificate',
                'image',
            ]);
            const rules = {
                name: 'required|max:100',
                phone: 'required|max:10',
                email: 'required|email',
                type: 'required|max:100',
                address: 'required',
                city: 'required',
                location: 'required',
                pincode: 'required|min:6|max:6|string',
                state: 'required',
                account_number: 'required',
                account_name: 'required',
                bank_name: 'required',
                ifsc_code: 'required',
                gst: 'required',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            const uploadSchema = Validator_1.schema.create({
                cancelled_cheque_file: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpg', 'jpeg', 'png', 'jfif', 'pdf'],
                }),
                gst_certificate_file: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpg', 'jpeg', 'png', 'jfif', 'pdf'],
                }),
                image_file: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpg', 'jpeg', 'png', 'jfif'],
                }),
            });
            const payload = await request.validate({ schema: uploadSchema });
            if (payload.cancelled_cheque_file) {
                const fileName = `${(0, Helpers_1.cuid)()}.${payload.cancelled_cheque_file.extname}`;
                await payload.cancelled_cheque_file.move(Application_1.default.tmpPath('uploads'), {
                    name: fileName,
                });
                data['cancelled_cheque'] = await (0, upload_1.toS3)(Application_1.default.tmpPath('uploads') + '/' + fileName);
            }
            if (payload.gst_certificate_file) {
                const fileName = `${(0, Helpers_1.cuid)()}.${payload.gst_certificate_file.extname}`;
                await payload.gst_certificate_file.move(Application_1.default.tmpPath('uploads'), {
                    name: fileName,
                });
                data['gst_certificate'] = await (0, upload_1.toS3)(Application_1.default.tmpPath('uploads') + '/' + fileName);
            }
            if (payload.image_file) {
                const fileName = `${(0, Helpers_1.cuid)()}.${payload.image_file.extname}`;
                await payload.image_file.move(Application_1.default.tmpPath('uploads'), {
                    name: fileName,
                });
                data['image'] = await (0, upload_1.toS3)(Application_1.default.tmpPath('uploads') + '/' + fileName);
            }
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            if (!record && (!data.gst_certificate || !data.cancelled_cheque)) {
                return response.badRequest({ message: 'Please upload gst and bank check image' });
            }
            let supplier = record;
            const existingUserByEmail = await Supplier_1.default.query().where('email', data.email).first();
            if (record === null) {
                supplier = new Supplier_1.default();
            }
            if (existingUserByEmail && existingUserByEmail.id !== supplier.id) {
                if (existingUserByEmail.email.toLowerCase() === data.email.toLowerCase()) {
                    return response.badRequest({
                        message: 'Supplier already exists for given email address.',
                    });
                }
            }
            each(data, (value, key) => {
                supplier[key] = value;
            });
            supplier = await supplier.save();
            response.json({
                message: `Supplier ${record ? 'Updated' : 'Created'} Successfully`,
                id: supplier.id,
            });
        }
        catch (exception) {
            console.log(exception);
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = SuppliersController;
//# sourceMappingURL=SuppliersController.js.map