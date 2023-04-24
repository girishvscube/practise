"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const upload_1 = global[Symbol.for('ioc.use')]("App/Helpers/upload");
const Customer_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Customer"));
const CustomerPoc_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CustomerPoc"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
class CustomerPocController {
    async dropdown({ response, params }) {
        try {
            let list = await CustomerPoc_1.default.dropdown(params.id);
            return response.json(list);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async getAllById({ params, response }) {
        try {
            const customerPocs = await CustomerPoc_1.default.listing(params.id);
            return response.json(customerPocs);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async show({ request, response }) {
        try {
            let customerPOC = request.customerpoc;
            return response.json(customerPOC);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { customerpoc } = ctx.request;
        return this.save(ctx, customerpoc);
    }
    async destroy({ request, response }) {
        try {
            let customerpoc = request.customerpoc;
            customerpoc.is_deleted = true;
            await customerpoc.save();
            return response.json({ message: 'customer POC Deleted Successfully!' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async save({ request, response }, record = null) {
        try {
            let data = request.only([
                'customer_id',
                'poc_name',
                'designation',
                'phone',
                'email',
                'image',
            ]);
            const rules = {
                customer_id: 'required|numeric',
                poc_name: 'required|max:150',
                designation: 'required|max:100',
                phone: 'required|max:10',
                email: 'required|email',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let imgSchema = Validator_1.schema.create({
                image_file: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg'],
                }),
            });
            let payload = await request.validate({ schema: imgSchema });
            if (payload.image_file) {
                data.image = await (0, upload_1.fileUploadToS3)(payload.image_file.extname, payload.image_file);
            }
            let customer = await Customer_1.default.query().where('id', data.customer_id).first();
            if (!customer) {
                return response.badRequest({ message: 'Customer not found!' });
            }
            let pocExists = await CustomerPoc_1.default.query()
                .where('email', data.email)
                .where('phone', data.phone)
                .where('customer_id', data.customer_id)
                .first();
            let customerpoc = record;
            if (record === null) {
                customerpoc = new CustomerPoc_1.default();
            }
            if (pocExists && pocExists.id !== customerpoc.id) {
                return response.badRequest({
                    message: 'Phone or email already exists',
                });
            }
            each(data, (value, key) => {
                customerpoc[key] = value;
            });
            await customerpoc.save();
            return response.json({
                message: `Ponit Of Contact ${record ? 'Updated' : 'Created'} Successfully`,
                customer_poc_id: customerpoc.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = CustomerPocController;
//# sourceMappingURL=CustomerPocController.js.map