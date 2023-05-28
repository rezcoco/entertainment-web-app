import { Model, Document } from "mongoose"

export interface IUser extends Document {
    email: string,
    password: string,
    bookmark: string[],
    refreshToken: string | null
}

export interface IUserDoc extends IUser, Document {}
export interface IUserMod extends Model<IUserDoc> {}