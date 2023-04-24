"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthMiddleware {
    async handle({ auth, response }, next) {
        try {
            await auth.use('api').authenticate();
        }
        catch (exception) {
            console.log(exception);
            return response.unauthorized({ message: 'Unauthorized access' });
        }
        await next();
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=AuthMiddleware.js.map