"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const morgan_1 = __importDefault(require("morgan"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const errorhandler_1 = __importDefault(require("errorhandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./config"));
const auth_controller_1 = __importDefault(require("./handlers/API/auth/auth.controller"));
const post_controller_1 = __importDefault(require("./handlers/API/post/post.controller"));
const user_controller_1 = __importDefault(require("./handlers/API/user/user.controller"));
/**
 * Main application class. Sets up express app instance and sets express settings and middleware.
 *
 * @export
 * @class ExpressApp
 */
class ExpressApp {
    constructor(database, router, api) {
        this.expressApp = express_1.default();
        // Database setup
        this.database = database;
        this.database.connect();
        // View engine setup
        this.expressApp.set('views', path_1.default.join(__dirname, 'views'));
        this.expressApp.set('view engine', 'njk');
        nunjucks_1.default.configure(this.expressApp.get('views'), {
            autoescape: true,
            express: this.expressApp
        });
        // Express settings
        this.expressApp.use(morgan_1.default('dev'));
        this.expressApp.use(express_1.default.json());
        this.expressApp.use(express_1.default.urlencoded({ extended: true }));
        this.expressApp.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
        this.expressApp.use(errorhandler_1.default());
        this.expressApp.use(cookie_parser_1.default(config_1.default.cookieSecret));
        this.router = router;
        this.api = api;
        // Routes
        this.expressApp.get('/', auth_controller_1.default.appendUser, auth_controller_1.default.redirectIfLoggedIn('/browse'), this.router.index);
        this.expressApp.get('/browse', auth_controller_1.default.appendUser, post_controller_1.default.appendPosts, this.router.browse);
        this.expressApp.get('/profile', auth_controller_1.default.appendUser, post_controller_1.default.appendPostsByUser, this.router.profile);
        this.expressApp.get('/new', auth_controller_1.default.appendUser, this.router.newContent);
        this.expressApp.get('/edit/:id', auth_controller_1.default.appendUser, post_controller_1.default.appendPostById, this.router.editContent);
        this.expressApp.get('/view/:id', auth_controller_1.default.appendUser, post_controller_1.default.appendPostById, this.router.viewContent);
        this.expressApp.get('/admin', auth_controller_1.default.appendUser, auth_controller_1.default.hasRole('admin'), user_controller_1.default.appendUsersRequestingRoles, this.router.adminDashboard);
        this.expressApp.get('/work', auth_controller_1.default.appendUser, post_controller_1.default.appendPosts, this.router.work);
        // API
        this.expressApp.use('/api', this.api.getRouter());
    }
    /**
     * Get this express app instance
     *
     * @returns {*} Instance of an Express application
     * @memberof ExpressApp
     */
    getExpress() {
        return this.expressApp;
    }
}
exports.default = ExpressApp;
