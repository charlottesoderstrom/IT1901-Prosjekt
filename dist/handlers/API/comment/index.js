"use strict";
/**
 * @file      /src/handlers/API/comment/index.ts
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
const comment_controller_1 = __importDefault(require("./comment.controller"));
const auth_controller_1 = __importDefault(require("../auth/auth.controller"));
const express_1 = require("express");
const router = express_1.Router();
/**
 * POST '/api/comment' inserts the comment into the db.
 */
router.post('/', auth_controller_1.default.appendUser, comment_controller_1.default.insertComment);
exports.default = router;
