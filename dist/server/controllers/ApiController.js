"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_json_1 = __importDefault(require("../data/data.json"));
const UserModel_1 = __importDefault(require("../db/UserModel"));
class ApiController {
    async movies(req, res) {
        const user = await UserModel_1.default.findById(res.locals.user);
        const movies = data_json_1.default.map((movie) => {
            if (user && user.bookmark.includes(movie.id))
                return { ...movie, isBookmarked: true };
            return movie;
        }).filter((movie) => movie?.category === 'Movie');
        res.status(200).json(movies);
    }
    async tv(req, res) {
        const user = await UserModel_1.default.findById(res.locals.user);
        const movies = data_json_1.default.map((movie) => {
            if (user && user.bookmark.includes(movie.id))
                return { ...movie, isBookmarked: true };
            return movie;
        }).filter((movie) => movie?.category === 'TV Series');
        res.status(200).json(movies);
    }
    async bookmark(req, res) {
        const user = await UserModel_1.default.findById(res.locals.user);
        const movies = data_json_1.default.map((movie) => {
            if (user && user.bookmark.includes(movie.id))
                return { ...movie, isBookmarked: true };
            return movie;
        }).filter((movie) => movie?.isBookmarked);
        res.status(200).json(movies);
    }
    async trending(req, res) {
        const user = await UserModel_1.default.findById(res.locals.user);
        const movies = data_json_1.default.map((movie) => {
            if (user && user.bookmark.includes(movie.id))
                return { ...movie, isBookmarked: true };
            return movie;
        }).filter((movie) => movie?.isTrending);
        res.status(200).json(movies);
    }
    async recommend(req, res) {
        const user = await UserModel_1.default.findById(res.locals.user);
        const movies = data_json_1.default.map((movie) => {
            if (user && user.bookmark.includes(movie.id))
                return { ...movie, isBookmarked: true };
            return movie;
        }).filter((movie) => !movie?.isTrending);
        res.status(200).json(movies);
    }
    async search(req, res) {
        const query = req.query.q?.toString().toLowerCase();
        const type = req.query.type?.toString().toLowerCase();
        if (query && type) {
            const user = await UserModel_1.default.findById(res.locals.user);
            const movies = data_json_1.default.map((movie) => {
                if (user && user.bookmark.includes(movie.id))
                    return { ...movie, isBookmarked: true };
                return movie;
            }).filter((movie) => {
                if (movie.title.toLowerCase().includes(query) && type === 'all') {
                    return true;
                }
                else if (movie.title.toLowerCase().includes(query) && type === 'movie') {
                    return movie.category === 'Movie';
                }
                else if (movie.title.toLowerCase().includes(query) && type === 'tv') {
                    return movie.category === 'TV Series';
                }
                else if (movie.title.toLowerCase().includes(query) && type === 'bookmark') {
                    return movie.isBookmarked;
                }
                else {
                    return false;
                }
            });
            res.status(200).json(movies);
        }
    }
    async addBookmark(req, res) {
        const { id } = req.body;
        try {
            const user = await UserModel_1.default.findById(res.locals.user);
            if (user && id) {
                user.bookmark.push(id);
                await user.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(400);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
    async rmBookmark(req, res) {
        const { id } = req.body;
        try {
            const user = await UserModel_1.default.findById(res.locals.user);
            if (user && id) {
                user.bookmark = user.bookmark.filter((bookmark) => bookmark !== id);
                await user.save();
                return res.sendStatus(200);
            }
            return res.sendStatus(400);
        }
        catch (error) {
            console.log(error);
            res.sendStatus(500);
        }
    }
}
exports.default = new ApiController();
