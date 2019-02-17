"use strict";
/**
 * @file      /src/routes/api.ts
 *
 * @brief     API module
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
const express_1 = require("express");
const user_1 = __importDefault(require("./API/user"));
const auth_1 = __importDefault(require("./API/auth"));
const post_1 = __importDefault(require("./API/post"));
const comment_1 = __importDefault(require("./API/comment"));
/**
 * Class describing main application API.
 *
 * @export
 * @class API
 */
class API {
    constructor() {
        this.router = express_1.Router();
        this.router.use('/user', user_1.default);
        this.router.use('/auth', auth_1.default);
        this.router.use('/post', post_1.default);
        this.router.use('/comment', comment_1.default);
    }
    /**
     * Get a router that routes the elements from the API to the right endpoints.
     *
     * @returns {*} Instance of an Express Router
     * @memberof Router
     */
    getRouter() {
        return this.router;
    }
}
exports.default = API;
