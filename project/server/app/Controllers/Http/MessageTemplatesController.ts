import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessageTemplate from 'App/Models/MessageTemplate'
import Validator from 'validatorjs'

export default class MessageTemplatesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await MessageTemplate.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await MessageTemplate.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let messagetemplate = ctx.request.messagetemplate as MessageTemplate
        return await this.save(ctx, messagetemplate)
    }

    public async destroy(ctx) {
        try {
            let messagetemplate = ctx.request.messagetemplate as MessageTemplate
            await messagetemplate.delete()
            if (messagetemplate.$isDeleted) {
                return ctx.response.json({ message: 'Template Deleted' })
            } else {
                return ctx.response.json({ message: 'Template Deletion Failed' })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: MessageTemplate | null = null
    ) {
        try {
            let data = request.only(['type', 'message'])
            let rules = {
                type: 'required',
                message: 'required',
            }
            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            let message_template = record
            if (record === null) {
                message_template = new MessageTemplate()
            }
            message_template!.type = data.type
            message_template!.message = data.message
            message_template = await message_template!.save()
            return response.json({
                message: ` Message Template ${record === null ? 'Added' : 'Updated'}!`,
                id: message_template.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
