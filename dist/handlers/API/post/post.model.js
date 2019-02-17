"use strict";
/**
 * @file	  /src/handlers/API/post/post.model.ts
 *
 * @brief	  Mongoose model for post
 *
 * @date	  20-09-2018
 * @author	Ole Fredrik Borgundvåg Berg, André Sommervold
 *
 * @copyright IT1901 - Group 7, 2018
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    headline: String,
    text: String,
    author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    category: String,
    comments: [{
            text: String,
            author: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' },
            createdAt: { type: Date, default: Date.now }
        }],
    draft: { type: Boolean, default: false },
    proofreader: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }
});
exports.default = mongoose_1.default.model('Post', PostSchema);
