import mongoose, { Model, Schema } from "mongoose";
import { IUser } from "./IUser";

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true },
    password: { type: String, required: true },
    bookmark: { type: [String] },
    refreshToken: { type: String}
})

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema)

export default User