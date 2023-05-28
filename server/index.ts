import express, { Application, Request, Response } from 'express'
import path from 'node:path'
import compression from 'compression'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { config as dotenv } from 'dotenv'
import Db from './db/Connect'
import ApiRoutes from './routers/ApiRoutes'
import AuthRoutes from './routers/AuthRoutes'
import Authorization from './middlewares/Authorization'

class App {
    public app: Application

    constructor() {
        this.app = express()
        this.app.use(cookieParser())
        this.routes()
        this.middelware()
        dotenv()
        Db.connect(process.env.DB_URL as string)
    }

    private middelware():void {
        this.app.use(compression())
        this.app.use(helmet())
        this.app.use(bodyParser.json())
        this.app.use(bodyParser.urlencoded({ extended: true }))
        this.app.use(express.static(path.join(process.cwd(), 'client')))
        // this.app.disable('etag')
        this.app.use('/api/v1', ApiRoutes)
        this.app.use('/', AuthRoutes)
        this.app.use('*', (req: Request, res: Response) => {
            return res.sendStatus(404)
        })
    }

    private routes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.sendFile(path.join(process.cwd(), 'client', 'index.html'))
        })
        this.app.get('/movies', (req: Request, res: Response) => {
            res.sendFile(path.join(process.cwd(), 'client', 'movies.html'))
        })
        this.app.get('/tv', (req: Request, res: Response) => {
            res.sendFile(path.join(process.cwd(), 'client', 'tv-series.html'))
        })
        this.app.get('/bookmark', (req: Request, res: Response) => {
            res.sendFile(path.join(process.cwd(), 'client', 'bookmarked.html'))
        })
        this.app.get('/login', Authorization.client, (req: Request, res: Response) => {
            res.sendFile(path.join(process.cwd(), 'client', 'login.html'))
        })
        this.app.get('/signup', Authorization.client, (req: Request, res: Response) => {
            res.sendFile(path.join(process.cwd(), 'client', 'sign-up.html'))
        })
    }
}

const app = new App().app
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}`))