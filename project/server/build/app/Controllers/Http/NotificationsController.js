"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = global[Symbol.for('ioc.use')]("App/Helpers/firebase");
const Notification_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Notification"));
class NotificationsController {
    async getUnreadByUserId({ auth, response }) {
        try {
            let data = await Notification_1.default.getByUserId(auth.user.id, false);
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async getReadByUserId({ auth, response }) {
        try {
            let data = await Notification_1.default.getByUserId(auth.user.id, true);
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async clearAll({ auth, response }) {
        try {
            await Notification_1.default.query().where('notify_to', auth.user.id).update({ is_read: true });
            return response.json({ message: 'Notification cleared!' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async clear({ request, auth, response }) {
        try {
            let notification = await Notification_1.default.query()
                .where('id', request.params().id)
                .andWhere('notify_to', auth.user.id)
                .first();
            notification.is_read = true;
            await notification.save();
            return response.json({ message: 'Notification read!' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async firebaseNotification({ response }) {
        try {
            await (0, firebase_1.notify)([
                {
                    device_id: 'cqo8BVJRQg2qVxoLzxGkHs:APA91bHbpKl4GCTB7EztsZWEHAyNy1h-wXpM9YEH5_rPRdqAinJZttE6T6eu4vnAzahSTpYDojSI9pRycBcZLGxubm7wBarOI_OC16eMZRuLQOHImgU8lMGJ7yzOyiuRNROBm9G30vH2',
                },
            ], '');
            response.send('done');
        }
        catch (exception) {
            response.internalServerError(exception);
        }
    }
}
exports.default = NotificationsController;
//# sourceMappingURL=NotificationsController.js.map