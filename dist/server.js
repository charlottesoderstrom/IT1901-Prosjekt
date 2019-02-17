"use strict";
/**
 * @file      /src/server.ts
 *
 * @brief     Server module. This module starts and stop the main service.
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
const http_1 = __importDefault(require("http"));
/**
 * Main server class. This class initializes and runs the node server on port 3000.
 *
 * @export
 * @class Server
 */
class Server {
    /**
     * Creates an instance of Server
     *
     * @param {ExpressApp} app The express app to base this instance on
     * @memberof Server
     */
    constructor(app) {
        this.port = '3000';
        this.app = app;
        this.server = http_1.default.createServer(this.app.getExpress());
        this.app.getExpress().set('port', this.port);
    }
    /**
     * Start this Server instance and listen on port 3000
     *
     * @memberof Server
     */
    start() {
        this.server.listen(this.app.getExpress().get('port'), () => {
            console.log('App is running at http://localhost:%d in %s mode', this.app.getExpress().get('port'), this.app.getExpress().get('env'));
        });
    }
    /**
     * Stop this server
     *
     * @memberof Server
     */
    stop() {
        this.server.close();
    }
    /**
     * Get this Server instance
     *
     * @returns {http.Server} Instance of Server
     * @memberof Server
     */
    getServer() {
        return this.server;
    }
}
exports.default = Server;
