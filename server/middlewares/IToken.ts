import { JwtPayload } from "jsonwebtoken"

export default interface IToken extends JwtPayload {
    email: string
}