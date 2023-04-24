"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mail_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Addons/Mail"));
const Event_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Event"));
Event_1.default.on('send-otp', async ({ record }) => {
    Mail_1.default.sendLater((message) => {
        message.from('noreply@scube.me').subject(record.subject).to(record.to).html(`<div>
          ${record.message}
        </div>`);
    });
});
//# sourceMappingURL=events.js.map