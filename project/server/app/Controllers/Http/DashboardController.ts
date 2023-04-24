import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import moment from 'moment'

export default class DashboardController {
    public async custVsLead({ request, response }: HttpContextContract) {
        try {
            let { start_date = '', end_date = '' } = request.qs()
            end_date = end_date ? end_date : DateTime.now().toSQLDate()
            start_date = start_date ? start_date : moment(end_date).subtract({ days: 6 }).toString()
            let data: comparisonStatsObj[] = []
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let leads = await Database.rawQuery(
                `select count(id) as count, date(created_at) as created_at from leads where created_at between '${start}' and '${end}' group by date(created_at);`
            )
            let customers = await Database.rawQuery(
                `select count(id) as count, date(created_at) as created_at from customers where created_at between '${start}' and '${end}' group by date(created_at);`
            )
            while (moment(end_date).diff(moment(start_date)) >= 0) {
                let customer = customers[0].find((c) => moment(c.created_at).diff(start_date) === 0)
                let lead = leads[0].find((l) => moment(l.created_at).diff(start_date) === 0)
                // update count by day
                data.push({
                    customer_count: customer ? customer.count : 0,
                    lead_count: lead ? lead.count : 0,
                    date: moment(start_date).utcOffset('+05:30').format('YYYY-MM-DD'),
                })
                start_date = moment(start_date).add({ day: 1 })
            }
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async tripStats({ request, response }: HttpContextContract) {
        try {
            let { start_date = '', end_date = '' } = request.qs()
            end_date = end_date ? end_date : DateTime.now().toSQLDate()
            start_date = start_date ? start_date : moment(end_date).subtract({ days: 6 }).toString()
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let data = await Database.rawQuery(
                `select count(id) as count, sum(distance_travelled) as distance_travelled, date(created_at) as created_at from trips where created_at between '${start}' and '${end}' group by date(created_at)`
            )
            return response.json(data[0])
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async fuelStats({ request, response }: HttpContextContract) {
        try {
            let { start_date = '', end_date = '' } = request.qs()
            end_date = end_date ? end_date : DateTime.now().toSQLDate()
            start_date = start_date ? start_date : moment(end_date).subtract({ days: 6 }).toString()
            let data: fuelStatsObj[] = []
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let available = await Database.rawQuery(
                `select sum(fuel_left_at_end) as fuel_available, date(actual_end_time) as end_time from trips where actual_end_time between '${start}' and '${end}' group by date(actual_end_time)`
            )
            let purchased = await Database.rawQuery(
                `select sum(po.fuel_qty) as purchased, date(end_time)as end_time from purchase_orders as po left join trip_schedule_logs as tsl on tsl.po_id = po.id where tsl.status='ENDED' and end_time between '${start}' and '${end}' group by date(end_time)`
            )
            let delivered = await Database.rawQuery(
                `select sum(o.fuel_qty) as delivered, date(end_time)as end_time from orders as o left join trip_schedule_logs as tsl on tsl.so_id = o.id where tsl.status='ENDED' and end_time between '${start}' and '${end}' group by date(end_time)`
            )
            while (moment(end_date).diff(moment(start_date)) >= 0) {
                let avail = available[0].find((a) => moment(a.end_time).diff(start_date) === 0)
                let purchase = purchased[0].find((p) => moment(p.end_time).diff(start_date) === 0)
                let delivery = delivered[0].find((d) => moment(d.end_time).diff(start_date) === 0)
                data.push({
                    available_qty: avail ? avail.fuel_available : 0,
                    delivered_qty: delivery ? delivery.delivered : 0,
                    purchased_qty: purchase ? purchase.purchased : 0,
                    date: moment(start_date).utcOffset('+05:30').format('YYYY-MM-DD'),
                })
                start_date = moment(start_date).add({ day: 1 })
            }
            return response.json(data)
        } catch (exception) {
            return response.internalServerError(exception.message)
        }
    }

    public async accountStats({ request, response }: HttpContextContract) {
        try {
            let { start_date = '', end_date = '' } = request.qs()
            end_date = end_date ? end_date : DateTime.now().toSQLDate()
            start_date = start_date ? start_date : moment(end_date).subtract({ days: 6 }).toString()
            let data: accountStatsObj[] = []
            let start = moment(start_date)
                .utcOffset('+05:30')
                .startOf('day')
                .format('YYYY-MM-DD HH:mm:ss')
            let end = moment(end_date)
                .utcOffset('+05:30')
                .endOf('day')
                .format('YYYY-MM-DD HH:mm:ss')

            let pay_ins = await Database.rawQuery(
                `select sum(amount) as amount, date(created_at) as created_at from pay_ins where created_at between '${start}' and '${end}' group by date(created_at)`
            )
            let pay_outs = await Database.rawQuery(
                `select sum(amount) as amount, date(created_at) as created_at from pay_outs where created_at between '${start}' and '${end}' group by date(created_at)`
            )
            let expenses = await Database.rawQuery(
                `select sum(amount) as amount, date(created_at) as created_at from expenses where created_at between '${start}' and '${end}' group by date(created_at)`
            )

            while (moment(end_date).diff(moment(start_date)) >= 0) {
                let pay_in = pay_ins[0].find((a) => moment(a.created_at).diff(start_date) === 0)
                let pay_out = pay_outs[0].find((p) => moment(p.created_at).diff(start_date) === 0)
                let expense = expenses[0].find((d) => moment(d.created_at).diff(start_date) === 0)
                data.push({
                    pay_in: pay_in ? pay_in.amount : 0,
                    pay_out: pay_out ? pay_out.amount : 0,
                    expense: expense ? expense.amount : 0,
                    date: moment(start_date).utcOffset('+05:30').format('YYYY-MM-DD'),
                })
                start_date = moment(start_date).add({ day: 1 })
            }
            return response.json(data)
        } catch (exception) {
            return response.internalServerError(exception.message)
        }
    }

    public async unpaidStats({ response }: HttpContextContract) {
        try {
            let one = moment(DateTime.now())
                .subtract({ day: 1 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD')
            let fifteen = moment(DateTime.now())
                .subtract({ days: 15 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD')
            let sixteen = moment(DateTime.now())
                .subtract({ days: 16 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD')
            let thirty = moment(DateTime.now())
                .subtract({ days: 30 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD')
            let thirty_one = moment(DateTime.now())
                .subtract({ days: 31 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD')
            let forty_five = moment(DateTime.now())
                .subtract({ days: 45 })
                .utcOffset('+05:30')
                .format('YYYY-MM-DD')

            let unpaidAmount = await Database.rawQuery(
                `select sum(grand_total) as total_due from orders where payment_status!='PAID' and due_date is not null`
            )
            let current_due = await Database.rawQuery(
                `select sum(grand_total) as current_due from orders where payment_status!='PAID' and due_date > now()`
            )
            let over_due = await Database.rawQuery(
                `select sum(grand_total) as over_due from orders where payment_status!='PAID' and due_date < now()`
            )
            let one_to_15 = await Database.rawQuery(
                `select sum(grand_total) as over_due from orders where payment_status!='PAID' and date(due_date) between '${fifteen}' and '${one}';`
            )
            let sixteen_to_30 = await Database.rawQuery(
                `select sum(grand_total) as over_due from orders where payment_status!='PAID' and date(due_date) between '${thirty}' and '${sixteen}'`
            )
            let thirty_1_to_45 = await Database.rawQuery(
                `select sum(grand_total) as over_due from orders where payment_status!='PAID' and date(due_date) between '${forty_five}' and '${thirty_one}'`
            )
            let above_45 = await Database.rawQuery(
                `select sum(grand_total) as over_due from orders where payment_status!='PAID' and due_date < '${forty_five}'`
            )

            return {
                unpaidAmount: unpaidAmount[0][0].total_due,
                current_due: current_due[0][0].current_due,
                over_due: over_due[0][0].over_due,
                one_to_15: one_to_15[0][0].over_due,
                sixteen_to_30: sixteen_to_30[0][0].over_due,
                thirty_1_to_45: thirty_1_to_45[0][0].over_due,
                above_45: above_45[0][0].over_due,
            }
        } catch (exception) {
            return response.internalServerError(exception.message)
        }
    }
}

interface comparisonStatsObj {
    customer_count: number
    lead_count: number
    date: any
}
interface fuelStatsObj {
    available_qty: number
    delivered_qty: number
    purchased_qty: number
    date: any
}

interface accountStatsObj {
    pay_in: number
    pay_out: number
    expense: number
    date: any
}
