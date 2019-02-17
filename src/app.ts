/**
 * @file      /src/app.ts
 *
 * @brief     Express app module. Framework settings are set here.
 *
 * @date      06-09-2018
 * @author    Adrian Leren
 *
 * @copyright IT1901 - Group 7, 2018
 */

import express from 'express';
import path from 'path';
import morgan from 'morgan';
import nunjucks from 'nunjucks';
import errorHandler from 'errorhandler';

import Database from './handlers/database';
import Router from './handlers/router';
import API from './handlers/api';


/**
 * Main application class. Sets up express app instance and sets express settings and middleware.
 *
 * @export
 * @class ExpressApp
 */
export default class ExpressApp {

	private expressApp: any;
	private database: Database;
	private api: API;
	private router: Router;


	constructor(database: Database, router: Router, api: API) {
		this.expressApp = express();

		// Database setup
		this.database = database;
		/* Connect here when ready */

		// View engine setup
		this.expressApp.set('views', path.join(__dirname, 'views'));
		this.expressApp.set('view engine', 'njk');
		nunjucks.configure(this.expressApp.get('views'), {
			autoescape: true,
			express: this.expressApp
		});

		// Express settings
		this.expressApp.use(morgan('dev'));
		this.expressApp.use(express.json());
		this.expressApp.use(express.urlencoded({ extended: true }));
		this.expressApp.use(express.static(path.join(__dirname, 'public')));
		this.expressApp.use(errorHandler());

		this.router = router;
		this.api = api;

		// Routes
		this.expressApp.get('/', this.router.index);

		// API


	}


	/**
	 * Get this express app instance
	 *
	 * @returns {*} Instance of an Express application
	 * @memberof ExpressApp
	 */
	public getExpress(): any {
		return this.expressApp;
	}
}
