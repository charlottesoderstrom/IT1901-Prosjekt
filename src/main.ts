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

import Server from './server';
import ExpressApp from './app';
import Database from './handlers/database';
import Router from './handlers/router';
import API from './handlers/api';


/**
 * Main class. Keeps track of instances and sets up application / server.
 *
 * @export
 * @class Main
 */
export class Main {

	private server: Server;
	private app: ExpressApp;
	private router: Router;
	private api: API;
	private database: Database;


	constructor() {
		this.router = new Router();
		this.api = new API();

		this.database = new Database();

		this.app = new ExpressApp(this.database, this.router, this.api);
		this.server = new Server(this.app);


		this.server.start();
	}

}

// RUN
new Main();
