"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bowser_constant_1 = global[Symbol.for('ioc.use')]("App/Helpers/bowser.constant");
const upload_1 = global[Symbol.for('ioc.use')]("App/Helpers/upload");
const Bowser_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Bowser"));
const BowserDriver_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/BowserDriver"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const luxon_1 = require("luxon");
const validatorjs_1 = __importDefault(require("validatorjs"));
const { each } = require('lodash');
const Validator_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Validator");
const TripScheduleLog_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/TripScheduleLog"));
class BowsersController {
    async type({ response }) {
        return response.json(bowser_constant_1.BOWSER_TYPE);
    }
    async count({ response }) {
        try {
            let data = await Bowser_1.default.count();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async dropdown({ response }) {
        try {
            let data = await Bowser_1.default.dropdown();
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async index({ request, response }) {
        try {
            let bowsers = await Bowser_1.default.listing(request.qs());
            return response.send(bowsers);
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
            let bowser = await Bowser_1.default.query()
                .preload('driver')
                .preload('parkingstation')
                .where('id', request.param('id'))
                .first();
            if (!bowser) {
                return response.notFound({ message: `Bowser Not Found` });
            }
            bowser.logs = await bowser.getLogs();
            return response.json(bowser);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async update(ctx) {
        const { bowser } = ctx.request;
        return this.save(ctx, bowser);
    }
    async updateStatus({ request, response, auth }) {
        const bowser = request.bowser;
        let data = request.body();
        const rules = {
            status: 'required',
            notes: 'string|max:500',
        };
        const validation = new validatorjs_1.default(data, rules);
        if (validation.fails()) {
            return response.badRequest(validation.errors.errors);
        }
        bowser.status = data.status;
        await bowser.save();
        if (data.notes) {
            await bowser.log(auth.user, { message: data.notes, type: 'NOTE' });
        }
        await bowser.log(auth.user, {
            message: `<strong>${auth.user.name}</strong> modified the status to <span>${data.status}</span>`,
            type: 'STATUS',
        });
        return response.json({
            message: `Bowser status changed to ${data.status}`,
        });
    }
    async getDriverLogs({ request, response }) {
        try {
            let data = await BowserDriver_1.default.listing(request.params().id, request.qs());
            return response.send(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async tripDetails({ request, response }) {
        try {
            let id = request.params().id;
            let data = await TripScheduleLog_1.default.listingById(id, request.qs());
            return response.json(data);
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async assignDriver({ request, auth, response }) {
        try {
            await BowserDriver_1.default.updateOrCreate({ status: 'ASSIGNED' }, { status: '', end_time: luxon_1.DateTime.now() });
            let id = request.params().id;
            let driver_id = request.body().driver_id;
            let user = await User_1.default.query().where('id', driver_id).first();
            let bowserDriver = new BowserDriver_1.default();
            bowserDriver.bowser_id = id;
            let bowser = await Bowser_1.default.find(bowserDriver.bowser_id);
            bowser.last_driver_id = driver_id;
            await bowser.save();
            bowserDriver.start_time = luxon_1.DateTime.now();
            bowserDriver.user_id = driver_id;
            bowserDriver.status = 'ASSIGNED';
            bowserDriver = await bowserDriver.save();
            await bowserDriver.log(auth.user, {
                message: `Assigned bowser to  ${user.name}!`,
                type: 'ACTION',
            });
            return response.send({ message: 'Driver Assigned Successfully!', data: bowserDriver });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
    async save({ request, auth, response }, record = null) {
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
            ]);
            const rules = {
                name: 'required|max:100',
                registration_no: 'required',
                fuel_capacity: 'required|numeric',
                parking_station_id: 'required|numeric',
                registration_validity_check: 'boolean',
                pollution_cert_validity_check: 'boolean',
                vehicle_fitness_validity_check: 'boolean',
                heavy_vehicle_validity_check: 'boolean',
                other_doc_validity_check: 'boolean',
            };
            if (data['registration_validity_check'] === '1') {
                rules['registration_validity'] = 'required|date';
            }
            if (data['pollution_cert_validity_check'] === '1') {
                rules['pollution_cert_validity'] = 'required|date';
            }
            if (data['vehicle_fitness_validity_check'] === '1') {
                rules['vehicle_fitness_validity'] = 'required|date';
            }
            if (data['heavy_vehicle_validity_check'] === '1') {
                rules['heavy_vehicle_validity'] = 'required|date';
            }
            if (data['other_doc_validity_check'] === '1') {
                rules['other_doc_validity'] = 'required|date';
            }
            const validation = new validatorjs_1.default(request.all(), rules);
            if (validation.fails()) {
                return response.badRequest(validation.errors);
            }
            let imgSchema = Validator_1.schema.create({
                image_file: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif'],
                }),
                registration_file: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                pollution_cert_file: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                vehicle_fitness_file: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                heavy_vehicle_file: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
                other_doc_file: Validator_1.schema.file.optional({
                    size: '5mb',
                    extnames: ['jpeg', 'jpg', 'jfif', 'pdf'],
                }),
            });
            let payload = await request.validate({ schema: imgSchema });
            if (payload.image_file) {
                data.image = await (0, upload_1.fileUploadToS3)(payload.image_file.extname, payload.image_file);
            }
            if (payload.registration_file) {
                data.registration = await (0, upload_1.fileUploadToS3)(payload.registration_file.extname, payload.registration_file);
            }
            if (payload.pollution_cert_file) {
                data.pollution_cert = await (0, upload_1.fileUploadToS3)(payload.pollution_cert_file.extname, payload.pollution_cert_file);
            }
            if (payload.vehicle_fitness_file) {
                data.vehicle_fitness = await (0, upload_1.fileUploadToS3)(payload.vehicle_fitness_file.extname, payload.vehicle_fitness_file);
            }
            if (payload.heavy_vehicle_file) {
                data.heavy_vehicle = await (0, upload_1.fileUploadToS3)(payload.heavy_vehicle_file.extname, payload.heavy_vehicle_file);
            }
            if (payload.other_doc_file) {
                data.other_doc = await (0, upload_1.fileUploadToS3)(payload.other_doc_file.extname, payload.other_doc_file);
            }
            let checkBowser = await Bowser_1.default.findBy('name', data.name);
            let bowser = record;
            if ((checkBowser && record === null) ||
                (record && checkBowser && record.id !== checkBowser.id)) {
                return response.badRequest({ message: 'Bowser name already taken' });
            }
            if (record === null) {
                bowser = new Bowser_1.default();
            }
            each(data, (value, key) => {
                bowser[key] = value;
            });
            bowser = await bowser.save();
            await bowser.log(auth.user, {
                message: `${record ? 'Updated' : 'Added'}  Bowser `,
                type: 'ACTION',
            });
            response.json({
                message: `Bowser ${record ? 'Updated' : 'Added'} `,
                id: bowser.id,
            });
        }
        catch (exception) {
            return response.internalServerError({ message: exception.message });
        }
    }
}
exports.default = BowsersController;
//# sourceMappingURL=BowsersController.js.map