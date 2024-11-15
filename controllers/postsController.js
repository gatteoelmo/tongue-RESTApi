import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

export const postController = {
    getAllPosts: async (req, res) => {
        try {
            const posts = await Post.find({}, {__v: 0 }).sort({ createdAt: -1 });
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ message: `from getAllPosts: ${error.message}` });
        }
    },
    getPostById: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id, { __v: 0 });
            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ message: `from getPostById: ${error.message}` });
        }
    },
    createPost: async (req, res) => {
        try {
            const { title, content, user} = req.body;
            const userExists = await User.findById(user);
            if (!userExists) {
                return res.status(404).json({ message: "You're not part of the club" });
            };
            const post = await Post.create({
                title,
                content,
                user    
            });
            const savedPost = await post.save();
            res.status(201).json({message: "Post created successfully", savedPost});
        } catch (error) {
            res.status(500).json({ message: `from createPost: ${error.message}`, });
        }
    },
    modifyPost: async (req, res) => {
        try {            
            const { title, content, user } = req.body; /* extract datas from the request */
            const post = await Post.findById(req.params.id); /* find the post by id */
             
            // if the id post doesn't exist it returns 404
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }            
            // if the user is not the owner of the post it returns 403
            if (post.user.toString() !== user) {
                return res.status(403).json({ message: "You are not authorized to modify this post" });
            }

            if (title) post.title = title;
            if (content) post.content = content;

            // Salva le modifiche
            const savedPost = await post.save();

            // Risposta di successo
            res.status(200).json({
                message: "Post updated successfully",
                savedPost,
            });
        } catch (error) {
            // Gestione degli errori
            res.status(500).json({ message: `Error in modifyPost: ${error.message}` });
        }
    },
    deletePost: async (req, res) => {
        try {
            const post = await Post.findByIdAndDelete(req.params.id, { __v: 0 });
            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ message: `from deletePost: ${error.message}` });
        }
    }
}