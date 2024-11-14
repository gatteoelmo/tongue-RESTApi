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
    insertionDate: {
        type: Date,
        required: true
    },
    updateDate: {
        type: Date,
        default: Date.now
    },
    // user: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: true
    // },
    // interations: {
    //     type: [mongoose.Schema.Types.ObjectId],
    //     ref: 'Interaction'
    // }
});

// 

export const Post = mongoose.model('Post', postSchema);