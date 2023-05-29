import { Request, Response } from "express"

interface IApi {
    movies(req: Request, res: Response): void
    tv(req: Request, res: Response): void
    bookmark(req: Request, res: Response): void
    all(req: Request, res: Response): void
    search(req: Request, res: Response): void
    rmBookmark(req: Request, res: Response): void
    addBookmark(req: Request, res: Response): void
}

export default IApi