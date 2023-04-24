"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DeliveryCharge_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/DeliveryCharge"));
const SellingPerLitre_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SellingPerLitre"));
const Supplier_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Supplier"));
const SupplierPerLitreLog_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SupplierPerLitreLog"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const ValueChargesLog_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/ValueChargesLog"));
class ValueAndChargesController {
    async purhasePriceList({ request, response }) {
        try {
            let data = await Supplier_1.default.priceListing(request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async currrentSellPriceList({ response }) {
        try {
            let data = await SellingPerLitre_1.default.query()
                .where('is_active', true)
                .first()
                .then((serialize) => serialize?.toJSON());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async sellPriceList({ request, response }) {
        try {
            let data = await SellingPerLitre_1.default.listing(request.qs());
            return response.send(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async updateSellingPrice({ request, response, auth }) {
        try {
            let data = request.only(['price']);
            let rules = {
                price: 'required|numeric',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let selling_per_litre = await SellingPerLitre_1.default.query().where('is_active', 1).first();
            if (selling_per_litre) {
                selling_per_litre.is_active = false;
                await selling_per_litre.save();
            }
            await SellingPerLitre_1.default.create({
                price: data.price,
            });
            await ValueChargesLog_1.default.create({
                user_id: auth.user.id,
                type: 'ACTION',
                message: `Update Selling Price to ${data.price}.`,
            });
            return response.json({ message: `Price updated to Rs. ${data.price}` });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async updatePriceBySupplierId({ request, response, auth }) {
        try {
            let supplier = request.supplier;
            let data = request.only(['per_litre_price']);
            let rules = {
                per_litre_price: 'required|numeric',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            supplier.per_litre_price = data.per_litre_price;
            await supplier.save();
            let supplier_per_litre_log = new SupplierPerLitreLog_1.default();
            supplier_per_litre_log.supplier_id = supplier.id;
            supplier_per_litre_log.per_litre_price = data.per_litre_price;
            await supplier_per_litre_log.save();
            await ValueChargesLog_1.default.create({
                user_id: auth.user.id,
                type: 'ACTION',
                message: `Update Litre Price of ${supplier.name} to ${data.per_litre_price}.`,
            });
            return response.json({ message: `Price updated to Rs. ${supplier.per_litre_price}` });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async deliveryChargesList({ response }) {
        try {
            let data = await DeliveryCharge_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async saveDeliveryCharges({ request, response, auth }) {
        try {
            let data = request.only(['type', 'charges']);
            let rules = {
                type: 'required',
                charges: 'required|numeric',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let delivery_charge = new DeliveryCharge_1.default();
            delivery_charge.type = data.type;
            delivery_charge.charges = data.charges;
            await delivery_charge.save();
            await ValueChargesLog_1.default.create({
                user_id: auth.user.id,
                type: 'ACTION',
                message: `Add Delivery Charges with type:${data.type}  and Rs.${data.charges}`,
            });
            return response.json({ message: 'New Delivery Charges Created' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async updateDeliveryCharges({ request, response, auth }) {
        try {
            let delivery_charge = request.deliverycharge;
            let data = request.only(['charges']);
            let rules = {
                charges: 'required|numeric',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            delivery_charge.charges = data.charges;
            await delivery_charge.save();
            await ValueChargesLog_1.default.create({
                user_id: auth.user.id,
                type: 'ACTION',
                message: `Update Delivery Charges of  ${delivery_charge.type} to  Rs.S${data.charges}`,
            });
            return response.json({ message: 'Delivery Charges Updated' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async logs({ request, response }) {
        try {
            let list = await ValueChargesLog_1.default.listing(request);
            return response.send(list);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = ValueAndChargesController;
//# sourceMappingURL=ValueAndChargesController.js.map