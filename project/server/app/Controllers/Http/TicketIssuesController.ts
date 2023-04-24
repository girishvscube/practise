import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import TicketIssue from 'App/Models/TicketIssue'
import Validator from 'validatorjs'

export default class TicketIssuesController {
    public async index({ response }: HttpContextContract) {
        try {
            let data = await TicketIssue.listing()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {
            let data = await TicketIssue.query().where('id', request.params().id).first()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.mesasge })
        }
    }
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    public async update(ctx) {
        let ticketissue = ctx.request.ticketissue as TicketIssue
        return await this.save(ctx, ticketissue)
    }

    public async destroy(ctx) {
        try {
            let ticketissue = ctx.request.ticketissue as TicketIssue
            await ticketissue.delete()
            if (ticketissue.$isDeleted) {
                return ctx.response.json({ message: 'Issue Deleted ' })
            } else {
                return ctx.response.json({ message: 'Issue Deletion Failed' })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: TicketIssue | null = null
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
            let ticket_issue = record
            if (record === null) {
                ticket_issue = new TicketIssue()
            }
            ticket_issue!.name = data.name
            ticket_issue = await ticket_issue!.save()
            return response.json({
                message: ` Issue ${record === null ? 'Added' : 'Updated'}!`,
                id: ticket_issue.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
