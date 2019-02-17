"use strict";
/**
 * @file      /src/handlers/database.ts
 *
 * @brief     Main database module
 *
 * @date      06-09-2018
 * @author    Adrian Leren, Ole Fredrik Borgundvåg Berg
 *
 * @copyright IT1901 - Group 7, 2018
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../config"));
class Database {
    constructor() { }
    /**
     * Connect with db
     *
     * @memberof Database
     */
    connect() {
        mongoose_1.default.connect(config_1.default.mongo.uri, { useNewUrlParser: true });
        mongoose_1.default.connection.on('error', function (err) {
            console.error(`MongoDB connection error: ${err}`);
            process.exit(-1); // eslint-disable-line no-process-exit
        });
    }
}
exports.default = Database;
