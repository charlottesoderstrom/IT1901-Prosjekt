"use strict";
/**
 * @file	  /src/handlers/API/auth/auth.controller.ts
 *
 * @brief	  All backend logic for user authentication.
 *
 * @date	  09-09-2018
 * @author	  Ole Fredrik Borgundvåg Berg
 *
 * @copyright IT1901 - Group 7, 2018
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("./../user/user.model"));
const user_controller_1 = __importDefault(require("./../user/user.controller"));
const config_1 = __importDefault(require("./../../../config"));
class AuthController {
    constructor() {
        /**
         *  Given an email and a password, authenticates the user. Then he user is given a cookie
         * that connects the user session to a user in the database.
         */
        this.authenticateUser = (req, res) => {
            if (!req.body.email || !req.body.password) {
                return res.status(422).end();
            }
            user_model_1.default.findOne({ 'email': req.body.email }).exec()
                .then(user => {
                if (!user) {
                    return res.status(404).end();
                }
                return user.authenticate(req.body.password, (err, authenticated) => {
                    if (err) {
                        throw err;
                    }
                    if (!authenticated) {
                        return res.status(401).end();
                    }
                    user.generateToken((salt) => {
                        res.cookie('sessionId', salt);
                        return res.status(200).end();
                    });
                });
            })
                .catch((error) => {
                return res.status(500).end();
            });
        };
        /**
         * Helper-function. Can be used in router to append the user to req.body.user
         */
        this.appendUser = (req, res, next) => {
            const token = req.cookies.sessionId;
            if (!token) {
                return next();
            }
            user_controller_1.default.getUserByToken(token, (user) => {
                if (!user) {
                    return next();
                }
                else {
                    req.user = user;
                    return next();
                }
            });
        };
        /**
         * Helper-function. Checks if the user has at least the role necessary
         */
        this.hasRole = (role) => {
            return (req, res, next) => {
                if (!req.user) {
                    return res.status(401).end();
                }
                if (config_1.default.roles.indexOf(req.user.role) < config_1.default.roles.indexOf(role)) {
                    return res.status(403).end();
                }
                return next();
            };
        };
        /**
         * Redirects user if logged in
         */
        this.redirectIfLoggedIn = (newUrl) => {
            return (req, res, next) => {
                if (req.user) {
                    return res.redirect(newUrl);
                }
                return next();
            };
        };
        /**
         * Temporary function. Responds req.body.user to the HTTP request.
         */
        this.seeUser = (req, res, next) => {
            if (!req.user) {
                return res.status(403).end();
            }
            return res.json(req.user);
        };
    }
}
exports.default = new AuthController();
