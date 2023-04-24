import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FindById {
    public async handle(ctx: HttpContextContract, next: () => Promise<void>, guards?: string[]) {
        const model = guards
        const { id } = ctx.request.params()
        const Instance = (await import(`../Models/${model}`)).default

        let record = await Instance.query().where('id', id).first()

        if (!record) {
            return ctx.response.notFound({ message: `${model} not found.` })
        }

        if (typeof record.getLogs === 'function' && ctx.request.method() === 'GET') {
            const logs = await record.getLogs()
            record.logs = logs
        }

        if (model) {
            ctx.request[String(model).toLowerCase()] = record
        }
        await next()
    }
}
