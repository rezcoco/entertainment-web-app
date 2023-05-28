"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = __importDefault(require("../db/UserModel"));
class Authrization {
    async client(req, res, next) {
        try {
            const { access, user } = req.cookies;
            if (access && user) {
                jsonwebtoken_1.default.verify(access, process.env.ACCESS_SECRET_KEY);
                const verify = await UserModel_1.default.findById(user);
                if (verify?.refreshToken) {
                    res.locals.user = verify.id;
                    return res.redirect('/');
                }
                return next();
            }
            return next();
        }
        catch (error) {
            return next();
        }
    }
    async api(req, res, next) {
        try {
            const { access, user } = req.cookies;
            if (access && user) {
                jsonwebtoken_1.default.verify(access, process.env.ACCESS_SECRET_KEY);
                const verify = await UserModel_1.default.findById(user);
                if (verify?.refreshToken) {
                    res.locals.user = verify.id;
                    return next();
                }
                return res.sendStatus(401);
            }
            return res.sendStatus(400);
        }
        catch (error) {
            res.sendStatus(401);
        }
    }
}
exports.default = new Authrization();
