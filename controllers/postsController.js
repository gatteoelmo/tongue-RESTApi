import { Post } from "../models/Post.js";
import { User } from "../models/User.js";

export const postController = {
    getAllPosts: async (req, res) => {
        try {
            // recover all posts, populate interactions and sort by creation date 
            const posts = await Post.find()
                .populate({
                    path: 'interactions',
                    select: 'type user content timestamp',
                    populate: { path: 'user', select: 'nickname city' },
                })
                .sort({ createdAt: -1 }); // order by creation date
    
            // add likeCount and commentCount to each post
            const postsWithAggregates = posts.map(post => {
                const likeCount = post.interactions.filter(interaction => interaction.type === 'like').length;
                const commentCount = post.interactions.filter(interaction => interaction.type === 'comment').length;
    
                return {
                    ...post.toObject(),
                    likeCount,
                    commentCount,
                };
            });
    
            res.status(200).json(postsWithAggregates);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    filterPostsByDate : async (req, res) => {
        const { date } = req.params; // get the date from the request
    
        if (!date) {
            return res.status(400).json({ message: 'Date query parameter is required' });
        } // if the date is not provided --> error

        try {
            const startDate = new Date(date); 
            const endDate = new Date(startDate); 
            endDate.setDate(startDate.getDate() + 1); // filter for a day
    
            // recover all posts, populate interactions and sort by creation date
            const posts = await Post.find({ createdAt: { $gte: startDate, $lt: endDate } })
                .populate({
                    path: 'interactions',
                    select: 'type user timestamp',
                    populate: { path: 'user', select: 'nickname city' },
                })
                .sort({ createdAt: -1 });
    
            res.status(200).json(posts);
        } catch (error) {
            res.status(500).json({ error: error.message });
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
            // extract datas from the request
            const { title, content, user} = req.body;
            const userExists = await User.findById(user);

            // if the user doesn't exist it returns 404
            if (!userExists) {
                return res.status(404).json({ message: "You're not part of the club" });
            };

            // create the post
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

            // save the post
            const savedPost = await post.save();

            res.status(200).json({
                message: "Post updated successfully",
                savedPost,
            });
        } catch (error) {
            res.status(500).json({ message: `Error in modifyPost: ${error.message}` });
        }
    },
    deletePost: async (req, res) => {
        try {
            const { user } = req.body;
            const post = await Post.findByIdAndDelete(req.params.id, { __v: 0 });

            if (!post) {
                return res.status(404).json({ message: "Post not found" });
            }
            if (post.user.toString() !== user) {
                return res.status(403).json({ message: "You are not authorized to delete this post" });
            } // if the user is not the owner of the post it returns 403

            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ message: `from deletePost: ${error.message}` });
        }
    }
}