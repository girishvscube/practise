"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_1 = global[Symbol.for('ioc.use')]("App/Helpers/upload");
const SupplierPoc_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SupplierPoc"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class SupplierPocsController {
    async index(ctx) {
        try {
            return await SupplierPoc_1.default.listing(ctx.request.qs());
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.message });
        }
    }
    async show(ctx) {
        try {
            return await SupplierPoc_1.default.query().select('*').where('id', ctx.request.params().id);
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async getBySupplierId(ctx) {
        let data = await SupplierPoc_1.default.query()
            .preload('supplier', (q) => q.select('*'))
            .select('*')
            .where('supplier_id', ctx.request.params().id);
        return ctx.response.json(data);
    }
    async destroy(ctx) {
        try {
            const supplierpoc = ctx.request.supplierpoc;
            await supplierpoc.delete();
            return ctx.response.json({ message: 'Supplier contact deleted successfully' });
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { supplierpoc } = ctx.request;
        return this.save(ctx, supplierpoc);
    }
    async save({ request, response }, record = null) {
        try {
            const data = request.only([
                'supplier_id',
                'poc_name',
                'designation',
                'contact',
                'email',
                'image',
            ]);
            const rules = {
                supplier_id: 'required|numeric',
                poc_name: 'required|max:100',
                designation: 'required|max:50',
                contact: 'required|min:10|max:10',
                email: 'required|email',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let imgSchema = Validator_1.schema.create({
                image_file: Validator_1.schema.file.optional({
                    size: '10mb',
                    extnames: ['jpeg', 'jpg', 'jfif'],
                }),
            });
            let payload = await request.validate({ schema: imgSchema });
            if (payload.image_file) {
                data.image = await (0, upload_1.fileUploadToS3)(payload.image_file.extname, payload.image_file);
            }
            let supplierPoc = record;
            if (record === null) {
                supplierPoc = new SupplierPoc_1.default();
            }
            each(data, (value, key) => {
                supplierPoc[key] = value;
            });
            await supplierPoc.save();
            response.json({
                message: `Supplier POC ${record ? 'Updated' : 'Created'} Successfully`,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = SupplierPocsController;
//# sourceMappingURL=SupplierPocsController.js.map