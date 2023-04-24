import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BOWSER_TYPE } from 'App/Helpers/bowser.constant'
import { fileUploadToS3 } from 'App/Helpers/upload'
import Bowser from 'App/Models/Bowser'
import BowserDriver from 'App/Models/BowserDriver'
import User from 'App/Models/User'
import { DateTime } from 'luxon'
import Validator from 'validatorjs'
const { each } = require('lodash')
import { schema } from '@ioc:Adonis/Core/Validator'
import TripScheduleLog from 'App/Models/TripScheduleLog'

export default class BowsersController {
    public async type({ response }: HttpContextContract) {
        return response.json(BOWSER_TYPE)
    }
    /**
     * @response
     */
    public async count({ response }: HttpContextContract) {
        try {
            let data = await Bowser.count()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    /**
     * @response
     */
    public async dropdown({ response }: HttpContextContract) {
        try {
            let data = await Bowser.dropdown()
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
    /**
     * @request
     * @response
     */
    public async index({ request, response }: HttpContextContract) {
        try {
            let bowsers = await Bowser.listing(request.qs())
            return response.send(bowsers)
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
            let bowser = await Bowser.query()
                .preload('driver')
                .preload('parkingstation')
                .where('id', request.param('id'))
                .first()
            if (!bowser) {
                return response.notFound({ message: `Bowser Not Found` })
            }

            bowser!.logs = await bowser!.getLogs()
            return response.json(bowser)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx
     */
    public async update(ctx) {
        const { bowser } = ctx.request
        return this.save(ctx, bowser)
    }

    /**
     * @param ctx
     */
    public async updateStatus({ request, response, auth }) {
        const bowser = request.bowser as Bowser
        let data = request.body()
        const rules: any = {
            status: 'required',
            notes: 'string|max:500',
        }
        const validation = new Validator(data, rules)
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors)
        }
        bowser.status = data.status
        await bowser.save()
        if (data.notes) {
            await bowser.log(auth.user, { message: data.notes, type: 'NOTE' })
        }
        await bowser.log(auth.user, {
            message: `<strong>${auth.user.name}</strong> modified the status to <span>${data.status}</span>`,
            type: 'STATUS',
        })

        return response.json({
            message: `Bowser status changed to ${data.status}`,
        })
    }

    /**
     * @param ctx driver deatails
     */
    public async getDriverLogs({ request, response }) {
        try {
            let data = await BowserDriver.listing(request.params().id, request.qs())
            return response.send(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * @param ctx trip schedule details by bowser id
     */
    public async tripDetails({ request, response }: HttpContextContract) {
        try {
            let id = request.params().id
            let data = await TripScheduleLog.listingById(id, request.qs())
            return response.json(data)
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    /**
     * assign driver
     * @param request params: bowser_id, payload: driver_id
     * @param response
     */
    public async assignDriver({ request, auth, response }: HttpContextContract) {
        try {
            await BowserDriver.updateOrCreate(
                { status: 'ASSIGNED' },
                { status: '', end_time: DateTime.now() }
            )
            let id = request.params().id as number
            let driver_id = request.body().driver_id
            let user = await User.query().where('id', driver_id).first()
            let bowserDriver = new BowserDriver()
            bowserDriver.bowser_id = id
            let bowser = await Bowser.find(bowserDriver.bowser_id)
            bowser!.last_driver_id = driver_id
            await bowser!.save()
            bowserDriver.start_time = DateTime.now()
            bowserDriver.user_id = driver_id
            bowserDriver.status = 'ASSIGNED'
            bowserDriver = await bowserDriver.save()
            await bowserDriver.log(auth.user, {
                message: `Assigned bowser to  ${user!.name}!`,
                type: 'ACTION',
            })
            return response.send({ message: 'Driver Assigned Successfully!', data: bowserDriver })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }

    private async save(
        { request, auth, response }: HttpContextContract,
        record: Bowser | null = null
    ) {
        try {
            const data = request.only([
                'name',
                'registration_no',
                'fuel_capacity',
                'image',
                'registration',
                'registration_validity',
                'registration_validity_check',
                'pollution_cert',
                'pollution_cert_validity',
                'pollution_cert_validity_check',
                'vehicle_fitness',
                'vehicle_fitness_validity',
                'vehicle_fitness_validity_check',
                'heavy_vehicle',
                'heavy_vehicle_validity',
                'heavy_vehicle_validity_check',
                'other_doc',
                'other_doc_validity',
                'other_doc_validity_check',
                'parking_station_id',
            ]) as any
            const rules: any = {
                name: 'required|max:100',
                registration_no: 'required',
                fuel_capacity: 'required|numeric',
                parking_station_id: 'required|numeric',
                registration_validity_check: 'boolean',
                pollution_cert_validity_check: 'boolean',
                vehicle_fitness_validity_check: 'boolean',
                heavy_vehicle_validity_check: 'boolean',
                other_doc_validity_check: 'boolean',
            }

            if (data['registration_validity_check'] === '1') {
                rules['registration_validity'] = 'required|date'
            }
            if (data['pollution_cert_validity_check'] === '1') {
                rules['pollution_cert_validity'] = 'required|date'
            }
            if (data['vehicle_fitness_validity_check'] === '1') {
                rules['vehicle_fitness_validity'] = 'required|date'
            }
            if (data['heavy_vehicle_validity_check'] === '1') {
                rules['heavy_vehicle_validity'] = 'required|date'
            }
            if (data['other_doc_validity_check'] === '1') {
                rules['other_doc_validity'] = 'required|date'
            }

            const validation = new Validator(request.all(), rules)
            if (validation.fails()) {
                return response.badRequest(validation.errors)
            }

            let imgSchema = schema.create({
                image_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif'],
                }),
                registration_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                pollution_cert_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                vehicle_fitness_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                heavy_vehicle_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                other_doc_file: schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
            })

            let payload = await request.validate({ schema: imgSchema })

            if (payload.image_file) {
                data.image = await fileUploadToS3(payload.image_file!.extname, payload.image_file)
            }

            if (payload.registration_file) {
                data.registration = await fileUploadToS3(
                    payload.registration_file!.extname,
                    payload.registration_file
                )
            }

            if (payload.pollution_cert_file) {
                data.pollution_cert = await fileUploadToS3(
                    payload.pollution_cert_file!.extname,
                    payload.pollution_cert_file
                )
            }

            if (payload.vehicle_fitness_file) {
                data.vehicle_fitness = await fileUploadToS3(
                    payload.vehicle_fitness_file!.extname,
                    payload.vehicle_fitness_file
                )
            }

            if (payload.heavy_vehicle_file) {
                data.heavy_vehicle = await fileUploadToS3(
                    payload.heavy_vehicle_file!.extname,
                    payload.heavy_vehicle_file
                )
            }
            if (payload.other_doc_file) {
                data.other_doc = await fileUploadToS3(
                    payload.other_doc_file!.extname,
                    payload.other_doc_file
                )
            }

            let checkBowser = await Bowser.findBy('name', data.name)
            let bowser: any = record
            if (
                (checkBowser && record === null) ||
                (record && checkBowser && record.id !== checkBowser.id)
            ) {
                return response.badRequest({ message: 'Bowser name already taken' })
            }
            if (record === null) {
                bowser = new Bowser()
            }
            each(data, (value, key) => {
                bowser[key] = value
            })
            bowser = await bowser.save()
            await bowser.log(auth.user, {
                message: `${record ? 'Updated' : 'Added'}  Bowser `,
                type: 'ACTION',
            })

            response.json({
                message: `Bowser ${record ? 'Updated' : 'Added'} `,
                id: bowser.id,
            })
        } catch (exception) {
            return response.internalServerError({ message: exception.message })
        }
    }
}
