import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User from "../db/UserModel";
import IToken from "./IToken";

class Authrization {
    public async client(req: Request, res: Response, next: NextFunction) {
        try {
            const { access, user } = req.cookies

            if (access && user) {
                jwt.verify(access, process.env.ACCESS_SECRET_KEY as string)
                const verify = await User.findById(user)
        
                if (verify?.refreshToken) {
                    res.locals.user = verify.id
                    return res.redirect('/')
                }
                return next()
            }
            return next()
            
        } catch (error) {
            return next()
        }
    }
    public async api(req: Request, res: Response, next: NextFunction) {
        try {
            const { access, user } = req.cookies
            if (access && user) {
                jwt.verify(access, process.env.ACCESS_SECRET_KEY as string) as IToken
                const verify = await User.findById(user)

                if (verify?.refreshToken) {
                    res.locals.user = verify.id
                    return next()
                }
                return res.sendStatus(401)
            }
            return res.sendStatus(400)
        } catch (error) {
            res.sendStatus(401)
        }
    }
}

export default new Authrization()