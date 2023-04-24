import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PurchaseOrder from 'App/Models/PurchaseOrder'
// const converter = require('number-to-words')
import Application from '@ioc:Adonis/Core/Application'
const pdf = require('html-pdf')
import View from '@ioc:Adonis/Core/View'
import { existsSync, readFileSync, unlinkSync } from 'fs'
var fs = require('fs')
import path from 'path'
import { base64ToNode } from './OrdersController'
import moment from 'moment'
import Event from '@ioc:Adonis/Core/Event'
import { NumInWords } from 'App/Helpers/utils'
import SupplierPoc from 'App/Models/SupplierPoc'

export default class PurchaseBillsController {
    public async count({ request, response }: HttpContextContract) {
        try {
            let data = await PurchaseOrder.purchaseBillStats(request.qs())
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async index({ request, response }: HttpContextContract) {
        try {
            let data = await PurchaseOrder.purchaseBillList(request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async downloadPurchaseBill({ request, response }: HttpContextContract) {
        try {
            let id = request.params().id
            let data = await PurchaseOrder.query()
                .preload('bowser', (bowser) => {
                    bowser.select('*')
                })
                .preload('supplier', (supplier) => {
                    supplier.select('*')
                })
                .where('id', id)
                .select('*')
                .first()

            let filePath: any = await this.generateInvoice(data!)
            let base64String = ''
            if (fs.statSync(filePath).isFile()) {
                base64String = await base64ToNode(
                    readFileSync(path.resolve(filePath)).toString('base64')
                )
            }
            if (existsSync(filePath)) unlinkSync(filePath)
            return response.json({ base64String: base64String })
        } catch (exception) {
            response.internalServerError({ message: exception.message })
        }
    }

    public async sendPurchaseBill({ request, response }: HttpContextContract) {
        try {
            let id = request.params().id
            let data = request.only(['to', 'cc', 'subject', 'message'])
            let record = await PurchaseOrder.query()
                .preload('bowser', (bowser) => {
                    bowser.select('*')
                })
                .preload('supplier', (supplier) => {
                    supplier.select('*')
                })
                .where('id', id)
                .select('*')
                .first()

            data.cc = data.cc.replace(' ', '')

            let filePath: any = await this.generateInvoice(record!)
            if (fs.statSync(filePath).isFile()) {
                await Event.emit('send-po-customer', { record: data, pdf: filePath })
            }
            // if (existsSync(filePath)) unlinkSync(filePath)
            return response.json({ message: 'Purchase Bill sent successfully' })
        } catch (exception) {
            response.internalServerError({ message: exception.message })
        }
    }

    public async mailList({ request, response }: HttpContextContract) {
        let id = request.params().id
        let po = await PurchaseOrder.query()
            .preload('supplier', (q) => q.select('email'))
            .where('id', id)
            .select('id', 'supplier_id')
            .first()
        let supplier_poc = await SupplierPoc.query()
            .where('supplier_id', id)
            .select('supplier_id', 'email')
        return response.json({ primary_email: po!.supplier.email, poc_email: supplier_poc })
    }

    private generateInvoice(po: any) {
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
            }
            po!.created_at = moment(new Date(po.createdAt)).format('DD-MM-YYYY')
            po!.purchase_date = moment(new Date(po!.purchase_date)).format('DD-MM-YYYY')
            let inWords = NumInWords(Number(po.total_amount))
            let filePath = Application.tmpPath('uploads') + '/' + po.id + '.pdf'
            let html = await View.render('purchase_bill', {
                data: po,
                inWords,
            })
            await pdf.create(html, options).toFile(filePath, (err, _buffer) => {
                if (err) {
                    reject(err.message)
                }
                reslove(filePath)
            })
        })
    }
}
