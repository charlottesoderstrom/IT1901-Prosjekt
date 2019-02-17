"use strict";
/**
 * @file	 /src/handlers/API/auth/index.ts
 *
 * @brief	 All backend logic for user authentication.
 *
 * @date	 09-09-2018
 * @author	 Ole Fredrik Borgundvåg Berg
 *
 * @copyright IT1901 - Group 7, 2018
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("./auth.controller"));
const express_1 = require("express");
const router = express_1.Router();
/**
 * POST '/api/auth/login' requires username and password given in the
 * body of the request. If the login information is valid, the user is
 * given a cookie that recognizes the login session.
 */
router.post('/login', auth_controller_1.default.authenticateUser);
/**
 * GET '/api/auth/debug' gives the information about the logged in user.
 * FOR DEBUG PURPOSES ONLY
 */
router.get('/debug', auth_controller_1.default.appendUser, auth_controller_1.default.seeUser);
exports.default = router;
