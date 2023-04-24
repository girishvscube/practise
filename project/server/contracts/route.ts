declare module '@ioc:Adonis/Core/Route' {
    interface RouteContract {
        validate(className): this
    }
}
