"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TicketIssue_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TicketIssue"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class TicketIssuesController {
    async index({ response }) {
        try {
            let data = await TicketIssue_1.default.listing();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async show({ request, response }) {
        try {
            let data = await TicketIssue_1.default.query().where('id', request.params().id).first();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.mesasge });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async update(ctx) {
        let ticketissue = ctx.request.ticketissue;
        return await this.save(ctx, ticketissue);
    }
    async destroy(ctx) {
        try {
            let ticketissue = ctx.request.ticketissue;
            await ticketissue.delete();
            if (ticketissue.$isDeleted) {
                return ctx.response.json({ message: 'Issue Deleted ' });
            }
            else {
                return ctx.response.json({ message: 'Issue Deletion Failed' });
            }
        }
        catch (exception) {
            return ctx.response.internalServerError({ message: exception.mesasge });
        }
    }
    async save({ request, response }, record = null) {
        try {
            let data = request.only(['name']);
            let rules = {
                name: 'required',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let ticket_issue = record;
            if (record === null) {
                ticket_issue = new TicketIssue_1.default();
            }
            ticket_issue.name = data.name;
            ticket_issue = await ticket_issue.save();
            return response.json({
                message: ` Issue ${record === null ? 'Added' : 'Updated'}!`,
                id: ticket_issue.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = TicketIssuesController;
//# sourceMappingURL=TicketIssuesController.js.map