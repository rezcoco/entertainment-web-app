"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Password_1 = __importDefault(require("../utils/Password"));
const UserModel_1 = __importDefault(require("../db/UserModel"));
class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const data = await UserModel_1.default.findOne({ email });
            if (data) {
                const compare = await Password_1.default.compare(password, data.password);
                if (compare) {
                    const accessToken = await Password_1.default.accessToken();
                    const refreshToken = await Password_1.default.refreshToken();
                    data.refreshToken = refreshToken;
                    await data.save();
                    return res.status(200).cookie('user', data.id, {
                        httpOnly: true,
                    }).cookie('access', accessToken, {
                        httpOnly: true,
                        maxAge: 15 * 60 * 1000
                    }).cookie('refresh', refreshToken, {
                        httpOnly: true,
                    }).json({ accessToken, refreshToken, userId: data.id });
                }
                return res.status(401).json({ message: 'Password incorrect' });
            }
            return res.status(400).json({ message: 'Email does not exists' });
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async signup(req, res) {
        try {
            const { email, password } = req.body;
            const isExist = await UserModel_1.default.findOne({ email });
            if (!isExist) {
                const hashed = await Password_1.default.hash(password);
                const db = new UserModel_1.default({ email, password: hashed, refreshToken: null });
                const saved = await db.save();
                return res.status(200).cookie('user', saved.id).json({ userId: saved.id });
            }
            return res.status(400).json({ message: 'Email already in use' });
        }
        catch (error) {
            res.sendStatus(500);
        }
    }
    async logout(req, res) {
        const { userId } = req.body;
        const user = await UserModel_1.default.findById(userId);
        if (user) {
            user.refreshToken = null;
            await user.save();
            return res.status(200).clearCookie('access').clearCookie('refresh').clearCookie('user').send('Ok');
        }
        return res.sendStatus(401);
    }
    async refreshToken(req, res) {
        try {
            const { refresh, user } = req.cookies;
            if (refresh && user) {
                jsonwebtoken_1.default.verify(refresh, process.env.REFRESH_SECRET_KEY);
                const userInfo = await UserModel_1.default.findById(user);
                if (userInfo && userInfo.refreshToken) {
                    const accessToken = await Password_1.default.accessToken();
                    return res.status(200).cookie('access', accessToken, { httpOnly: true, maxAge: 2 * 1000 }).send('Ok');
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
exports.default = new AuthController();
