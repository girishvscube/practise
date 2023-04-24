import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'
import RoleModule from 'App/Models/RoleModule'
import User from 'App/Models/User'
import Validator from 'validatorjs'

export default class RoleController {
    /**
     * ROLES DROP DOWN LIST
     * @param request
     * @param response
     */
    public async rolesDropdown({ response }) {
        try {
            let roles: any = await Role.dropdown()
            return response.json(roles)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    public async index({ request, response }) {
        try {
            let modules = await RoleModule.query().where({}).select('id', 'name', 'slug', 'parent_id')
            let roles: any = await Role.listing(request)
            return response.send({ status: true, data: roles, modules: modules })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async store(ctx: HttpContextContract) {
        return await this.save(ctx)
    }

    /**
     * @param request
     * @param response
     */
    public async show({ request, response }) {
        try {
            let role: any = request.role
            return response.json(role)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { role } = ctx.request
        return this.save(ctx, role)
    }

    private async save({ request, response }: HttpContextContract, record: Role | null = null) {
        try {
            const data = request.only(['name', 'is_manager', 'permissions'])
            const rules: any = {
                name: 'required|max:100',
                is_manager: 'required',
                permissions: 'required|array'
            }

            const validation = new Validator(data, rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            const roleNameExists = await Role.query().where('name', data.name).first()

            let role: Role = record as any
            if (record === null) {
                role = new Role()
            }
            data['slug'] = record ? record.slug : data.name.toLowerCase().replace(' ', '_')
            if (roleNameExists && roleNameExists.id !== role.id) {
                return response.badRequest({
                    message: 'Role name already exists',
                })
            }

            role['name'] = data.name;
            role['is_manager'] = data.is_manager;
            role['slug'] = data['slug'];
            await role.save()


            if (record) {
                await role.load('permissions');
                let savedPermissions = role.permissions
                let ids = savedPermissions.map(x => x.id)
                if(ids.length)
                await Permission.query().whereIn("id", ids).delete();
            }

            let permissions = data.permissions.map(x => {
                x['role_id'] = role.id;
                return x
            })
            await Permission.createMany(permissions)
            return response.json({ message: `Role ${record ? 'Updated' : 'Created'} Successfully` })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }


    public async destroy({ request, response }) {
        try {
            let id = request.param('id')
            let users = await User.findBy('role_id', id)
            if (users) {
                return response.badRequest({ message: `You can't delete the role. its assign to users` })
            }

            await Role.query().where('id', id).update('is_deleted', 1)
            return response.json({ message: `Role Deleted Successfully` })

        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
