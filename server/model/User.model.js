import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please provide unique username"],
        unique: [true, "username exist"],
    },
    password: {
        type: String,
        required: [true, "please provide a password"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "please provide a email"],
        unique: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    mobile: {
        type: Number,
    },
    address: {
        type: String,
    },
    profile: {
        type: String,
    },

});