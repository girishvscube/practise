"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const DeviceDetector = require("device-detector-js");
class AppProvider {
    constructor(app) {
        this.app = app;
    }
    register() {
    }
    async boot() {
        const HttpContext = this.app.container.use('Adonis/Core/HttpContext');
        HttpContext.getter('location', function location() {
            const nginxRealIp = this.request.header('x-forwarded-for');
            let ip = nginxRealIp || this.request.ip();
            return geoip_lite_1.default.lookup(ip);
        }, true);
        HttpContext.getter('device', function device() {
            const deviceDetector = new DeviceDetector();
            const UserAgent = this.request.header('User-Agent');
            return deviceDetector.parse(UserAgent || '');
        }, true);
        const Response = this.app.container.use('Adonis/Core/Response');
        Response.macro('json', function (data) {
            this.status(200).send({ status: true, data });
        });
        Response.macro('notFound', function (errors) {
            this.status(404).send({ status: false, errors });
        });
        Response.macro('badRequest', function (errors) {
            this.status(400).send({ status: false, errors });
        });
        Response.macro('unauthorized', function (errors) {
            this.status(401).send({ status: false, errors });
        });
        Response.macro('notAcceptable', function (errors) {
            this.status(406).send({ status: false, errors });
        });
        Response.macro('created', function (data = {}) {
            this.status(201).send({ status: true, data });
        });
        Response.macro('noContent', function (data = {}) {
            this.status(204).send({ status: true, data });
        });
        Response.macro('forbidden', function (data = {}) {
            this.status(403).send({ status: false, data });
        });
        Response.macro('internalServerError', function (data = {}) {
            this.status(500).send({ status: false, data });
        });
    }
    async ready() {
    }
    async shutdown() {
    }
}
exports.default = AppProvider;
//# sourceMappingURL=AppProvider.js.map