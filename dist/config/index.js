"use strict";
/**
 * @file      /config/index.ts
 *
 * @brief     Configuration variables for app.
 *
 * @date      08-09-2018
 * @author    Ole Fredrik Borgundvåg Berg, Adrian Leren
 *
 * @copyright IT1901 - Group 7, 2018
 */
Object.defineProperty(exports, "__esModule", { value: true });
const Config = {
    mongo: {
        uri: 'mongodb://localhost/dev',
        options: {
            db: {
                safe: true
            }
        }
    },
    tokenSalt: 'nXxlkDLiQAtwT8kDvGOXZGpoEXRHvtetLT64Tirc',
    cookieSecret: 'yEAeB29EoEIm7JzRYj35IBFPZKTkqTvkHtWpDLTW',
    roles: ['user', 'author', 'editor', 'executive', 'admin'],
    categories: ['Food', 'Beauty', 'Home', 'Educational', 'Technology', 'Art', 'Comedy', 'Meditation', 'Taco', 'Movies']
};
exports.default = Config;
