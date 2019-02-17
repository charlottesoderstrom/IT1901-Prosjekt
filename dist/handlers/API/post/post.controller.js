"use strict";
/**
 * @file      /src/handlers/API/post/post.controller.ts
 *
 * @brief     Handles communication to and from content table in database
 *
 * @date      25-09-2018
 * @author    Einar Viddal, Ole Fredrik Borgundvåg Berg, Adrian Leren
 *
 * @copyright IT1901 - Group 7, 2018
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const post_model_1 = __importDefault(require("./post.model"));
class PostController {
    constructor() {
        /**
         * * Inserts a post given by req.body into the database.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.insertPost = (req, res) => {
            if (!req.user) {
                return res.status(403).end();
            }
            req.body.author = req.user._id;
            const post = new post_model_1.default(req.body);
            post.save()
                .then((post) => {
                return res.status(200).end();
            })
                .catch((err) => {
                return res.status(422).send(err.message);
            });
        };
        /**
         * * Returns a the post with the given ID.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.getPostsById = (req, res) => {
            const postId = req.params.id;
            /*
             * Return 404 on invalid MongoDB-ids.
             */
            if (!postId.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(404).end();
            }
            post_model_1.default.findById(postId)
                .populate({
                path: 'author',
                select: '-password -tokens -salt',
            })
                .populate({
                path: 'comments.author',
                select: '-password -tokens -salt',
            })
                .exec()
                .then(post => {
                if (!post) {
                    return res.status(404).end();
                }
                return res.json(post);
            })
                .catch((error) => {
                return res.status(500).end();
            });
        };
        /**
         * * Returns the posts of the logged in user.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.getUserPosts = (req, res) => {
            if (!req.user) {
                return res.status(404).end();
            }
            post_model_1.default.find({ 'author': req.user._id })
                .populate({
                path: 'author',
                select: '-password -tokens -salt',
            })
                .populate({
                path: 'comments.author',
                select: '-password -tokens -salt',
            })
                .exec()
                .then(posts => {
                if (!posts) {
                    return res.status(404).end();
                }
                return res.json(posts);
            })
                .catch((error) => {
                return res.status(500).end();
            });
        };
        /**
         * * Returns all posts.
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.getPosts = (req, res) => {
            post_model_1.default.find()
                .sort({ createdAt: 'descending' })
                .populate({
                path: 'author',
                select: '-password -tokens -salt',
            })
                .populate({
                path: 'comments.author',
                select: '-password -tokens -salt',
            })
                .exec()
                .then(post => {
                return res.json(post);
            })
                .catch((error) => {
                return res.status(500).end();
            });
        };
        /**
         * Return all posts that match a search string
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.searchPosts = (req, res) => {
            if (!req.query.search) {
                return res.json({ posts: [] });
            }
            const search = req.query.search.replace(' ', '|');
            post_model_1.default.find({ $or: [{ headline: { $regex: search, $options: 'i' } }, { text: { $regex: search, $options: 'i' } }] })
                .sort({ createdAt: 'descending' })
                .populate({
                path: 'author',
                select: '-password -tokens -salt',
            })
                .populate({
                path: 'comments.author',
                select: '-password -tokens -salt',
            })
                .exec()
                .then(posts => {
                return res.json({ posts: posts });
            })
                .catch((error) => {
                return res.status(500).end();
            });
        };
        /**
         * * Append posts to request
         *
         * @param {Request} req
         * @param {Response} res
         * @param {any} next
         * @return {void}
         * @api public
         */
        this.appendPosts = (req, res, next) => {
            post_model_1.default.find()
                .sort({ createdAt: 'descending' })
                .populate({
                path: 'author',
                select: '-password -tokens -salt',
            })
                .populate({
                path: 'comments.author',
                select: '-password -tokens -salt',
            })
                .exec()
                .then(post => {
                req.posts = post;
                return next();
            })
                .catch((error) => {
                return res.status(500).end();
            });
        };
        /**
         * * Append posts by user to request
         *
         * @param {Request} req
         * @param {Response} res
         * @param {any} next
         * @return {void}
         * @api public
         */
        this.appendPostsByUser = (req, res, next) => {
            if (!req.user) {
                req.posts = [];
                return next();
            }
            post_model_1.default.find({ 'author': req.user._id })
                .sort({ createdAt: 'descending' })
                .populate({
                path: 'author',
                select: '-password -tokens -salt',
            })
                .populate({
                path: 'comments.author',
                select: '-password -tokens -salt',
            })
                .exec()
                .then(post => {
                req.posts = post;
                return next();
            })
                .catch((error) => {
                return res.status(500).end();
            });
        };
        /**
         * * Append post by id to request
         *
         * @param {Request} req
         * @param {Response} res
         * @param {any} next
         * @return {void}
         * @api public
         */
        this.appendPostById = (req, res, next) => {
            if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(404).end();
            }
            post_model_1.default.findById(req.params.id)
                .populate({
                path: 'author',
                select: '-password -tokens -salt',
            })
                .populate({
                path: 'comments.author',
                select: '-password -tokens -salt',
            })
                .exec()
                .then(post => {
                req.post = post;
                return next();
            })
                .catch((error) => {
                return res.status(500).end();
            });
        };
        /**
         * * Edit post by id to request
         *
         * @param {Request} req
         * @param {Response} res
         * @param {any} next
         * @return {void}
         * @api public
         */
        this.editPost = (req, res, next) => {
            if (!req.params.id) {
                return res.status(422).end();
            }
            if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(404).end();
            }
            post_model_1.default.findById(req.params.id)
                .exec()
                .then(post => {
                if (req.body.headline) {
                    post.headline = req.body.headline;
                }
                if (req.body.text) {
                    post.text = req.body.text;
                }
                if (req.body.comment) {
                    post.comments.push({
                        text: req.body.comment,
                        author: req.user,
                        createdAt: new Date()
                    });
                }
                if (req.body.category) {
                    post.category = req.body.category;
                }
                if (req.body.verified !== undefined) {
                    post.verified = req.body.verified;
                }
                post.save();
                return res.status(200).end();
            })
                .catch((error) => {
                return res.status(500).end();
            });
        };
        /**
         * * Delete post by id
         *
         * @param {Request} req
         * @param {Response} res
         * @return {void}
         * @api public
         */
        this.deletePostById = (req, res) => {
            if (!req.params.id) {
                return res.status(404).end();
            }
            if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                return res.status(422).end();
            }
            if (!req.user) {
                return res.status(401).end();
            }
            post_model_1.default.findById(req.params.id)
                .exec()
                .then(post => {
                if (post.author != req.user.id) {
                    return res.status(403).end();
                }
                if (!post.draft) {
                    return res.status(406).end();
                }
                post.remove();
                return res.status(200).end();
            })
                .catch((error) => {
                return res.status(500).send(error.message);
            });
        };
        /**
         * * Append posts that needs proofreading
         *
         * @param {Request} req
         * @param {Response} res
         * @param {Any} next
         * @return {void}
         * @api public
         */
        this.appendPostsThatNeedsProofreading = (req, res, next) => {
            post_model_1.default.find({ proofreader: undefined, verified: false, draft: false })
                .populate({
                path: 'author',
                select: '-password -tokens -salt',
            })
                .select('-comments')
                .exec()
                .then(posts => {
                req.posts = posts;
                return next();
            })
                .catch((error) => {
                return res.status(500).send(error.message);
            });
        };
        /**
         * * Append posts that you are assigned to proofreading
         *
         * @param {Request} req
         * @param {Response} res
         * @param {Any} next
         * @return {void}
         * @api public
         */
        this.appendPostsThatYouProofread = (req, res, next) => {
            if (!req.user) {
                return res.status(401).end;
            }
            post_model_1.default.find({ proofreader: req.user.id, verified: false, draft: false })
                .populate({
                path: 'author',
                select: '-password -tokens -salt',
            })
                .select('-comments')
                .exec()
                .then(posts => {
                req.posts = posts;
                return next();
            })
                .catch((error) => {
                return res.status(500).send(error.message);
            });
        };
    }
}
exports.default = new PostController();
