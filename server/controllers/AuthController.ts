import jwt from 'jsonwebtoken'
import { Request, Response } from "express";
import Password from "../utils/Password"
import User from "../db/UserModel";
import { IUser } from "../db/IUser";
import IToken from '../middlewares/IToken';

class AuthController {
    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const data = await User.findOne({ email })
            if (data) {
                const compare = await Password.compare(password, data.password)

                if (compare) {
                    const accessToken = await Password.accessToken()
                    const refreshToken = await Password.refreshToken()

                    data.refreshToken = refreshToken
                    await data.save()

                    return res.status(200).cookie('user', data.id, {
                        httpOnly: true,
                    }).cookie('access', accessToken, {
                        httpOnly: true,
                        maxAge: 15 * 60 * 1000
                    }).cookie('refresh', refreshToken, {
                        httpOnly: true,
                    }).json({ accessToken, refreshToken, userId: data.id })
                }
                return res.status(401).json({ message: 'Password incorrect'})
            }
            return res.status(400).json({ message: 'Email does not exists'})
        } catch (error) {
            console.log(error)
            res.sendStatus(500)
        }
    }
    public async signup(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const isExist = await User.findOne({ email })

            if (!isExist) {
                const hashed = await Password.hash(password)
                const db = new User({ email, password: hashed, refreshToken: null })
                const saved = await db.save()

                return res.status(200).cookie('user', saved.id).json({ userId: saved.id})
                
            }
            return res.status(400).json({ message: 'Email already in use'})
        } catch (error) {
            res.sendStatus(500)
        }
    }

    public async logout(req: Request, res: Response) {
        const { userId } = req.body
        const user: IUser | null = await User.findById(userId)
        if (user) {
            user.refreshToken = null
            await user.save()
            return res.status(200).clearCookie('access').clearCookie('refresh').clearCookie('user').send('Ok')
        }
        return res.sendStatus(401)
    }

    public async refreshToken(req: Request, res: Response) {
        try {
            const {refresh, user} = req.cookies

            if (refresh && user) {
                jwt.verify(refresh, process.env.REFRESH_SECRET_KEY as string) as IToken
                const userInfo = await User.findById(user)

                if (userInfo && userInfo.refreshToken) {
                    const accessToken = await Password.accessToken()
                    return res.status(200).cookie('access', accessToken, { httpOnly: true, maxAge: 2 * 1000}).send('Ok')
                }
                return res.sendStatus(401)
            }
                
            return res.sendStatus(400)
        } catch (error) {
            res.sendStatus(401)
        }


    }
}

export default new AuthController()