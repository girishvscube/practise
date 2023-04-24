"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const leadSource_1 = global[Symbol.for('ioc.use')]("App/Helpers/leadSource");
const leadStatus_1 = global[Symbol.for('ioc.use')]("App/Helpers/leadStatus");
const Lead_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Lead"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
const moment_1 = __importDefault(require("moment"));
class LeadsController {
    async count({ request, response }) {
        try {
            let data = await Lead_1.default.count(request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async options({ response }) {
        return response.json({ status: leadStatus_1.LEAD_STATUS, source: leadSource_1.LEAD_SOURCE });
    }
    async index({ request, response, auth }) {
        try {
            let user = await User_1.default.query().where('id', auth.user.id).preload('role').first();
            let data = await Lead_1.default.listing(request, user);
            return response.send(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async store(ctx) {
        return await this.save(ctx);
    }
    async show({ request, response }) {
        try {
            let lead = await Lead_1.default.query()
                .preload('user', (query) => {
                query.select('name');
            })
                .preload('userObj', (query) => {
                query.select('name as created_by');
            })
                .where('id', request.param('id'))
                .first();
            if (!lead) {
                return response.notFound({ message: `Lead Not Found` });
            }
            lead.logs = await lead.getLogs();
            return response.json(lead);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { lead } = ctx.request;
        return this.save(ctx, lead);
    }
    async updateStatus({ request, response, auth }) {
        try {
            const lead = request.lead;
            const data = request.only(['status', 'assigned_to', 'callback_time', 'notes']);
            const rules = {
                status: 'required',
                notes: 'required|max:500',
            };
            if (data.status === 'CALL_BACK') {
                rules['callback_time'] = 'required|date';
            }
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            lead.status = data.status;
            await lead.save();
            await Promise.all([
                lead.log(auth.user, { message: data.notes, type: 'NOTE' }),
                lead.log(auth.user, {
                    message: `<strong>${auth.user.name}</strong> modified the status to <span>${data.status}</span>`,
                    type: 'STATUS',
                }),
            ]);
            return response.json({ message: `Status changed to ${lead.status}` });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async reassignLeadRequest({ request, response, auth }) {
        try {
            const lead = request.lead;
            const rules = {
                notes: 'required|max:500',
            };
            const data = request.only(['notes']);
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            lead.is_reassign_req = true;
            lead.status = 'EXE_CANCELLED';
            lead.re_assign_notes = data.notes;
            lead.assigned_to = null;
            lead.re_assign_date = (0, moment_1.default)().utcOffset('+05:30').format('YYYY-MM-DD HH:mm:ss');
            await lead.save();
            await lead.log(auth.user, { message: `request for lead re-assign`, type: 'ACTION' });
            await lead.log(auth.user, { message: data.notes, type: 'NOTE' });
            response.json({ message: 'Re-assign requested is created!' });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async assignLead({ request, response, auth }) {
        try {
            const lead = request.lead;
            const data = request.only(['assigned_to']);
            const rules = {
                assigned_to: 'required|numeric',
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            let user = await User_1.default.find(request.body().assigned_to);
            if (!user) {
                return response.badRequest({ message: 'Sales Executive Doesnt exists' });
            }
            lead.assigned_to = request.body().assigned_to;
            lead.is_reassign_req = false;
            lead.status = 'ASSIGNED';
            lead.re_assign_notes = '';
            lead.re_assign_date = null;
            await lead.save();
            await lead.log(auth.user, {
                message: `assigned to ${user.name}`,
                type: 'ACTION',
            });
            response.json({ message: `Lead is assigned to ${user.name}.` });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async save({ request, response, auth }, record = null) {
        try {
            const data = request.only([
                'company_name',
                'company_phone',
                'email',
                'contact_person_name',
                'contact_person_phone',
                'industry_type',
                'fuel_usage_per_month',
                'source',
                'assigned_to',
                'address',
                'city',
                'state',
                'pincode',
                'is_reassign_req',
                'callback_time',
            ]);
            const rules = {
                company_name: 'required|max:100',
                company_phone: 'required|max:10|min:10',
                email: 'email|max:225',
                contact_person_name: 'required|max:100',
                contact_person_phone: 'max:10|min:10',
                industry_type: 'required|string',
                fuel_usage_per_month: 'numeric',
                source: 'required',
                address: 'max:500',
                city: 'max:50',
                state: 'max:100',
                pincode: 'max:6|min:6',
            };
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            if (auth)
                data.status = data.assigned_to ? 'ASSIGNED' : 'UN_ASSIGNED';
            let lead = record;
            if (record === null) {
                lead = new Lead_1.default();
                lead.created_by = auth.user.id;
            }
            each(data, (value, key) => {
                if (value)
                    lead[key] = value;
            });
            await lead.save();
            response.json({
                message: `Lead ${record ? 'Updated' : 'Created'} Successfully`,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = LeadsController;
//# sourceMappingURL=LeadsController.js.map