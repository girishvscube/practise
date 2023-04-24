"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const japa_1 = __importDefault(require("japa"));
const supertest_1 = __importDefault(require("supertest"));
const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`;
japa_1.default.group('Hello World', () => {
    (0, japa_1.default)('sample testing', async (assert) => {
        const { body } = await (0, supertest_1.default)(BASE_URL).get('/').expect(200);
        assert.equal(body.message, 'Hello World');
    });
});
//# sourceMappingURL=helloworld.spec.js.map