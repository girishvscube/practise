"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Schema_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Schema"));
class default_1 extends Schema_1.default {
    constructor() {
        super(...arguments);
        this.tableName = 'bowsers';
    }
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.string('registration_no').notNullable();
            table.integer('last_trip_id').nullable();
            table.integer('fuel_capacity').notNullable();
            table.integer('fuel_left').notNullable().defaultTo(0);
            table.string('image').nullable();
            table.string('registration').nullable();
            table.timestamp('registration_validity').nullable();
            table.string('pollution_cert').nullable();
            table.timestamp('pollution_cert_validity').nullable();
            table.string('vehicle_fitness').nullable();
            table.timestamp('vehicle_fitness_validity').nullable();
            table.string('heavy_vehicle').nullable();
            table.timestamp('heavy_vehicle_validity').nullable();
            table.string('other_doc').nullable();
            table.timestamp('other_doc_validity').nullable();
            table
                .integer('last_driver_id')
                .nullable()
                .unsigned()
                .references('id')
                .inTable('users')
                .defaultTo(null);
            table
                .integer('parking_station_id')
                .nullable()
                .unsigned()
                .references('id')
                .inTable('parking_stations');
            table.string('status').notNullable().defaultTo('AVAILABLE');
            table.timestamps();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
exports.default = default_1;
//# sourceMappingURL=1663590111730_bowsers.js.map