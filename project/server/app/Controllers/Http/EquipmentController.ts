import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Equipment from 'App/Models/Equipment'
import Validator from 'validatorjs'
const { each } = require('lodash')

export default class EquipmentController {
    /**
     * Equipment List DropDown
     * @param response
     */
    public async dropdown({ response }: HttpContextContract) {
        try {
            let equipmentList = await Equipment.dropdown()
            return response.json(equipmentList)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    public async index({ response }: HttpContextContract) {
        try {
            let equipmentList = await Equipment.listing()
            return response.json(equipmentList)
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
            let equipment: any = request.equipment
            return response.json(equipment)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { equipment } = ctx.request
        return this.save(ctx, equipment)
    }

    /**
     * @param ctx
     */
    public async destroy(ctx) {
        try {
            const equipment = ctx.request.equipment as Equipment
            await equipment.delete()
            if (equipment.$isDeleted) {
                return ctx.response.json({ message: `Equipment Deleted!` })
            } else {
                return ctx.response.badRequest({
                    message: `Something went wrong, Equipment was not Deleted!`,
                })
            }
        } catch (exception) {
            return ctx.response.internalServerError({ message: exception.message })
        }
    }

    private async save(
        { request, response }: HttpContextContract,
        record: Equipment | null = null
    ) {
        try {
            const data = request.only(['name']) as Equipment
            const rules: any = {
                name: 'required|max:50',
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors.errors)
            }

            const EquipmentNameExists = await Equipment.query().where('name', data.name).first()

            let equipment: Equipment = record as any
            if (record === null) {
                equipment = new Equipment()
            }

            if (EquipmentNameExists && EquipmentNameExists.id !== equipment.id) {
                return response.badRequest({
                    message: 'Equipment name already exists',
                })
            }

            each(data, (value, key) => {
                equipment[key] = value
            })
            await equipment.save()

            return response.json({
                message: `Equipment ${record ? 'Updated' : 'Created'} Successfully`,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
