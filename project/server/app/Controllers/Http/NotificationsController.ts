import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { notify } from 'App/Helpers/firebase'
import Notification from 'App/Models/Notification'

export default class NotificationsController {
    public async getUnreadByUserId({ auth, response }: HttpContextContract) {
        try {
            let data = await Notification.getByUserId(auth.user!.id, false)
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async getReadByUserId({ auth, response }: HttpContextContract) {
        try {
            let data = await Notification.getByUserId(auth.user!.id, true)
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async clearAll({ auth, response }: HttpContextContract) {
        try {
            await Notification.query().where('notify_to', auth.user!.id).update({ is_read: true })
            return response.json({ message: 'Notification cleared!' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async clear({ request, auth, response }: HttpContextContract) {
        try {
            let notification = await Notification.query()
                .where('id', request.params().id)
                .andWhere('notify_to', auth.user!.id)
                .first()
            notification!.is_read = true
            await notification!.save()
            return response.json({ message: 'Notification read!' })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    public async firebaseNotification({ response }: HttpContextContract) {
        try {
            await notify(
                [
                    {
                        device_id:
                            'cqo8BVJRQg2qVxoLzxGkHs:APA91bHbpKl4GCTB7EztsZWEHAyNy1h-wXpM9YEH5_rPRdqAinJZttE6T6eu4vnAzahSTpYDojSI9pRycBcZLGxubm7wBarOI_OC16eMZRuLQOHImgU8lMGJ7yzOyiuRNROBm9G30vH2',
                    },
                ],
                ''
            )
            response.send('done')
        } catch (exception) {
            response.internalServerError(exception)
        }
    }
}
