import mongoose from "mongoose";

const interactionSchema = mongoose.Schema({
    type: {
        type: String,
        enum: ['like', 'comment'],
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: { 
        type: String, 
        required: function() { return this.type === 'comment'; } 
    }
}, {timestamps: true});