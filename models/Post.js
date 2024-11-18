import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    interactions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Interaction'
    }
},

{ timestamps: true } // add createdAt and updatedAt automatically
);

// 

export const Post = mongoose.model('Post', postSchema);