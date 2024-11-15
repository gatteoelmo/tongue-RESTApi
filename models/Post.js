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
    // insertionDate: {
    //     type: Date,
    //     default: Date.now
    // },
    // updatedAt: {
    //     type: Date,
    //     default: Date.now
    // },
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

{ timestamps: true });

// 

export const Post = mongoose.model('Post', postSchema);