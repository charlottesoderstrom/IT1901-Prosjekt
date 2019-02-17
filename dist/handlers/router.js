"use strict";
/**
 * @file      /src/routes/router.ts
 *
 * @brief     Main application router. This module points the application to the correct views for a given URL.
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
const config_1 = __importDefault(require("../config"));
/**
 * Class defining main application router.
 *
 * @export
 * @class Router
 */
class Router {
    constructor() {
        /* GET home page */
        this.index = (req, res) => {
            res.render('index', {
                user: req.user
            });
        };
        /* GET browse page */
        this.browse = (req, res) => {
            res.render('browse', {
                user: req.user,
                posts: req.posts
            });
        };
        /* GET profile page */
        this.profile = (req, res) => {
            res.render('profile', {
                user: req.user,
                posts: req.posts,
                possibleRoles: config_1.default.roles.slice(config_1.default.roles.indexOf(req.user.role) + 1)
            });
        };
        /* GET new page */
        this.newContent = (req, res) => {
            res.render('new', {
                user: req.user,
                possibleRoles: config_1.default.roles.slice(config_1.default.roles.indexOf(req.user.role) + 1),
                categories: config_1.default.categories,
                now: new Date()
            });
        };
        /* GET edit page */
        this.editContent = (req, res) => {
            res.render('edit', {
                user: req.user,
                categories: config_1.default.categories,
                post: req.post
            });
        };
        /* GET view single post by ID */
        this.viewContent = (req, res) => {
            res.render('view', {
                user: req.user,
                post: req.post
            });
        };
        /* Admin dashboard */
        this.adminDashboard = (req, res) => {
            res.render('admin', {
                user: req.user,
                requestingUsers: req.users
            });
        };
        /* GET work to be done for copy editors */
        this.work = (req, res) => {
            res.render('work', {
                user: req.user,
                posts: req.posts
            });
        };
    }
}
exports.default = Router;
