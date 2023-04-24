"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const luxon_1 = require("luxon");
const moment_1 = __importDefault(require("moment"));
class DashboardController {
    async custVsLead({ request, response }) {
        try {
            let { start_date = '', end_date = '' } = request.qs();
            end_date = end_date ? end_date : luxon_1.DateTime.now().toSQLDate();
            start_date = start_date ? start_date : (0, moment_1.default)(end_date).subtract({ days: 6 }).toString();
            let data = [];
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let leads = await Database_1.default.rawQuery(`select count(id) as count, date(created_at) as created_at from leads where created_at between '${start}' and '${end}' group by date(created_at);`);
            let customers = await Database_1.default.rawQuery(`select count(id) as count, date(created_at) as created_at from customers where created_at between '${start}' and '${end}' group by date(created_at);`);
            while ((0, moment_1.default)(end_date).diff((0, moment_1.default)(start_date)) >= 0) {
                let customer = customers[0].find((c) => (0, moment_1.default)(c.created_at).diff(start_date) === 0);
                let lead = leads[0].find((l) => (0, moment_1.default)(l.created_at).diff(start_date) === 0);
                data.push({
                    customer_count: customer ? customer.count : 0,
                    lead_count: lead ? lead.count : 0,
                    date: (0, moment_1.default)(start_date).utcOffset('+05:30').format('YYYY-MM-DD'),
                });
                start_date = (0, moment_1.default)(start_date).add({ day: 1 });
            }
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async tripStats({ request, response }) {
        try {
            let { start_date = '', end_date = '' } = request.qs();
            end_date = end_date ? end_date : luxon_1.DateTime.now().toSQLDate();
            start_date = start_date ? start_date : (0, moment_1.default)(end_date).subtract({ days: 6 }).toString();
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let data = await Database_1.default.rawQuery(`select count(id) as count, sum(distance_travelled) as distance_travelled, date(created_at) as created_at from trips where created_at between '${start}' and '${end}' group by date(created_at)`);
            return response.json(data[0]);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async fuelStats({ request, response }) {
        try {
            let { start_date = '', end_date = '' } = request.qs();
            end_date = end_date ? end_date : luxon_1.DateTime.now().toSQLDate();
            start_date = start_date ? start_date : (0, moment_1.default)(end_date).subtract({ days: 6 }).toString();
            let data = [];
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let available = await Database_1.default.rawQuery(`select sum(fuel_left_at_end) as fuel_available, date(actual_end_time) as end_time from trips where actual_end_time between '${start}' and '${end}' group by date(actual_end_time)`);
            let purchased = await Database_1.default.rawQuery(`select sum(po.fuel_qty) as purchased, date(end_time)as end_time from purchase_orders as po left join trip_schedule_logs as tsl on tsl.po_id = po.id where tsl.status='ENDED' and end_time between '${start}' and '${end}' group by date(end_time)`);
            let delivered = await Database_1.default.rawQuery(`select sum(o.fuel_qty) as delivered, date(end_time)as end_time from orders as o left join trip_schedule_logs as tsl on tsl.so_id = o.id where tsl.status='ENDED' and end_time between '${start}' and '${end}' group by date(end_time)`);
            while ((0, moment_1.default)(end_date).diff((0, moment_1.default)(start_date)) >= 0) {
                let avail = available[0].find((a) => (0, moment_1.default)(a.end_time).diff(start_date) === 0);
                let purchase = purchased[0].find((p) => (0, moment_1.default)(p.end_time).diff(start_date) === 0);
                let delivery = delivered[0].find((d) => (0, moment_1.default)(d.end_time).diff(start_date) === 0);
                data.push({
                    available_qty: avail ? avail.fuel_available : 0,
                    delivered_qty: delivery ? delivery.delivered : 0,
                    purchased_qty: purchase ? purchase.purchased : 0,
                    date: (0, moment_1.default)(start_date).utcOffset('+05:30').format('YYYY-MM-DD'),
                });
                start_date = (0, moment_1.default)(start_date).add({ day: 1 });
            }
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError(exception.message);
        }
    }
    async accountStats({ request, response }) {
        try {
            let { start_date = '', end_date = '' } = request.qs();
            end_date = end_date ? end_date : luxon_1.DateTime.now().toSQLDate();
            start_date = start_date ? start_date : (0, moment_1.default)(end_date).subtract({ days: 6 }).toString();
            let data = [];
            let start = (0, moment_1.default)(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let end = (0, moment_1.default)(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss');
            let pay_ins = await Database_1.default.rawQuery(`select sum(amount) as amount, date(created_at) as created_at from pay_ins where created_at between '${start}' and '${end}' group by date(created_at)`);
            let pay_outs = await Database_1.default.rawQuery(`select sum(amount) as amount, date(created_at) as created_at from pay_outs where created_at between '${start}' and '${end}' group by date(created_at)`);
            let expenses = await Database_1.default.rawQuery(`select sum(amount) as amount, date(created_at) as created_at from expenses where created_at between '${start}' and '${end}' group by date(created_at)`);
            while ((0, moment_1.default)(end_date).diff((0, moment_1.default)(start_date)) >= 0) {
                let pay_in = pay_ins[0].find((a) => (0, moment_1.default)(a.created_at).diff(start_date) === 0);
                let pay_out = pay_outs[0].find((p) => (0, moment_1.default)(p.created_at).diff(start_date) === 0);
                let expense = expenses[0].find((d) => (0, moment_1.default)(d.created_at).diff(start_date) === 0);
                data.push({
                    pay_in: pay_in ? pay_in.amount : 0,
                    pay_out: pay_out ? pay_out.amount : 0,
                    expense: expense ? expense.amount : 0,
                    date: (0, moment_1.default)(start_date).utcOffset('+05:30').format('YYYY-MM-DD'),
                });
                start_date = (0, moment_1.default)(start_date).add({ day: 1 });
            }
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError(exception.message);
        }
    }
    async unpaidStats({ response }) {
        try {
            let one = (0, moment_1.default)(luxon_1.DateTime.now())
                .subtract({ day: 1 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD');
            let fifteen = (0, moment_1.default)(luxon_1.DateTime.now())
                .subtract({ days: 15 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD');
            let sixteen = (0, moment_1.default)(luxon_1.DateTime.now())
                .subtract({ days: 16 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD');
            let thirty = (0, moment_1.default)(luxon_1.DateTime.now())
                .subtract({ days: 30 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD');
            let thirty_one = (0, moment_1.default)(luxon_1.DateTime.now())
                .subtract({ days: 31 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD');
            let forty_five = (0, moment_1.default)(luxon_1.DateTime.now())
                .subtract({ days: 45 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD');
            let unpaidAmount = await Database_1.default.rawQuery(`select sum(grand_total) as total_due from orders where payment_status!='PAID' and due_date is not null`);
            let current_due = await Database_1.default.rawQuery(`select sum(grand_total) as current_due from orders where payment_status!='PAID' and due_date > now()`);
            let over_due = await Database_1.default.rawQuery(`select sum(grand_total) as over_due from orders where payment_status!='PAID' and due_date < now()`);
            let one_to_15 = await Database_1.default.rawQuery(`select sum(grand_total) as over_due from orders where payment_status!='PAID' and date(due_date) between '${fifteen}' and '${one}';`);
            let sixteen_to_30 = await Database_1.default.rawQuery(`select sum(grand_total) as over_due from orders where payment_status!='PAID' and date(due_date) between '${thirty}' and '${sixteen}'`);
            let thirty_1_to_45 = await Database_1.default.rawQuery(`select sum(grand_total) as over_due from orders where payment_status!='PAID' and date(due_date) between '${forty_five}' and '${thirty_one}'`);
            let above_45 = await Database_1.default.rawQuery(`select sum(grand_total) as over_due from orders where payment_status!='PAID' and due_date < '${forty_five}'`);
            return {
                unpaidAmount: unpaidAmount[0][0].total_due,
                current_due: current_due[0][0].current_due,
                over_due: over_due[0][0].over_due,
                one_to_15: one_to_15[0][0].over_due,
                sixteen_to_30: sixteen_to_30[0][0].over_due,
                thirty_1_to_45: thirty_1_to_45[0][0].over_due,
                above_45: above_45[0][0].over_due,
            };
        }
        catch (exception) {
            return response.internalServerError(exception.message);
        }
    }
}
exports.default = DashboardController;
//# sourceMappingURL=DashboardController.js.map