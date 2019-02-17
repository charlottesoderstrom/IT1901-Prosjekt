"use strict";
/**
 * @file	  /src/handlers/API/user/user.model.ts
 *
 * @brief	  Mongoose model for user
 *
 * @date	  08-09-2018
 * @author	  Ole Fredrik Borgundvåg Berg, Adrian Leren
 *
 * @copyright IT1901 - Group 7, 2018
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const crypto_1 = __importDefault(require("crypto"));
const config_1 = __importDefault(require("../../../config"));
/**
 * Hashes and returns the token
 *
 * @param {String} token
 * @return {String}
 */
exports.hashToken = (token) => {
    return crypto_1.default.createHash('sha512').update(token + config_1.default.tokenSalt).digest('base64');
};
/**
 * The model for user in mongoose.
 */
exports.UserSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    salt: String,
    tokens: Array,
    role: {
        type: String,
        required: true,
        validate: {
            validator: function (role) {
                return config_1.default.roles.indexOf(role) >= 0;
            }
        }
    },
    requestedRole: {
        type: String,
        default: '',
        validate: {
            validator: function (role) {
                return role === '' || config_1.default.roles.indexOf(role) >= 0;
            }
        }
    },
    users: Array,
    categories: Array
});
// Validate empty password
exports.UserSchema
    .path('password')
    .validate(function (password) {
    return password.length;
}, 'Password cannot be blank');
const validatePresenceOf = (value) => {
    return value && value.length;
};
/**
 * Pre-save hook
 */
exports.UserSchema
    .pre('save', function save(next) {
    // Handle new/update passwords
    if (!this.isModified('password')) {
        return next();
    }
    if (!validatePresenceOf(this.password)) {
        return next(new Error('Invalid password'));
    }
    // Make salt with a callback
    this.makeSalt((saltErr, salt) => {
        if (saltErr) {
            return next(saltErr);
        }
        this.salt = salt;
        this.encryptPassword(this.password, (encryptErr, hashedPassword) => {
            if (encryptErr) {
                return next(encryptErr);
            }
            this.password = hashedPassword;
            return next();
        });
    });
});
/**
 * Methods
 */
exports.UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} password
     * @param {Function} callback
     * @return {Boolean}
     * @api public
     */
    authenticate(password, callback) {
        if (!callback) {
            return this.password === this.encryptPassword(password);
        }
        this.encryptPassword(password, (err, pwdGen) => {
            if (err) {
                return callback(err);
            }
            if (this.password === pwdGen) {
                return callback(undefined, true);
            }
            else {
                return callback(undefined, false);
            }
        });
    },
    /**
     * Make salt
     *
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    makeSalt(callback) {
        const byteSize = 20;
        return crypto_1.default.randomBytes(byteSize, (err, salt) => {
            if (err) {
                return callback(err);
            }
            else {
                const token = callback(undefined, salt.toString('base64'));
                return token;
            }
        });
    },
    /**
     * Encrypt password
     *
     * @param {String} password
     * @param {Function} callback
     * @return {String}
     * @api public
     */
    encryptPassword(password, callback) {
        if (!password || !this.salt) {
            if (!callback) {
                return undefined;
            }
            else {
                return callback('Missing password or salt');
            }
        }
        const defaultIterations = 10000;
        const defaultKeyLength = 64;
        const salt = new Buffer(this.salt, 'base64');
        if (!callback) {
            return crypto_1.default.pbkdf2Sync(password, salt, defaultIterations, defaultKeyLength, 'sha512')
                .toString('base64');
        }
        return crypto_1.default.pbkdf2(password, salt, defaultIterations, defaultKeyLength, 'sha512', (err, key) => {
            if (err) {
                return callback(err);
            }
            else {
                return callback(undefined, key.toString('base64'));
            }
        });
    },
    /**
     * Generate token
     *
     * @param {Function} callback
     * @api public
     */
    generateToken(callback) {
        this.makeSalt((err, salt) => {
            this.tokens.push(exports.hashToken(salt));
            this.save();
            callback(salt);
        });
    },
};
exports.default = mongoose_1.default.model('User', exports.UserSchema);
