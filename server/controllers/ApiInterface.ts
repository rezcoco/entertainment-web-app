import { Request, Response } from "express"

interface IApi {
    movies(req: Request, res: Response): void
    tv(req: Request, res: Response): void
    bookmark(req: Request, res: Response): void
    trending(req: Request, res: Response): void
    recommend(req: Request, res: Response): void
}

export default IApi