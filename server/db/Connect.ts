import mongoose from "mongoose";

export default class Db {
    public static async connect(url: string): Promise<void> {
        await mongoose.connect(url)
        return console.log('Mongodb connected...')
    }
}