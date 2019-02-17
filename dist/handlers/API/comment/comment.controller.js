"use strict";
/**
 * @file      /src/handlers/API/comment/comment.controller.ts
 *
 * @brief     Handles communication to and from content table in database
 *
 * @date      03-10-2018
 * @author    Ole Fredrik Borgundvåg Berg
 *
 * @copyright IT1901 - Group 7, 2018
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("../post/post.model"));
class CommentController {
    constructor() {
        /**
         * * Inserts a comment given by req.body into the database.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.insertComment = (req, res) => {
            if (!req.user) {
                return res.status(403).end();
            }
            /*
            * Return 404 on invalid MongoDB-ids.
            */
            if (!req.body.id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(404).end();
            }
            const comment = {
                author: req.user._id,
                text: req.body.text
            };
            post_model_1.default.findByIdAndUpdate(req.body.id, { $push: { 'comments': comment } })
                .then(() => {
                return res.status(200).end();
            })
                .catch((err) => {
                return res.status(422).send(err.message);
            });
        };
    }
}
exports.default = new CommentController();
