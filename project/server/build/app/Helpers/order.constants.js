"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderPayment = exports.DISCOUNT_TYPE = exports.ORDER_TYPE = exports.ORDER_PAYMENT_STATUS = exports.ORDER_STATUS = void 0;
exports.ORDER_STATUS = [
    {
        name: 'ORDER_PROCESSING',
    },
    {
        name: 'ORDER_CONFIRMED',
    },
    {
        name: 'PO_LINKED',
    },
    {
        name: 'DISPATCHED',
    },
    {
        name: 'DELIVERED',
    },
    {
        name: 'ORDER_CANCELLED',
    },
];
exports.ORDER_PAYMENT_STATUS = [
    {
        name: 'Pending',
    },
    {
        name: 'Partly Paid',
    },
    {
        name: 'Paid',
    },
];
exports.ORDER_TYPE = [
    {
        name: 'Same Day Delivery',
    },
    {
        name: 'Normal',
    },
];
exports.DISCOUNT_TYPE = [
    {
        name: 'Percentage',
    },
    {
        name: 'Amount',
    },
];
async function getOrderPayment(fuel_qty, per_litre_cost, orderPayment) {
    let discount = 0;
    if (isNaN(orderPayment.discount)) {
        orderPayment.discount = 0;
    }
    if (isNaN(orderPayment.delivery_charges)) {
        orderPayment.delivery_charges = 0;
    }
    if (orderPayment.discount_type && orderPayment.discount_type === exports.DISCOUNT_TYPE[0].name) {
        discount = ((fuel_qty * per_litre_cost) / 100) * orderPayment.discount;
    }
    else {
        discount = orderPayment.discount;
    }
    orderPayment.total_amount = fuel_qty * per_litre_cost;
    orderPayment.per_litre_cost = per_litre_cost;
    orderPayment.grand_total = orderPayment.total_amount + orderPayment.delivery_charges - discount;
    orderPayment.balance = orderPayment.grand_total;
    return orderPayment;
}
exports.getOrderPayment = getOrderPayment;
//# sourceMappingURL=order.constants.js.map