import { Request, Response } from "express";
import IApi from "./ApiInterface"
import data from '../data/data.json'
import User from "../db/UserModel";
import { IUser, IUserDoc } from "../db/IUser";

class ApiController implements IApi {
    public async movies(req: Request, res: Response): Promise<void> {
        const user: IUser | null = await User.findById(res.locals.user)
        const movies = data.map((movie) => {
            if (user && user.bookmark.includes(movie.id)) return { ...movie, isBookmarked: true} 
            return movie
        }).filter((movie) => movie?.category === 'Movie')
        
        res.status(200).json(movies)
    }
    public async tv(req: Request, res: Response): Promise<void> {
        const user: IUser | null = await User.findById(res.locals.user)
        const movies = data.map((movie) => {
            if (user && user.bookmark.includes(movie.id)) return { ...movie, isBookmarked: true}
            return movie
        }).filter((movie) => movie?.category === 'TV Series')
        
        res.status(200).json(movies)
    }
    public async bookmark(req: Request, res: Response): Promise<void> {
        const user: IUser | null = await User.findById(res.locals.user)
        const movies = data.map((movie) => {
            if (user && user.bookmark.includes(movie.id)) return { ...movie, isBookmarked: true} 
            return movie
        }).filter((movie) => movie?.isBookmarked)
        
        res.status(200).json(movies)
    }
    public async trending(req: Request, res: Response): Promise<void> {
        const user: IUser | null = await User.findById(res.locals.user)
        const movies = data.map((movie) => {
            if (user && user.bookmark.includes(movie.id)) return { ...movie, isBookmarked: true}
            return movie
        }).filter((movie) => movie?.isTrending)
        
        res.status(200).json(movies)
    }
    public async recommend(req: Request, res: Response): Promise<void> {
        const user: IUser | null = await User.findById(res.locals.user)
        const movies = data.map((movie) => {
            if (user && user.bookmark.includes(movie.id)) return { ...movie, isBookmarked: true} 
            return movie
        }).filter((movie) => !movie?.isTrending)

        res.status(200).json(movies)
    }
    public async search(req: Request, res: Response): Promise<void> {
        const query = req.query.q?.toString().toLowerCase()
        const type = req.query.type?.toString().toLowerCase()
        if (query && type) {
            const user: IUser | null = await User.findById(res.locals.user)
            const movies = data.map((movie) => {
                if (user && user.bookmark.includes(movie.id)) return { ...movie, isBookmarked: true} 
                return movie
            }).filter((movie) => {
                if (movie.title.toLowerCase().includes(query) && type === 'all') {
                    return true
                } else if (movie.title.toLowerCase().includes(query) && type === 'movie') {
                    return movie.category === 'Movie'
                } else if (movie.title.toLowerCase().includes(query) && type === 'tv') {
                    return movie.category === 'TV Series'
                } else if (movie.title.toLowerCase().includes(query) && type === 'bookmark') {
                    return movie.isBookmarked
                } else {
                    return false
                }
            })
            res.status(200).json(movies)
        }
    }
    public async addBookmark(req: Request, res: Response): Promise<any> {
        const { id } = req.body
        try {
            const user: IUser | null =  await User.findById(res.locals.user)
            if (user && id) {
                user.bookmark.push(id)
                await user.save()
                return res.sendStatus(200)
            }
            return res.sendStatus(400)
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    }
    public async rmBookmark(req: Request, res: Response): Promise<any> {
        const { id } = req.body
        try {
            const user: IUser | null =  await User.findById(res.locals.user)
            if (user && id) {
                user.bookmark = user.bookmark.filter((bookmark) => bookmark !== id)
                await user.save()
                return res.sendStatus(200)
            }
            return res.sendStatus(400)
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    }
}

export default new ApiController()