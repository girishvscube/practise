"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Permission_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Permission"));
const Role_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Role"));
const RoleModule_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/RoleModule"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const validatorjs_1 = __importDefault(require("validatorjs"));
class RoleController {
    async rolesDropdown({ response }) {
        try {
            let roles = await Role_1.default.dropdown();
            return response.json(roles);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let modules = await RoleModule_1.default.query().where({}).select('id', 'name', 'slug', 'parent_id');
            let roles = await Role_1.default.listing(request);
            return response.send({ status: true, data: roles, modules: modules });
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
            let role = request.role;
            return response.json(role);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { role } = ctx.request;
        return this.save(ctx, role);
    }
    async save({ request, response }, record = null) {
        try {
            const data = request.only(['name', 'is_manager', 'permissions']);
            const rules = {
                name: 'required|max:100',
                is_manager: 'required',
                permissions: 'required|array'
            };
            const validation = new validatorjs_1.default(data, rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors);
            }
            const roleNameExists = await Role_1.default.query().where('name', data.name).first();
            let role = record;
            if (record === null) {
                role = new Role_1.default();
            }
            data['slug'] = record ? record.slug : data.name.toLowerCase().replace(' ', '_');
            if (roleNameExists && roleNameExists.id !== role.id) {
                return response.badRequest({
                    message: 'Role name already exists',
                });
            }
            role['name'] = data.name;
            role['is_manager'] = data.is_manager;
            role['slug'] = data['slug'];
            await role.save();
            if (record) {
                await role.load('permissions');
                let savedPermissions = role.permissions;
                let ids = savedPermissions.map(x => x.id);
                if (ids.length)
                    await Permission_1.default.query().whereIn("id", ids).delete();
            }
            let permissions = data.permissions.map(x => {
                x['role_id'] = role.id;
                return x;
            });
            await Permission_1.default.createMany(permissions);
            return response.json({ message: `Role ${record ? 'Updated' : 'Created'} Successfully` });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async destroy({ request, response }) {
        try {
            let id = request.param('id');
            let users = await User_1.default.findBy('role_id', id);
            if (users) {
                return response.badRequest({ message: `You can't delete the role. its assign to users` });
            }
            await Role_1.default.query().where('id', id).update('is_deleted', 1);
            return response.json({ message: `Role Deleted Successfully` });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = RoleController;
//# sourceMappingURL=RoleController.js.map