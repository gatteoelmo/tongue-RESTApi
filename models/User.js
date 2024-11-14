import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    nickname: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    }

});

export const User = mongoose.model('User', userSchema);
