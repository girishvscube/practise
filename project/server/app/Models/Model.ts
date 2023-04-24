import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
// import Log from 'App/Models/Log'

export default class Model extends BaseModel {
    @column()
    public id: number

    @column()
    public created_by: number

    @column()
    public updated_by: number

    @computed()
    public logs: any

    public async getLogs() {
        const { default: Log } = await import('App/Models/Log')
        return Log.query()
            .preload('user', (query) => {
                query.select('id', 'name', 'image')
            })
            .where('model_id', this.id)
            .where('model', this.constructor.name)
            .orderBy('id', 'desc')
    }

    public async log(user, { message = '', type = 'ACTION' }) {
        const model = this
        if (message === null) {
            message = ` ${model.created_by === model.updated_by ? 'created' : 'updated'} `
        }
        const { default: Log } = await import('App/Models/Log')
        await Log.create({
            model_id: model.id,
            model: model.constructor.name,
            user_id: user.id,
            message,
            type,
        })
    }
}
