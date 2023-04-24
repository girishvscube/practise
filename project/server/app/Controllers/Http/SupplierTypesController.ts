import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SupplierType from 'App/Models/SupplierType'
import Validator from 'validatorjs'

export default class SupplierTypesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await SupplierType.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await SupplierType.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let suppliertype = ctx.request.suppliertype as SupplierType
        return await this.save(ctx, suppliertype)
    }

    public async destroy(ctx) {
        let suppliertype = ctx.request.suppliertype as SupplierType
        await suppliertype.delete()
        return ctx.response.json({ message: 'Supplier Type Deleted!' })
    }

    private async save(
        { request, response }: HttpContextContract,
        record: SupplierType | null = null
    ) {
        try {
            let data = request.only(['name'])
            let rules = {
                name: 'required',
            }
            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            let supplier_type = record
            if (record === null) {
                supplier_type = new SupplierType()
            }
            supplier_type!.name = data.name
            supplier_type = await supplier_type!.save()
            return response.json({
                message: `Supplier Type ${record === null ? 'Added' : 'Updated'}!`,
                id: supplier_type.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
