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

import http from 'http';

import ExpressApp from './app';


/**
 * Main server class. This class initializes and runs the node server on port 3000.
 *
 * @export
 * @class Server
 */
export default class Server {

	private port: string = '3000';
	private server: http.Server;
	private app: ExpressApp;


	/**
	 * Creates an instance of Server
	 *
	 * @param {ExpressApp} app The express app to base this instance on
	 * @memberof Server
	 */
	constructor(app: ExpressApp) {
		this.app = app;
		this.server = http.createServer(this.app.getExpress());
		this.app.getExpress().set('port', this.port);
	}


	/**
	 * Start this Server instance and listen on port 3000
	 *
	 * @memberof Server
	 */
	public start(): void {
		// Start Express server.
		this.server.listen(this.app.getExpress().get('port'), () => {
			console.log(
				'App is running at http://localhost:%d in %s mode',
				this.app.getExpress().get('port'),
				this.app.getExpress().get('env')
			);
		});
	}


	/**
	 * Stop this server
	 *
	 * @memberof Server
	 */
	public stop(): void {
		this.server.close();
	}


	/**
	 * Get this Server instance
	 *
	 * @returns {http.Server} Instance of Server
	 * @memberof Server
	 */
	public getServer(): http.Server {
		return this.server;
	}
}
