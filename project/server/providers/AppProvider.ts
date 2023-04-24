import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import geoip from 'geoip-lite'
import DeviceDetector = require('device-detector-js')

export default class AppProvider {
    constructor(protected app: ApplicationContract) {}

    public register() {
        // Register your own bindings
    }

    public async boot() {
        const HttpContext = this.app.container.use('Adonis/Core/HttpContext')
        HttpContext.getter(
            'location',
            function location() {
                const nginxRealIp = this.request.header('x-forwarded-for')
                let ip = nginxRealIp || this.request.ip()
                return geoip.lookup(ip)
            },
            true
        )

        HttpContext.getter(
            'device',
            function device() {
                const deviceDetector = new DeviceDetector()
                const UserAgent = this.request.header('User-Agent')
                return deviceDetector.parse(UserAgent || '')
            },
            true
        )

        // IoC container is ready
        const Response = this.app.container.use('Adonis/Core/Response')
        Response.macro('json', function (data) {
            this.status(200).send({ status: true, data })
        })

        Response.macro('notFound', function (errors) {
            this.status(404).send({ status: false, errors })
        })

        Response.macro('badRequest', function (errors) {
            this.status(400).send({ status: false, errors })
        })

        Response.macro('unauthorized', function (errors) {
            this.status(401).send({ status: false, errors })
        })

        Response.macro('notAcceptable', function (errors) {
            this.status(406).send({ status: false, errors })
        })

        Response.macro('created', function (data = {}) {
            this.status(201).send({ status: true, data })
        })

        Response.macro('noContent', function (data = {}) {
            this.status(204).send({ status: true, data })
        })

        Response.macro('forbidden', function (data = {}) {
            this.status(403).send({ status: false, data })
        })
        Response.macro('internalServerError', function (data = {}) {
            this.status(500).send({ status: false, data })
        })
    }

    public async ready() {
        // App is ready
    }

    public async shutdown() {
        // Cleanup, since app is going down
    }
}
