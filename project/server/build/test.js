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
require("reflect-metadata");
const execa_1 = __importDefault(require("execa"));
const path_1 = require("path");
const get_port_1 = __importDefault(require("get-port"));
const japa_1 = require("japa");
const source_map_support_1 = __importDefault(require("source-map-support"));
process.env.NODE_ENV = 'test';
process.env.ADONIS_ACE_CWD = (0, path_1.join)(__dirname);
source_map_support_1.default.install({ handleUncaughtExceptions: false });
async function runMigrations() {
    await execa_1.default.node('ace', ['migration:run'], {
        stdio: 'inherit',
    });
}
async function seedTempData() {
    await execa_1.default.node('ace', ['db:seed'], {
        stdio: 'inherit',
    });
}
async function rollbackMigrations() {
    await execa_1.default.node('ace', ['migration:rollback'], {
        stdio: 'inherit',
    });
}
async function startHttpServer() {
    const { Ignitor } = await Promise.resolve().then(() => __importStar(require('@adonisjs/core/build/src/Ignitor')));
    process.env.PORT = String(await (0, get_port_1.default)());
    await new Ignitor(__dirname).httpServer().start();
}
(0, japa_1.configure)({
    files: ['tests/**/*.spec.ts'],
    before: [runMigrations, seedTempData, startHttpServer],
    after: [rollbackMigrations],
});
//# sourceMappingURL=test.js.map