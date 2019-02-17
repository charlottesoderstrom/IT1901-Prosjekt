"use strict";
/**
 * @file      /src/handlers/API/post/index.ts
 *
 * @brief     API endpoint for user
 *
 * @date      20-09-2018
 * @author    Ole Fredrik Borgundvåg Berg
 *
 * @copyright IT1901 - Group 7, 2018
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_controller_1 = __importDefault(require("./post.controller"));
const auth_controller_1 = __importDefault(require("../auth/auth.controller"));
const express_1 = require("express");
const router = express_1.Router();
/**
 * POST '/api/post' inserts the post given by req.body
 */
router.post('/', auth_controller_1.default.appendUser, post_controller_1.default.insertPost);
/**
 * GET '/api/post/search?search=[search-item]' returns all posts that include the search word id, sorted by date
 */
router.get('/search', post_controller_1.default.searchPosts);
/**
 * GET '/api/post/:id' returns the post with the specified id
 */
router.get('/:id', post_controller_1.default.getPostsById);
/**
 * PUT '/api/post/:id' updates the post with the specified id
 */
router.put('/:id', auth_controller_1.default.appendUser, post_controller_1.default.editPost);
/**
 * GET '/api/post' returns all posts sorted by date
 */
router.get('/', post_controller_1.default.getPosts);
/**
 * DELETE '/api/post/:id' deletes the post with the specified id
 */
router.delete('/:id', auth_controller_1.default.appendUser, post_controller_1.default.deletePostById);
exports.default = router;
