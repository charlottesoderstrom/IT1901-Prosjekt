"use strict";
/**
 * @file      /src/handlers/API/user/user.controller.ts
 *
 * @brief     Handles communication to and from user table in database
 *
 * @date      08-09-2018
 * @author    Ole Fredrik Borgundvåg Berg, Adrian Leren
 *
 * @copyright IT1901 - Group 7, 2018
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("./user.model"));
const user_model_2 = require("./user.model");
const config_1 = __importDefault(require("../../../config"));
class UserController {
    constructor() {
        /**
         *  Returns the user with the given ID.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.getUser = (req, res) => {
            const userId = req.params.id;
            /*
             * Return 404 on invalid MongoDB-ids.
             */
            if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(404).end();
            }
            user_model_1.default.findById(userId).exec()
                .then(user => {
                if (!user) {
                    return res.status(404).end();
                }
                this.stripUser(user, (user) => {
                    return res.json(user);
                });
            })
                .catch((error) => {
                return res.status(500).end();
            });
        };
        /**
         *  Returns the current user.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.getCurrentUser = (req, res) => {
            if (!req.user) {
                return res.status(404).end();
            }
            this.stripUser(req.user, (user) => {
                return res.json(req.user);
            });
        };
        /**
         * Removes vulnerable information about the user.
         *
         * @param {IUserDocument} user
         * @param {any} callback
         * @return {void}
         * @api public
         */
        this.stripUser = (user, callback) => {
            // Remove vulnerable fields.
            user.password = undefined;
            user.salt = undefined;
            user.tokens = undefined;
            callback(user);
        };
        /**
         * Checks if the user is allowed to get information about the user.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.canGetUserInfo = (req, res, next) => {
            if (!req.user || (req.params.id != req.user._id && config_1.default.roles.indexOf(req.user.role) < config_1.default.roles.indexOf('admin'))) {
                return res.status(403).end();
            }
            return next();
        };
        /**
         * Inserts the user given by req.body into the database
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.insertUser = (req, res) => {
            const user = new user_model_1.default(req.body);
            user.save()
                .then(user => {
                user.generateToken((salt) => {
                    res.cookie('sessionId', salt);
                    return res.status(200).end();
                });
            })
                .catch((err) => {
                return res.status(422).send(err.message);
            });
        };
        /**
         * Gets the user by the token and calls the callback function with the user as argument.
         *
         * @param {string} token
         * @param {any} callback
         * @return {void}
         * @api public
         */
        this.getUserByToken = (token, callback) => {
            user_model_1.default.findOne({ tokens: user_model_2.hashToken(token) }).exec()
                .then(user => {
                callback(user);
            });
        };
        /**
         * Gets all users that has requested a role.
         *
         * @param {Request} req
         * @param {Response} res
         * @param {any} next
         * @return {void}
         * @api public
         */
        this.appendUsersRequestingRoles = (req, res, next) => {
            user_model_1.default.find({ requestedRole: { $ne: '' } }).exec()
                .then(users => {
                req.users = users;
                return next();
            })
                .catch((err) => {
                return res.status(500).send(err.message);
            });
        };
        /**
         * Refuses the user's current request.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.refuseRoleRequest = (req, res) => {
            const userId = req.params.id;
            /*
             * Return 404 on invalid MongoDB-ids.
             */
            if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(404).end();
            }
            user_model_1.default.findById(userId).exec()
                .then(user => {
                if (!user || user.requestedRole === '') {
                    return res.status(404).end();
                }
                user.requestedRole = '';
                user.save();
                return res.status(200).end();
            })
                .catch((err) => {
                return res.status(500).send(err.message);
            });
        };
        /**
         * Accepts the user's current request.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.acceptRoleRequest = (req, res) => {
            const userId = req.params.id;
            /*
             * Return 404 on invalid MongoDB-ids.
             */
            if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(404).end();
            }
            user_model_1.default.findById(userId).exec()
                .then(user => {
                if (!user || user.requestedRole === '') {
                    return res.status(404).end();
                }
                user.role = user.requestedRole;
                user.requestedRole = '';
                user.save();
                return res.status(200).end();
            })
                .catch((err) => {
                return res.status(500).send(err.message);
            });
        };
        /**
         * Sets a new role request
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.setRoleRequest = (req, res) => {
            if (!req.user) {
                return res.status(401).end();
            }
            const newRole = req.body.requestedRole;
            if (newRole === req.user.role) {
                return res.status(200).end();
            }
            if (!newRole || config_1.default.roles.indexOf(newRole) < 0) {
                return res.status(422).end();
            }
            req.user.requestedRole = newRole;
            req.user.save();
            return res.status(200).end();
        };
        /**
         * Sets the user's role.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.setRole = (req, res) => {
            const userId = req.params.id;
            /*
             * Return 404 on invalid MongoDB-ids.
             */
            if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(404).end();
            }
            const newRole = req.body.role;
            if (newRole === req.user.role) {
                return res.status(200).end();
            }
            if (!newRole || config_1.default.roles.indexOf(newRole) < 0) {
                return res.status(422).end();
            }
            user_model_1.default.findById(userId).exec()
                .then(user => {
                if (!user || user.requestedRole === '') {
                    return res.status(404).end();
                }
                user.role = newRole;
                if (user.requestedRole != '' && config_1.default.roles.indexOf(user.requestedRole) <= config_1.default.roles.indexOf(newRole)) {
                    user.requestedRole = '';
                }
                user.save();
                return res.status(200).end();
            })
                .catch((err) => {
                return res.status(500).send(err.message);
            });
        };
        /**
         * Returns users matching the search string.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.searchUser = (req, res) => {
            if (!req.query.search) {
                return res.json({ users: [] });
            }
            const search = req.query.search.replace(' ', '|');
            user_model_1.default.find({ $or: [{ email: { $regex: search, $options: 'i' } }, { firstname: { $regex: search, $options: 'i' } }, { lastname: { $regex: search, $options: 'i' } }] })
                .select('-password -tokens -salt')
                .exec()
                .then(users => {
                return res.json({ users: users });
            })
                .catch((err) => {
                return res.status(500).send(err.message);
            });
        };
        /**
         * Sets the users' roles.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.setRoles = (req, res) => {
            if (!req.body.roles) {
                return res.status(422).end();
            }
            const roles = req.body.roles;
            for (let i = 0; i < roles.length; i++) {
                if (!roles[i].id || !roles[i].id.match(/^[0-9a-fA-F]{24}$/)) {
                    continue;
                }
                if (!roles[i].role || config_1.default.roles.indexOf(roles[i].role) < 0) {
                    continue;
                }
                user_model_1.default.findByIdAndUpdate(roles[i].id, { role: roles[i].role })
                    .exec()
                    .catch((err) => {
                    console.log(err.message);
                });
            }
            return res.status(200).end();
        };
        /**
         * Subscribe to user with ID from params
         *
         * @param {Request} req
         * @param {Response} res
         * @returns {void}
         * @api public
         * @memberof UserController
         */
        this.subscribeToUser = (req, res) => {
            if (!req.user) {
                return res.status(422).end();
            }
            if (!req.params.id) {
                return res.status(422).end();
            }
            if (req.user.users.every(id => id !== req.params.id)) {
                const subscriptions = req.user.users;
                subscriptions.push(req.params.id);
                user_model_1.default.findByIdAndUpdate(req.user.id, { users: subscriptions })
                    .exec()
                    .catch((err) => console.log(err.message));
            }
            return res.status(200).end();
        };
        /**
         * Unubscribe from user with id from params
         *
         * @param {Request} req
         * @param {Response} res
         * @returns {void}
         * @api public
         * @memberof UserController
         */
        this.unsubscribeFromUser = (req, res) => {
            if (!req.user) {
                return res.status(422).end();
            }
            if (!req.params.id) {
                return res.status(422).end();
            }
            if (req.user.users.some(id => id === req.params.id)) {
                const subscriptions = req.user.users;
                subscriptions.splice(subscriptions.indexOf(req.params.id), 1);
                user_model_1.default.findByIdAndUpdate(req.user.id, { users: subscriptions })
                    .exec()
                    .catch((err) => console.log(err.message));
            }
            return res.status(200).end();
        };
        /**
         * Subscribe to category with cat from params
         *
         * @param {Request} req
         * @param {Response} res
         * @returns {void}
         * @api public
         * @memberof UserController
         */
        this.subscribeToCategory = (req, res) => {
            if (!req.user) {
                return res.status(422).end();
            }
            if (!req.params.cat) {
                return res.status(422).end();
            }
            if (config_1.default.categories.indexOf(req.params.cat) < 0) {
                return res.status(422).end();
            }
            if (req.user.categories.every(cat => cat !== req.params.cat)) {
                const subscriptions = req.user.categories;
                subscriptions.push(req.params.cat);
                user_model_1.default.findByIdAndUpdate(req.user.id, { categories: subscriptions })
                    .exec()
                    .catch((err) => console.log(err.message));
            }
            return res.status(200).end();
        };
        /**
         * Unsubscribe from category with cat from params
         *
         * @param {Request} req
         * @param {Response} res
         * @returns {void}
         * @api public
         * @memberof UserController
         */
        this.unsubscribeFromCategory = (req, res) => {
            if (!req.user) {
                return res.status(422).end();
            }
            if (!req.params.cat) {
                return res.status(422).end();
            }
            if (config_1.default.categories.indexOf(req.params.cat) < 0) {
                return res.status(422).end();
            }
            if (req.user.categories.some(cat => cat === req.params.cat)) {
                const subscriptions = req.user.categories;
                subscriptions.splice(subscriptions.indexOf(req.params.cat), 1);
                user_model_1.default.findByIdAndUpdate(req.user.id, { categories: subscriptions })
                    .exec()
                    .catch((err) => console.log(err.message));
            }
            return res.status(200).end();
        };
    }
}
exports.default = new UserController();
