"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64ToNode = void 0;
const order_constants_1 = global[Symbol.for('ioc.use')]("App/Helpers/order.constants");
const Order_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Order"));
const luxon_1 = require("luxon");
const moment_1 = __importDefault(require("moment"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const OrderPoc_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/OrderPoc"));
const Customer_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Customer"));
const DeliveryCharge_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/DeliveryCharge"));
const CustomerDeliveryDetail_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/CustomerDeliveryDetail"));
const { each } = require('lodash');
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
const pdf = require('html-pdf');
const View_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/View"));
const fs_1 = require("fs");
var fs = require('fs');
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
const path_1 = __importDefault(require("path"));
const utils_1 = global[Symbol.for('ioc.use')]("App/Helpers/utils");
const PaymentTerm_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PaymentTerm"));
const PurchaseSalesOrder_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/PurchaseSalesOrder"));
const Trip_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Trip"));
const SellingPerLitre_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SellingPerLitre"));
const OrderTracking_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/OrderTracking"));
class OrdersController {
    async orderType({ response }) {
        return response.json(order_constants_1.ORDER_TYPE);
    }
    async orderStatus({ response }) {
        return response.json(order_constants_1.ORDER_STATUS);
    }
    async count({ request, response }) {
        try {
            let data = await Order_1.default.count(request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let qs = request.qs();
            let orders = await Order_1.default.listing(qs);
            return response.send(orders);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async invoiceList({ request, response }) {
        try {
            let qs = request.qs();
            let orders = await Order_1.default.invoiceList(qs);
            return response.send(orders);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async invoiceStats({ request, response }) {
        try {
            let count = await Order_1.default.invoiceStats(request.qs());
            return response.json(count);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ params, response }) {
        try {
            let id = params.id;
            let data = await Order_1.default.query()
                .preload('customer', (q) => q
                .preload('credit_net_due', (q) => q.select('*'))
                .preload('sales_executive', (q) => q.select('name'))
                .select('*'))
                .preload('user', (q) => q.select('name'))
                .where('id', id)
                .first();
            if (!data) {
                return response.badRequest({ messge: 'Invalid Order ID' });
            }
            data.logs = await data.getLogs();
            return response.json({ order: data, order_payment: '' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async updatePrice({ auth, request, response }) {
        try {
            let data = request.only([
                'payment_type',
                'additional_notes',
                'per_litre_cost',
                'discount_type',
                'discount',
            ]);
            let rules = {
                payment_type: 'required',
                additional_notes: 'string|max:500',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let order = request.order;
            order.delivery_charges = 0;
            if (order.order_type === 'Same Day Delivery') {
                let dc = await DeliveryCharge_1.default.query().where('type', 'Express Delivery').first();
                order.delivery_charges = Number(dc.charges);
            }
            let discount = 0;
            if (data.discount) {
                if (data.discount_type == 'Percentage') {
                    discount = (order.total_amount * Number(data.discount)) / 100;
                }
                else {
                    discount = parseFloat(data.discount);
                }
            }
            let sub_total = Number(order.fuel_qty) * Number(data.per_litre_cost);
            order.discount = discount;
            order.discount_type = data.discount_type;
            order.total_amount = sub_total;
            order.grand_total = order.delivery_charges + sub_total - discount;
            order.balance = order.grand_total;
            order.payment_status = 'UN_PAID';
            order.payment_type = data.payment_type;
            order.per_litre_cost = Number(data.per_litre_cost);
            let pt = await PaymentTerm_1.default.findByOrFail('name', order.payment_type);
            order.payment_rules = pt.rules;
            if (data.additional_notes) {
                order.additional_notes = data.additional_notes;
            }
            let customer = data.customer_id
                ? await Customer_1.default.findOrFail(data.customer_id)
                : false;
            if (customer && customer.is_credit_availed) {
                let total_amt = order.grand_total;
                let doesCLExceed = await this.doesCreditLimitExceeds(customer, total_amt);
                if (doesCLExceed) {
                    return response.badRequest({ message: 'Credit limit exceeds' });
                }
            }
            if (customer && customer.is_credit_availed && order.payment_type === 'Credit') {
                return response.badRequest({ message: 'Customer has not availed Credit option' });
            }
            await order.load('customer', (query) => {
                query.select('id', 'company_name', 'phone', 'email', 'outstanding_amount', 'grace_period');
            });
            if (order.payment_type && order.payment_type.toUpperCase().trim() === 'PIA') {
                order.due_date = luxon_1.DateTime.now();
                order.last_date = order.due_date.plus({
                    days: order.customer.grace_period,
                });
            }
            order = await order.save();
            await order.log(auth.user, { message: `Updated the order`, type: 'ACTION' });
            await order.load('user', (query) => {
                query.select('id', 'name');
            });
            return response.json({
                message: `Order Updated Successfully`,
                order: await order.serialize(),
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async confirmOrder({ auth, request, response }) {
        try {
            let order = request.order;
            if (order.payment_type) {
                order.is_order_confirmed = true;
                order.status = 'ORDER_CONFIRMED';
                order = await order.save();
                let orderTracking = new OrderTracking_1.default();
                orderTracking.status = 'ORDER_CONFIRMED';
                orderTracking.order_id = order.id;
                orderTracking.order_updated_at = luxon_1.DateTime.now();
                await orderTracking.save();
                await order.log(auth.user, { message: `Order Confirmed`, type: 'ACTION' });
            }
            else {
                return response.badRequest({ message: `Incomplete order cannot be confirmed!` });
            }
            return response.json({
                message: `Order Confirmed`,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update({ auth, request, response }) {
        try {
            let data = request.only([
                'payment_type',
                'additional_notes',
                'per_litre_cost',
                'discount_type',
                'discount',
                'customer_delivery_id',
                'order_type',
                'delivery_date',
                'time_slot',
                'fuel_qty',
                'sales_executive_id',
                'per_litre_cost',
            ]);
            let rules = {
                payment_type: 'required',
                additional_notes: 'string|max:500',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let order = request.order;
            await order.load('customer');
            each(data, (value, key) => {
                order[key] = value;
            });
            let delivery_detail = await CustomerDeliveryDetail_1.default.query()
                .preload('poc')
                .where('id', data.customer_delivery_id)
                .first();
            if (delivery_detail) {
                order.customer_delivery_details = {
                    id: delivery_detail.id,
                    city: delivery_detail.city,
                    state: delivery_detail.state,
                    country: 'India',
                    pincode: delivery_detail.pincode,
                    address_1: delivery_detail.address_1,
                    address_2: delivery_detail.address_2,
                    address_type: delivery_detail.address_type,
                    landmark: delivery_detail.landmark,
                    phone: delivery_detail.phone,
                    location: delivery_detail.location,
                    location_name: delivery_detail.location_name,
                    poc_name: delivery_detail.poc.poc_name,
                    poc_phone: delivery_detail.poc.phone,
                    fuel_price: delivery_detail.fuel_price,
                };
            }
            order.delivery_charges = 0;
            if (order.order_type === 'Same Day Delivery') {
                let dc = await DeliveryCharge_1.default.query().where('type', 'Express Delivery').first();
                order.delivery_charges = Number(dc.charges);
            }
            let discount = 0;
            if (data.discount) {
                if (data.discount_type == 'Percentage') {
                    discount = (order.total_amount * Number(data.discount)) / 100;
                }
                else {
                    discount = parseFloat(data.discount);
                }
            }
            let sub_total = Number(order.fuel_qty) * Number(data.per_litre_cost);
            order.discount = discount;
            order.discount_type = data.discount_type;
            order.total_amount = sub_total;
            order.grand_total = order.delivery_charges + sub_total - discount;
            order.balance = order.grand_total;
            order.is_order_confirmed = true;
            order.status = 'ORDER_CONFIRMED';
            let orderTracking = await OrderTracking_1.default.query()
                .where('order_id', order.id)
                .andWhere('status', order.status)
                .first();
            if (orderTracking === null) {
                orderTracking = new OrderTracking_1.default();
                orderTracking.status = 'ORDER_CONFIRMED';
                orderTracking.order_id = order.id;
                orderTracking.order_updated_at = luxon_1.DateTime.now();
                await orderTracking.save();
            }
            order.payment_type = data.payment_type;
            let pt = await PaymentTerm_1.default.findByOrFail('name', order.payment_type);
            order.payment_rules = pt.rules;
            if (data.additional_notes) {
                order.additional_notes = data.additional_notes;
            }
            let customer = await Customer_1.default.findOrFail(order.customer_id);
            if (customer && customer.is_credit_availed) {
                let total_amt = order.grand_total;
                let doesCLExceed = await this.doesCreditLimitExceeds(customer, total_amt);
                if (doesCLExceed) {
                    return response.badRequest({ message: 'Credit limit exceeds' });
                }
            }
            if (order.payment_type.toUpperCase().trim() === 'PIA') {
                order.due_date = luxon_1.DateTime.now();
                order.last_date = order.due_date.plus({
                    days: order.customer.grace_period,
                });
            }
            order = await order.save();
            await order.log(auth.user, {
                message: `Updated and confirmed the Order`,
                type: 'ACTION',
            });
            return response.json({
                message: `Order Updated Successfully`,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async updateStatus({ auth, request, response }) {
        try {
            let record = request.order;
            let { status, additional_notes } = request.body();
            record.status = status;
            let orderTracking = await OrderTracking_1.default.query()
                .where('order_id', record.id)
                .andWhere('status', status)
                .first();
            if (orderTracking == null) {
                orderTracking = new OrderTracking_1.default();
                orderTracking.order_id = record.id;
                orderTracking.status = status;
                orderTracking.order_updated_at = luxon_1.DateTime.now();
                await orderTracking.save();
            }
            if (status === 'ORDER_CONFIRMED') {
                record.is_order_confirmed = true;
            }
            if (status === 'ORDER_CANCELLED') {
                record.is_order_cancelled = true;
            }
            if (additional_notes) {
                await record.log(auth.user, {
                    message: `<strong>${auth.user.name}</strong> added Note: <p>${additional_notes}<p>`,
                    type: 'NOTE',
                });
            }
            await record.log(auth.user, {
                message: `<strong>${auth.user.name}</strong> modified the status to <span>${status}</span>`,
                type: 'STATUS',
            });
            await record.save();
            return response.json({ message: `Status updated to ${status}` });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async getPocByOrderId({ request, response }) {
        try {
            let id = request.params().id;
            let data = await OrderPoc_1.default.getAllByOrderId(id);
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async addNewPoc({ request, response }) {
        try {
            let id = request.params().id;
            let data = request.only(['poc_ids']);
            let rules = {
                poc_ids: 'required|array',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let result = await OrderPoc_1.default.saveOrderPoc(id, data.poc_ids);
            if (result && result.status) {
                return response.badRequest({ message: result.message });
            }
            else {
                return response.json({ message: "POC's added successfully" });
            }
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async deletePOC({ request, response }) {
        try {
            let id = request.params().id;
            let order_poc = await OrderPoc_1.default.find(id);
            await order_poc?.delete();
            return response.json({ message: 'POC deleted successfully!' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async mailList({ request, response }) {
        let id = request.params().id;
        let order = await Order_1.default.query()
            .preload('customer', (q) => q.select('email'))
            .where('id', id)
            .select('id', 'customer_id')
            .first();
        let order_poc = await OrderPoc_1.default.query()
            .preload('customer_poc', (q) => q.select('email'))
            .where('order_id', id)
            .select('order_id', 'customer_poc_id');
        return response.json({ primary_email: order.customer.email, poc_email: order_poc });
    }
    async save({ request, response }, record = null) {
        try {
            let data = request.only([
                'customer_id',
                'customer_delivery_id',
                'order_type',
                'delivery_date',
                'time_slot',
                'fuel_qty',
                'sales_executive_id',
                'per_litre_cost',
                'poc_ids',
            ]);
            let rules = {
                customer_id: 'required|numeric',
                customer_delivery_id: 'required|numeric',
                order_type: 'required',
                delivery_date: 'required|date',
                time_slot: 'required|string',
                fuel_qty: 'required|numeric',
                sales_executive_id: 'required|numeric',
                per_litre_cost: 'required|numeric',
                poc_ids: 'required|array',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let dd = (0, moment_1.default)(data.delivery_date);
            let now = (0, moment_1.default)(luxon_1.DateTime.now());
            let diff = dd.diff(now, 'days');
            if (diff < 0) {
                return response.badRequest({ message: 'Please select valid delivery date' });
            }
            let order = record;
            if (order === null) {
                order = new Order_1.default();
                order.status = 'ORDER_PROCESSING';
            }
            each(data, (value, key) => {
                order[key] = value;
            });
            let per_litre_cost = 0;
            let sellingPrice = await SellingPerLitre_1.default.query().where('is_active', 1).first();
            if (sellingPrice) {
                per_litre_cost = sellingPrice.price;
            }
            order.per_litre_cost = Number(per_litre_cost);
            let delivery_detail = await CustomerDeliveryDetail_1.default.query()
                .preload('poc')
                .where('id', data.customer_delivery_id)
                .first();
            if (delivery_detail) {
                order.customer_delivery_details = {
                    id: delivery_detail.id,
                    city: delivery_detail.city,
                    state: delivery_detail.state,
                    country: 'India',
                    pincode: delivery_detail.pincode,
                    address_1: delivery_detail.address_1,
                    address_2: delivery_detail.address_2,
                    address_type: delivery_detail.address_type,
                    landmark: delivery_detail.landmark,
                    phone: delivery_detail.phone,
                    location: delivery_detail.location,
                    location_name: delivery_detail.location_name,
                    poc_name: delivery_detail.poc.poc_name,
                    poc_phone: delivery_detail.poc.phone,
                    fuel_price: delivery_detail.fuel_price,
                };
                if (delivery_detail.fuel_price) {
                    order.per_litre_cost =
                        Number(per_litre_cost) + Number(delivery_detail.fuel_price);
                }
            }
            order.delivery_charges = 0;
            if (order.order_type === 'Same Day Delivery') {
                let dc = await DeliveryCharge_1.default.query().where('type', 'Express Delivery').first();
                order.delivery_charges = Number(dc.charges);
            }
            let discount = 0.0;
            let sub_total = Number(data.fuel_qty) * Number(data.per_litre_cost);
            order.total_amount = sub_total;
            order.grand_total = order.delivery_charges + sub_total - discount;
            order.balance = order.grand_total;
            order.payment_status = 'UN_PAID';
            let customer = await Customer_1.default.findOrFail(data.customer_id);
            if (customer && customer.is_credit_availed) {
                let total_amt = order.grand_total;
                let doesCLExceed = await this.doesCreditLimitExceeds(customer, total_amt);
                if (doesCLExceed) {
                    return response.badRequest({ message: 'Credit limit exceeds' });
                }
            }
            if (order.payment_type && order.payment_type.toUpperCase().trim() === 'PIA') {
                order.due_date = luxon_1.DateTime.now();
                order.last_date = order.due_date.plus({
                    days: order.customer.grace_period,
                });
            }
            order = await order.save();
            await OrderPoc_1.default.saveOrderPoc(order.id, data.poc_ids);
            return response.json({
                message: `Order ${record === null ? 'Created' : 'Updated'} Successfully`,
                order: await Order_1.default.query()
                    .where('id', order.id)
                    .preload('customer', (query) => {
                    query.select('id', 'industry_type', 'company_name', 'phone', 'email', 'outstanding_amount', 'is_credit_availed', 'address', 'city', 'pincode', 'state', 'gst_no');
                })
                    .preload('user', (query) => {
                    query.select('id', 'name');
                })
                    .first(),
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async doesCreditLimitExceeds(customer, grand_total) {
        try {
            let orderList = await Order_1.default.query()
                .where('customer_id', customer.id)
                .where('payment_status', 'PARTIALLY_PAID')
                .where('payment_status', 'UN_PAID');
            let all_grand_total = 0;
            for (let index = 0; index < orderList.length; index++) {
                const element = orderList[index];
                all_grand_total = all_grand_total + element.balance;
            }
            all_grand_total += Number(grand_total);
            if (all_grand_total >= customer.credit_limit) {
                return true;
            }
            return false;
        }
        catch (exception) {
            throw exception;
        }
    }
    async downloadPerforma({ request, response }) {
        try {
            let id = request.params().id;
            let data = await Order_1.default.query()
                .preload('customer', (customer) => {
                customer.select('*');
            })
                .preload('user', (user) => {
                user.select('*');
            })
                .where('id', id)
                .select('*')
                .first();
            let filePath = await this.generateInvoice(data);
            let base64String = '';
            if (fs.statSync(filePath).isFile()) {
                base64String = await base64ToNode((0, fs_1.readFileSync)(path_1.default.resolve(filePath)).toString('base64'));
            }
            if ((0, fs_1.existsSync)(filePath))
                (0, fs_1.unlinkSync)(filePath);
            return response.json({ base64String: base64String });
        }
        catch (exception) {
            response.internalServerError({ message: exception.message });
        }
    }
    async sendInvoice({ request, response }) {
        try {
            let id = request.params().id;
            let data = request.only(['to', 'cc', 'subject', 'message']);
            let record = await Order_1.default.query()
                .preload('customer', (customer) => {
                customer.select('*');
            })
                .preload('user', (user) => {
                user.select('*');
            })
                .where('id', id)
                .select('*')
                .first();
            data.cc = data.cc.replace(' ', '');
            let filePath = await this.generateInvoice(record);
            if (fs.statSync(filePath).isFile()) {
                await Event_1.default.emit('send-po-customer', { record: data, pdf: filePath });
            }
            return response.json({ message: 'Invoice sent successfully!' });
        }
        catch (exception) {
            response.internalServerError({ message: exception.message });
        }
    }
    async addCharges({ response }) {
        let orders = await Order_1.default.query()
            .innerJoin('customers as c', 'c.id', 'orders.customer_id')
            .where('c.is_credit_availed', true)
            .where('last_date', luxon_1.DateTime.now().toSQLDate())
            .whereNot('orders.payment_status', 'PAID');
        for (let index = 0; index < orders.length; index++) {
            const element = orders[index];
            let customer = await Customer_1.default.findOrFail(element.customer_id);
            if (customer.charges_type === 'Percentage') {
                element.grand_total =
                    Number(element.grand_total) +
                        (Number(element.grand_total) / 100) * Number(customer.late_charges);
                customer.outstanding_amount =
                    Number(customer.outstanding_amount) +
                        (Number(customer.outstanding_amount) / 100) * Number(customer.late_charges);
            }
            else {
                element.grand_total = Number(element.grand_total) + Number(customer.late_charges);
                customer.outstanding_amount =
                    Number(customer.outstanding_amount) + Number(customer.late_charges);
            }
            element.last_date = element.due_date.plus({
                days: customer.credit_net_due.days + customer.grace_period,
            });
            customer.save();
            element.save();
        }
        return response.json({ message: 'Charges added to order successfully' });
    }
    async orderTracking({ request, response }) {
        let id = request.params().id;
        let obj = {};
        obj.created_at = (0, moment_1.default)(new Date(request.order.createdAt)).format('DD-MM-YYYY');
        obj.current_status = request.order.status;
        obj.pos = await PurchaseSalesOrder_1.default.query()
            .preload('purchase_order', (q) => q
            .preload('supplier', (q) => q.select('name'))
            .preload('bowser', (q) => q.select('name'))
            .select('supplier_id', 'bowser_id', 'fuel_qty', 'purchase_date', 'status', 'payment_status', 'created_at', 'updated_at'))
            .where('so_id', id)
            .first();
        if (obj.pos) {
            obj.trip = await Trip_1.default.findBy('po_id', obj.pos.po_id);
        }
        else {
            obj.pos = null;
            obj.trip = null;
        }
        return response.json(obj);
    }
    generateInvoice(order) {
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
            order.created_at = (0, moment_1.default)(new Date(order.createdAt)).format('DD-MM-YYYY');
            order.delivery_date = (0, moment_1.default)(new Date(order.delivery_date)).format('DD-MM-YYYY');
            order.due_date = order.due_date
                ? (0, moment_1.default)(new Date(order.due_date)).format('DD-MM-YYYY')
                : 'N/A';
            order.last_date = order.due_date
                ? (0, moment_1.default)(new Date(order.last_date)).format('DD-MM-YYYY')
                : 'N/A';
            let delivery_detail = JSON.parse(order.customer_delivery_details);
            let inWords = (0, utils_1.NumInWords)(Number(order.grand_total));
            let filePath = Application_1.default.tmpPath('uploads') + '/' + order.id + '.pdf';
            let html = await View_1.default.render('perfoma_invoice', {
                data: order,
                delivery_detail,
                inWords,
            });
            (0, fs_1.writeFileSync)('index.html', html);
            await pdf.create(html, options).toFile(filePath, (err, _buffer) => {
                if (err) {
                    reject(err.message);
                }
                reslove(filePath);
            });
        });
    }
}
exports.default = OrdersController;
async function base64ToNode(buffer) {
    return buffer.toString('base64');
}
exports.base64ToNode = base64ToNode;
//# sourceMappingURL=OrdersController.js.map