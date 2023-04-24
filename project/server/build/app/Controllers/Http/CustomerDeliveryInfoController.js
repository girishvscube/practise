"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Customer_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Customer"));
const CustomerDeliveryDetail_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CustomerDeliveryDetail"));
const CustomerPoc_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CustomerPoc"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
class CustomerDeliveryInfoController {
    async dropdown({ response, params }) {
        try {
            let list = await CustomerDeliveryDetail_1.default.dropdown(params.id);
            return response.json(list);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async getAllById({ params, response }) {
        try {
            const customerDeliveryDetails = await CustomerDeliveryDetail_1.default.listing(params.id);
            return response.json(customerDeliveryDetails);
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
            const { customerdeliverydetail } = request;
            return response.json(customerdeliverydetail);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { customerdeliverydetail } = ctx.request;
        return this.save(ctx, customerdeliverydetail);
    }
    async destroy({ request, response }) {
        try {
            let customerdeliverydetail = request.customerdeliverydetail;
            customerdeliverydetail.is_deleted = true;
            await customerdeliverydetail.save();
            return response.json({ message: 'customer Delivery Location Deleted Successfully!' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async save({ request, response }, record = null) {
        try {
            let data = request.only([
                'customer_id',
                'address_1',
                'address_2',
                'pincode',
                'address_type',
                'city',
                'state',
                'phone',
                'landmark',
                'location',
                'location_name',
                'customer_poc_id',
                'is_fuel_price_checked',
                'fuel_price',
            ]);
            const rules = {
                location_name: 'required',
                customer_id: 'required|numeric',
                address_1: 'required|max:150',
                pincode: 'required|numeric|min:100000|max:999999',
                address_type: 'required|max:100',
                city: 'required|max:50',
                state: 'required|max:100',
                phone: 'required|max:10',
                customer_poc_id: 'required|numeric',
                is_fuel_price_checked: 'required|boolean',
            };
            if (data.is_fuel_price_checked) {
                rules['fuel_price'] = 'required|numeric';
            }
            else {
                data.fuel_price = 0;
            }
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let customer = await Customer_1.default.find(data.customer_id);
            if (customer === null) {
                return response.badRequest({ message: 'Customer not found!' });
            }
            let customerPoc = await CustomerPoc_1.default.query()
                .where('id', data.customer_poc_id)
                .andWhere('customer_id', data.customer_id)
                .first();
            if (customerPoc === null) {
                return response.badRequest({ message: 'Customer POC not present' });
            }
            let exists = await CustomerDeliveryDetail_1.default.query()
                .where('address_1', data.address_1)
                .where('customer_id', data.customer_id)
                .first();
            let customerDeiveryLocation = record;
            if (record === null) {
                customerDeiveryLocation = new CustomerDeliveryDetail_1.default();
            }
            if (exists && exists.id !== customerDeiveryLocation.id) {
                return response.badRequest({
                    message: 'Delivery address  already exists',
                });
            }
            each(data, (value, key) => {
                customerDeiveryLocation[key] = value;
            });
            await customerDeiveryLocation.save();
            return response.json({
                message: `Delivery Location ${record ? 'Updated' : 'Created'} Successfully`,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = CustomerDeliveryInfoController;
//# sourceMappingURL=CustomerDeliveryInfoController.js.map