"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Validation_1 = __importDefault(require("../middlewares/Validation"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
class AuthRoutes extends BaseRouter_1.default {
    routes() {
        this.router.post('/login', Validation_1.default.login(), AuthController_1.default.login);
        this.router.post('/signup', Validation_1.default.signup(), AuthController_1.default.signup);
        this.router.delete('/logout', Validation_1.default.logout(), AuthController_1.default.logout);
    }
}
exports.default = new AuthRoutes().router;
