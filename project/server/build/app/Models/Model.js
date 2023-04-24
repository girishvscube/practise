"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const Orm_1 = global[Symbol.for('ioc.use')]("Adonis/Lucid/Orm");
class Model extends Orm_1.BaseModel {
    async getLogs() {
        const { default: Log } = await Promise.resolve().then(() => __importStar(global[Symbol.for('ioc.use')]('App/Models/Log')));
        return Log.query()
            .preload('user', (query) => {
            query.select('id', 'name', 'image');
        })
            .where('model_id', this.id)
            .where('model', this.constructor.name)
            .orderBy('id', 'desc');
    }
    async log(user, { message = '', type = 'ACTION' }) {
        const model = this;
        if (message === null) {
            message = ` ${model.created_by === model.updated_by ? 'created' : 'updated'} `;
        }
        const { default: Log } = await Promise.resolve().then(() => __importStar(global[Symbol.for('ioc.use')]('App/Models/Log')));
        await Log.create({
            model_id: model.id,
            model: model.constructor.name,
            user_id: user.id,
            message,
            type,
        });
    }
}
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Model.prototype, "id", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Model.prototype, "created_by", void 0);
__decorate([
    (0, Orm_1.column)(),
    __metadata("design:type", Number)
], Model.prototype, "updated_by", void 0);
__decorate([
    (0, Orm_1.computed)(),
    __metadata("design:type", Object)
], Model.prototype, "logs", void 0);
exports.default = Model;
//# sourceMappingURL=Model.js.map