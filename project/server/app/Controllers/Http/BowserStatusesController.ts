import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BowserStatus from 'App/Models/BowserStatus'
import Validator from 'validatorjs'

export default class BowserStatusesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await BowserStatus.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await BowserStatus.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let bowserstatus = ctx.request.bowserstatus as BowserStatus
        return await this.save(ctx, bowserstatus)
    }

    public async destroy(ctx) {
        try {
            let bowserstatus = ctx.request.bowserstatus as BowserStatus
            await bowserstatus.delete()
            if (bowserstatus.$isDeleted) {
                await bowserstatus.log(ctx.auth.user, { message: `Staus Deleted` })
                return ctx.response.json({ message: 'Status Deleted' })
            } else {
                await bowserstatus.log(ctx.auth.user, { message: `Staus Deletion Failed` })
                return ctx.response.json({ message: 'Status Deletion Failed' })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge })
        }
    }

    private async save(
        { request, auth, response }: HttpContextContract,
        record: BowserStatus | null = null
    ) {
        try {
            let data = request.only(['name', 'color'])
            let rules = {
                name: 'required',
                color: 'string',
            }
            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }
            let bowser_status = record
            if (record === null) {
                bowser_status = new BowserStatus()
            }
            bowser_status!.name = data.name
            bowser_status!.color = data.color
            bowser_status = await bowser_status!.save()
            bowser_status.log(auth.user, {
                message: `Status ${record === null ? 'Added' : 'Updated'}!`,
                type: 'INFO',
            })
            return response.json({
                message: `Status ${record === null ? 'Added' : 'Updated'}!`,
                id: bowser_status.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
