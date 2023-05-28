import BaseRouter from "./BaseRouter";
import ApiController from "../controllers/ApiController";
import AuthController from "../controllers/AuthController";
import Authorization from "../middlewares/Authorization";

class ApiRoutes extends BaseRouter {
    public routes(): void {
        this.router.get('/movies', Authorization.api, ApiController.movies)
        this.router.get('/tv', Authorization.api, ApiController.tv)
        this.router.get('/bookmark', Authorization.api, ApiController.bookmark)
        this.router.get('/trending', Authorization.api, ApiController.trending)
        this.router.get('/recommend', Authorization.api, ApiController.recommend)
        this.router.get('/search', Authorization.api, ApiController.search)
        this.router.get('/refresh-token', AuthController.refreshToken)
        this.router.post('/bookmark', Authorization.api, ApiController.addBookmark)
        this.router.delete('/bookmark', Authorization.api, ApiController.rmBookmark)
    }
}

export default new ApiRoutes().router