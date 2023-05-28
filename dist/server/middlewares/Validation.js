"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
class Validation {
    pwdPattern = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/);
    signup() {
        return [
            (0, express_validator_1.body)('email').isEmail().withMessage('Please fill valid Email address').notEmpty().withMessage('Email can\'t be empty'),
            (0, express_validator_1.body)('password').matches(this.pwdPattern).withMessage('Enter a password combination of at least eight numbers, letters and punctuation marks (such as ! and &).').notEmpty().withMessage('Password can\'t be empty'),
            (0, express_validator_1.body)('repeat_password').custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Passwords don\'t match');
                }
                return true;
            }),
            function (req, res, next) {
                const result = (0, express_validator_1.validationResult)(req).array();
                const error = result[0];
                if (error) {
                    return res.status(400).json({ message: error.msg });
                }
                return next();
            }
        ];
    }
    login() {
        return [
            (0, express_validator_1.body)('email').isEmail().withMessage('Please fill valid Email Address').notEmpty().withMessage('Email can\'t be empty'),
            (0, express_validator_1.body)('password').notEmpty().withMessage('Password can\'t be empty'),
            function (req, res, next) {
                const result = (0, express_validator_1.validationResult)(req).array();
                const error = result[0];
                if (error)
                    return res.status(400).json({ message: error.msg });
                return next();
            }
        ];
    }
    logout() {
        return [
            (0, express_validator_1.body)('userId').notEmpty().withMessage('Invalid request body'),
            function (req, res, next) {
                const result = (0, express_validator_1.validationResult)(req).array();
                const error = result[0];
                if (error)
                    return res.status(400).json({ message: error.msg });
                return next();
            }
        ];
    }
}
exports.default = new Validation();
