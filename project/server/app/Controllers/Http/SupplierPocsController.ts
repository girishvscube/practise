import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { fileUploadToS3 } from 'App/Helpers/upload'
import SupplierPoc from 'App/Models/SupplierPoc'
import Validator from 'validatorjs'
const { each } = require('lodash')
import { schema } from '@ioc:Adonis/Core/Validator'

export default class SupplierPocsController {
    /**
     * @ctx
     */
    public async index(ctx: HttpContextContract) {
        try {
            return await SupplierPoc.listing(ctx.request.qs())
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async show(ctx: HttpContextContract) {
        try {
            return await SupplierPoc.query().select('*').where('id', ctx.request.params().id)
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
        }
    }
    /**
     * @param ctx
     */
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    /**
     * @param ctx
     */
    public async getBySupplierId(ctx: HttpContextContract) {
        let data = await SupplierPoc.query()
            .preload('supplier', (q) => q.select('*'))
            .select('*')
            .where('supplier_id', ctx.request.params().id)
        return ctx.response.json(data)
    }

    /**
     * @param ctx
     */
    public async destroy(ctx) {
        try {
            const supplierpoc = ctx.request.supplierpoc as SupplierPoc
            await supplierpoc.delete()
            return ctx.response.json({ message: 'Supplier contact deleted successfully' })
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { supplierpoc } = ctx.request
        return this.save(ctx, supplierpoc)
    }

    private async save(
        { request, response }: HttpContextContract,
        record: SupplierPoc | null = null
    ) {
        try {
            const data = request.only([
                'supplier_id',
                'poc_name',
                'designation',
                'contact',
                'email',
                'image',
            ]) as any
            const rules: any = {
                supplier_id: 'required|numeric',
                poc_name: 'required|max:100',
                designation: 'required|max:50',
                contact: 'required|min:10|max:10',
                email: 'required|email',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            let imgSchema = schema.create({
                image_file: schema.file.optional({
                    size: '10mb',
                    extnames: ['jpeg', 'jpg', 'jfif'],
                }),
            })

            let payload = await request.validate({ schema: imgSchema })
            if (payload.image_file) {
                data.image = await fileUploadToS3(payload.image_file!.extname, payload.image_file)
            }


            let supplierPoc: any = record
            if (record === null) {
                supplierPoc = new SupplierPoc()
            }
            each(data, (value, key) => {
                supplierPoc[key] = value
            })
            await supplierPoc.save()
            response.json({
                message: `Supplier POC ${record ? 'Updated' : 'Created'} Successfully`,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
