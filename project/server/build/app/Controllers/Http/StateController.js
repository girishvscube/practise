"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = global[Symbol.for('ioc.use')]("App/Helpers/utils");
class StateController {
    async dropdown({ response }) {
        return response.json(utils_1.statesList);
    }
}
exports.default = StateController;
//# sourceMappingURL=StateController.js.map