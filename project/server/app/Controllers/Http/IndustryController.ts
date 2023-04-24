import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import IndustryType from 'App/Models/IndustryType'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class IndustryController {
    public async dropdown({ response }: HttpContextContract) {
        try {
            let industries = await IndustryType.dropdown()
            return response.json(industries)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    public async index({ response }: HttpContextContract) {
        try {
            let industries = await IndustryType.listing()
            return response.json(industries)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    /**
     * @param request
     * @param response
     */
    public async show({ request, response }) {
        try {
            let industry: any = request.industrytype
            return response.json(industry)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { industrytype } = ctx.request
        return this.save(ctx, industrytype)
    }

    /**
     * @param ctx
     */
    public async destroy(ctx) {
        try {
            const industrytype = ctx.request.industrytype as IndustryType
            await industrytype.delete()
            if (industrytype.$isDeleted) {
                return ctx.response.json({
                    message: `Industry Type Deleted!`,
                })
            } else {
                return ctx.response.badRequest({
                    message: `Something went wrong, Industry Type was not Deleted!`,
                })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: IndustryType | null = null
    ) {
        try {
            const data = request.only(['name'])
            const rules: any = {
                name: 'required|max:50',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            const IndustryNameExists = await IndustryType.query().where('name', data.name).first()

            let industry: IndustryType = record as any
            if (record === null) {
                industry = new IndustryType()
            }

            if (IndustryNameExists && IndustryNameExists.id !== industry.id) {
                return response.badRequest({
                    message: 'Industry name already exists',
                })
            }

            each(data, (value, key) => {
                industry[key] = value
            })
            await industry.save()

            return response.json({
                message: `Industry ${record ? 'Updated' : 'Created'} Successfully`,
            })
        } catch (exception) {
            throw exception
        }
    }
}
