"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const standalone_1 = require("@adonisjs/auth/build/standalone");
class AuthMiddleware {
    constructor() {
        this.redirectTo = '/login';
    }
    async authenticate(request, auth, guards) {
        let guardLastAttempted;
        for (let guard of guards) {
            guardLastAttempted = guard;
            if (await auth.use(guard).check()) {
                const user = auth.user;
                if (!user.is_active) {
                    throw new standalone_1.AuthenticationException('Unauthorized access', 'User is disabled to login Please contact admin');
                }
                if (user.is_new_user && !request.matchesRoute(['/update-password'])) {
                    throw new standalone_1.AuthenticationException('Unauthorized access', 'User need to update temporary password');
                }
                auth.defaultGuard = guard;
                return true;
            }
        }
        throw new standalone_1.AuthenticationException('Unauthorized access', 'E_UNAUTHORIZED_ACCESS', guardLastAttempted, this.redirectTo);
    }
    async handle({ auth, request }, next, customGuards) {
        const guards = customGuards.length ? customGuards : [auth.name];
        await this.authenticate(request, auth, guards);
        await next();
    }
}
exports.default = AuthMiddleware;
//# sourceMappingURL=Auth.js.map