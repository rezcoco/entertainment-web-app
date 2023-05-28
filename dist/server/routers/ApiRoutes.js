"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRouter_1 = __importDefault(require("./BaseRouter"));
const ApiController_1 = __importDefault(require("../controllers/ApiController"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const Authorization_1 = __importDefault(require("../middlewares/Authorization"));
class ApiRoutes extends BaseRouter_1.default {
    routes() {
        this.router.get('/movies', Authorization_1.default.api, ApiController_1.default.movies);
        this.router.get('/tv', Authorization_1.default.api, ApiController_1.default.tv);
        this.router.get('/bookmark', Authorization_1.default.api, ApiController_1.default.bookmark);
        this.router.get('/trending', Authorization_1.default.api, ApiController_1.default.trending);
        this.router.get('/recommend', Authorization_1.default.api, ApiController_1.default.recommend);
        this.router.get('/search', Authorization_1.default.api, ApiController_1.default.search);
        this.router.get('/refresh-token', AuthController_1.default.refreshToken);
        this.router.post('/bookmark', Authorization_1.default.api, ApiController_1.default.addBookmark);
        this.router.delete('/bookmark', Authorization_1.default.api, ApiController_1.default.rmBookmark);
    }
}
exports.default = new ApiRoutes().router;
