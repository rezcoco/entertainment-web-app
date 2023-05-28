"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_path_1 = __importDefault(require("node:path"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("dotenv");
const Connect_1 = __importDefault(require("./db/Connect"));
const ApiRoutes_1 = __importDefault(require("./routers/ApiRoutes"));
const AuthRoutes_1 = __importDefault(require("./routers/AuthRoutes"));
const Authorization_1 = __importDefault(require("./middlewares/Authorization"));
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.app.use((0, cookie_parser_1.default)());
        this.routes();
        this.middelware();
        (0, dotenv_1.config)();
        Connect_1.default.connect(process.env.DB_URL);
    }
    middelware() {
        this.app.use((0, compression_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: true }));
        this.app.use(express_1.default.static(node_path_1.default.join(process.cwd(), 'client')));
        // this.app.disable('etag')
        this.app.use('/api/v1', ApiRoutes_1.default);
        this.app.use('/', AuthRoutes_1.default);
        this.app.use('*', (req, res) => {
            return res.sendStatus(404);
        });
    }
    routes() {
        this.app.get('/', (req, res) => {
            res.sendFile(node_path_1.default.join(process.cwd(), 'client', 'index.html'));
        });
        this.app.get('/movies', (req, res) => {
            res.sendFile(node_path_1.default.join(process.cwd(), 'client', 'movies.html'));
        });
        this.app.get('/tv', (req, res) => {
            res.sendFile(node_path_1.default.join(process.cwd(), 'client', 'tv-series.html'));
        });
        this.app.get('/bookmark', (req, res) => {
            res.sendFile(node_path_1.default.join(process.cwd(), 'client', 'bookmarked.html'));
        });
        this.app.get('/login', Authorization_1.default.client, (req, res) => {
            res.sendFile(node_path_1.default.join(process.cwd(), 'client', 'login.html'));
        });
        this.app.get('/signup', Authorization_1.default.client, (req, res) => {
            res.sendFile(node_path_1.default.join(process.cwd(), 'client', 'sign-up.html'));
        });
    }
}
const app = new App().app;
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
