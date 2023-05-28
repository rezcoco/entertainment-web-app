import Validation from "../middlewares/Validation";
import AuthController from "../controllers/AuthController";
import BaseRouter from "./BaseRouter";

class AuthRoutes extends BaseRouter {
    public routes() {
        this.router.post('/login', Validation.login(), AuthController.login)
        this.router.post('/signup', Validation.signup(), AuthController.signup)
        this.router.delete('/logout', Validation.logout(), AuthController.logout)
    }
}

export default new AuthRoutes().router