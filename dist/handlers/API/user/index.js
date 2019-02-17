"use strict";
/**
 * @file      /src/handlers/API/user/index.ts
 *
 * @brief     API endpoint for user
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
const user_controller_1 = __importDefault(require("./user.controller"));
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("./../auth/auth.controller"));
const post_controller_1 = __importDefault(require("./../post/post.controller"));
const router = express_1.Router();
/**
 * GET '/api/user/self/posts' returns the current user's posts
 */
router.get('/self/posts', auth_controller_1.default.appendUser, post_controller_1.default.getUserPosts);
/**
 * GET '/api/user/self' returns the user
 */
router.get('/self', auth_controller_1.default.appendUser, user_controller_1.default.getCurrentUser);
/**
 * PUT '/api/user/roles' sets several roles.
 */
router.put('/roles', auth_controller_1.default.appendUser, auth_controller_1.default.hasRole('admin'), user_controller_1.default.setRoles);
/**
 * PUT '/api/user/:id/role/request/refuse' refuses the users role request
 */
router.put('/:id/role/request/refuse', auth_controller_1.default.appendUser, auth_controller_1.default.hasRole('admin'), user_controller_1.default.refuseRoleRequest);
/**
 * PUT '/api/user/:id/role/request/accept' accepts the users role request
 */
router.put('/:id/role/request/accept', auth_controller_1.default.appendUser, auth_controller_1.default.hasRole('admin'), user_controller_1.default.acceptRoleRequest);
/**
 * PUT '/api/user/self/role/request' sets a new role request
 */
router.put('/self/role/request', auth_controller_1.default.appendUser, user_controller_1.default.setRoleRequest);
/**
 * PUT '/api/user/:id/role' sets the user's role
 */
router.put('/:id/role', auth_controller_1.default.appendUser, auth_controller_1.default.hasRole('admin'), user_controller_1.default.setRole);
/**
 * POST '/api/user' inserts the user given by req.body
 */
router.post('/', user_controller_1.default.insertUser);
/**
 * GET '/api/user/search?search=[search-item]' returns the users matching the search
 */
router.get('/search', user_controller_1.default.searchUser);
/**
 * GET '/api/user/:id/role/' returns the user
 */
router.get('/:id', auth_controller_1.default.appendUser, user_controller_1.default.canGetUserInfo, user_controller_1.default.getUser);
/**
 * GET '/api/user/subscribe/user/:id' subscribes the current user to user with :id
 */
router.get('/subscribe/user/:id', auth_controller_1.default.appendUser, user_controller_1.default.subscribeToUser);
/**
 * GET '/api/user/unsubscribe/user/:id' unsubscribes the current user from user with :id
 */
router.get('/unsubscribe/user/:id', auth_controller_1.default.appendUser, user_controller_1.default.unsubscribeFromUser);
/**
 * GET '/api/user/subscribe/category/:cat' subscribes the current category to user with :cat
 */
router.get('/subscribe/category/:cat', auth_controller_1.default.appendUser, user_controller_1.default.subscribeToCategory);
/**
 * GET '/api/user/unsubscribe/category/:cat' unsubscribes the current category to user with :cat
 */
router.get('/unsubscribe/category/:cat', auth_controller_1.default.appendUser, user_controller_1.default.unsubscribeFromCategory);
exports.default = router;
