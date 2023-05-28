import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class Password {
    public async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, 15)
    }
    public async compare(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash)
    }

    public async accessToken(): Promise<string> {
        return jwt.sign({ accessToken: process.env.ACCESS_TOKEN_BODY }, process.env.ACCESS_SECRET_KEY as string, { expiresIn: '15m' })
    }

    public async refreshToken(): Promise<string> {
        return jwt.sign({ refreshToken: process.env.REFRESH_TOKEN_BODY }, process.env.REFRESH_SECRET_KEY as string, { expiresIn: '1d' })
    }
}

export default new Password()