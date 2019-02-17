"use strict";
/**
 * @file      /src/main.ts
 *
 * @brief     Main entry point
 *
 * @date      06-09-2018
 * @author    Adrian Leren
 *
 * @copyright IT1901 - Group 7, 2018
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./handlers/database"));
const router_1 = __importDefault(require("./handlers/router"));
const api_1 = __importDefault(require("./handlers/api"));
/**
 * Main class. Keeps track of instances and sets up application / server.
 *
 * @export
 * @class Main
 */
class Main {
    constructor() {
        this.router = new router_1.default();
        this.api = new api_1.default();
        this.database = new database_1.default();
        this.app = new app_1.default(this.database, this.router, this.api);
        this.server = new server_1.default(this.app);
        this.server.start();
    }
}
exports.Main = Main;
// RUN
new Main();
