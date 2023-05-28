"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Password {
    async hash(password) {
        return await bcrypt_1.default.hash(password, 15);
    }
    async compare(password, hash) {
        return await bcrypt_1.default.compare(password, hash);
    }
    async accessToken() {
        return jsonwebtoken_1.default.sign({ accessToken: process.env.ACCESS_TOKEN_BODY }, process.env.ACCESS_SECRET_KEY, { expiresIn: '15m' });
    }
    async refreshToken() {
        return jsonwebtoken_1.default.sign({ refreshToken: process.env.REFRESH_TOKEN_BODY }, process.env.REFRESH_SECRET_KEY, { expiresIn: '1d' });
    }
}
exports.default = new Password();
