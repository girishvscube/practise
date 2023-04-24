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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Seeder_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Seeder"));
const Application_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Application"));
class default_1 extends Seeder_1.default {
    async runSeeder(Seeder) {
        if (Seeder.default.developmentOnly && !Application_1.default.inDev) {
            return;
        }
    }
    async run() {
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../Role'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../User'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../Equipment'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../IndustryType'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../TimeSlot'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../CreditNetDue'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../PaymentTerm'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../ParkingStation'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../Bowser'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../Supplier'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../BankAccount'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../Customer'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../CustomerPoc'))));
        await this.runSeeder(await Promise.resolve().then(() => __importStar(require('../CustomerDeliveryDetail'))));
    }
}
exports.default = default_1;
//# sourceMappingURL=Index.js.map