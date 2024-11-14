import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please provide unique username"],
        unique: [true, "username exist"]
    }
})