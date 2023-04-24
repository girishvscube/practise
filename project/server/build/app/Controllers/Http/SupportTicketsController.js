"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supportTicket_constants_1 = global[Symbol.for('ioc.use')]("App/Helpers/supportTicket.constants");
const upload_1 = global[Symbol.for('ioc.use')]("App/Helpers/upload");
const SupportTicket_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/SupportTicket"));
const luxon_1 = require("luxon");
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const validatorjs_1 = __importDefault(require("validatorjs"));
const Notification_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Notification"));
const RoleModule_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/RoleModule"));
const { each } = require('lodash');
class SupportTicketsController {
    async statusDropdown({ response }) {
        return response.json(supportTicket_constants_1.SUPPORT_TICKET_STATUS);
    }
    async priorityDropdown({ response }) {
        return response.json(supportTicket_constants_1.PRIORITY_LEVEL);
    }
    async issueTypeDropdown({ response }) {
        return response.json(supportTicket_constants_1.ISSUE_TYPE);
    }
    async count({ request, response }) {
        try {
            let data = await SupportTicket_1.default.count(request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let data = await SupportTicket_1.default.listing(request.qs());
            return response.send(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async reassignTicketRequest({ request, response, auth }) {
        try {
            const supportticket = request.supportticket;
            const rules = {
                notes: 'required|max:500',
            };
            const data = request.only(['notes']);
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            supportticket.is_reassign_requested = true;
            supportticket.status = 'EXE_CANCELLED';
            supportticket.reassign_notes = data.notes;
            supportticket.sales_id = null;
            supportticket.reassign_date = luxon_1.DateTime.now();
            await supportticket.save();
            await supportticket.log(auth.user, {
                message: `request for support ticket re-assign`,
                type: 'ACTION',
            });
            await supportticket.log(auth.user, { message: data.notes, type: 'NOTE' });
            response.json({ message: 'Re-assign requested is created!' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await SupportTicket_1.default.query()
                .preload('assigned_user', (q) => q.select('*'))
                .preload('created_user', (q) => q.select('*'))
                .preload('order', (q) => q.preload('customer', (q) => q.select('*')).select('*'))
                .where('id', request.params().id)
                .first();
            if (!data) {
                return response.notFound({ message: `Purchase order Not Found` });
            }
            data.logs = await data.getLogs();
            return response.json({ support_ticket: data });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return this.save(ctx);
    }
    async update(ctx) {
        let data = ctx.request.supportticket;
        return this.save(ctx, data);
    }
    async updateStatus({ request, response, auth }) {
        try {
            let record = request.supportticket;
            let data = request.only(['status', 'sales_id']);
            let rules = {
                status: 'required',
                notes: 'string|max:500',
            };
            if (data.status === 'OPEN') {
                rules['sales_id'] = 'required|numeric';
            }
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let roleModule = await RoleModule_1.default.query().where('slug', 'support').first();
            await Notification_1.default.create({
                module_id: roleModule.id,
                assignee: auth.user.id,
                message: `Ticket #${record.id} was assigned to you by ${auth.user.name}`,
                reference_id: record.id,
                notify_to: data.sales_id,
            });
            each(data, (value, key) => {
                record[key] = value;
            });
            await record.save();
            if (data.notes) {
                await record.log(auth.user, { message: data.notes, type: 'NOTE' });
            }
            await record.log(auth.user, {
                message: `<strong>${auth.user.name}</strong> modified the status to <span>${data.status}</span>`,
                type: 'STATUS',
            });
            return response.json({ message: `Status changed to ${data.status}` });
        }
        catch (exception) {
            return response.internalServerError({ mesasge: exception.message });
        }
    }
    async save({ request, auth, response }, record = null) {
        try {
            let data = request.only([
                'customer_name',
                'order_id',
                'issue_type',
                'phone',
                'more_info',
                'sales_id',
                'priority',
                'image',
            ]);
            let rules = {
                customer_name: 'required',
                order_id: 'required|numeric',
                issue_type: 'required',
                phone: 'required|max:10',
                priority: 'required',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let imgSchema = Validator_1.schema.create({
                image_file: Validator_1.schema.file.optional({
                    size: '10mb',
                    extnames: ['jpeg', 'jpg', 'jfif'],
                }),
            });
            let payload = await request.validate({ schema: imgSchema });
            if (payload.image_file) {
                data.image = await (0, upload_1.fileUploadToS3)(payload.image_file.extname, payload.image_file);
            }
            let supportTicket = record;
            if (record === null) {
                supportTicket = new SupportTicket_1.default();
                supportTicket.status = 'Unassigned';
            }
            each(data, (value, key) => {
                supportTicket[key] = value;
            });
            supportTicket.created_by = auth.user.id;
            await supportTicket.save();
            return response.json({
                message: `Support Ticket ${record ? 'Updated' : 'Created'} Successfully`,
                id: supportTicket.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = SupportTicketsController;
//# sourceMappingURL=SupportTicketsController.js.map