/**
 * @file      /src/routes/api.ts
 *
 * @brief     API module
 *
 * @date      06-09-2018
 * @author    Adrian Leren
 *
 * @copyright IT1901 - Group 7, 2018
 */

import { Request, Response } from 'express';


/**
 * Class describing main application API.
 *
 * @export
 * @class API
 */
export default class API {

	// GET BU ID
	public ping = (req: Request, res: Response) => {
		res.send('pong');
	};

}
