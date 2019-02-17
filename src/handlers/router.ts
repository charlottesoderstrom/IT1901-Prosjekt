/**
 * @file      /src/routes/router.ts
 *
 * @brief     Main application router. This module points the application to the correct views for a given URL.
 *
 * @date      06-09-2018
 * @author    Adrian Leren
 *
 * @copyright IT1901 - Group 7, 2018
 */

import { Request, Response } from 'express';


/**
 * Class defining main application router.
 *
 * @export
 * @class Router
 */
export default class Router {

	/* GET home page */
	public index = (req: Request, res: Response) => {
		res.render('index');
	};

}
