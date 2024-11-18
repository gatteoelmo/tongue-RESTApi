import mongoose from "mongoose";
import {Interaction } from "../models/Interaction.js";
import { Post } from "../models/Post.js";
import { User } from "../models/User.js";


export const interactionController = {
    getAllInteractions: async (req, res) => {
        try {
            // find all interactions
            const interactions = await Interaction.find({__v: 0}).sort({ createdAt: -1 });
            res.status(200).json(interactions);
        } catch (error) {
            res.status(500).json({ message: `from getAllInteractions: ${error.message}` });
        }
    },

    filterSearch : async (req, res) => {
		try {
			const interactionQuery = {}; // filter for interactions
			const userQuery = {}; // filter for users
			const {istartDate, iendDate, userId, userName, userCity} = req.query;         
            
			// if these queries are not empty then add them to the filters
            if (userCity || userId || userName) {
				userCity && (userQuery.city = new RegExp(userCity, 'i')); 
				userId && (userQuery._id = new RegExp(userId, 'i'));
				userName && (userQuery.nickname = new RegExp(userName, 'i'));
			}
			if (istartDate || iendDate) {
				interactionQuery.insertionDate = {};
				istartDate &&
					(interactionQuery.insertionDate.$gte = new Date(istartDate));
				iendDate && (interactionQuery.insertionDate.$lte = new Date(iendDate));
			}

            // find the interactions 
			const interactions = await Interaction.find(interactionQuery).populate({
				path: 'user',
				match: userQuery,
			});
            // THE CODE BELOW IS FOR FILTERING OUT THE INTERACTIONS WHERE THE USER IS NULL
			// const filteredInteractions = interactions.filter(
			// 	interaction => interaction.user !== null
			// );
			res.status(200).json(interactions /* OR filteredInteractions */);
		} catch (error) {
			res.status(400).json({message: error.message});
		}
	},

    getInteractionById: async (req, res) => {
        try {
            // find the interaction by id that is a param of the request
            const interaction = await Interaction.findById(req.params.id, { __v: 0 });
            res.status(200).json(interaction);
        } catch (error) {
            res.status(500).json({ message: `from getInteractionById: ${error.message}` });
        }
    },

    createInteraction: async (req, res) => {
        const session = await mongoose.startSession(); 
        session.startTransaction();
    
        try {
            const { post: postId, user: userId, type, content } = req.body;
    
            // validate the type of the interaction
            const validTypes = ["like", "comment"];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ message: "Invalid interaction type" });
            }
    
            // if the type is comment, validate the content
            if (type === "comment" && (!content || typeof content !== "string")) {
                return res.status(400).json({ message: "Content is required for comments" });
            }
    
            // search for the post and the user
            const post = await Post.findById(postId).session(session);
            const user = await User.findById(userId).session(session);
    
            // the user and the post exist?
            if (!post || !user) {
                return res.status(404).json({ message: "Post or User not found" });
            }
    
            // create the interaction
            const interaction = await Interaction.create(
                [{ type, post: postId, user: userId, content }], 
                { session }
            );
    
            // add the interaction to the post
            post.interactions.push(interaction[0]._id);
            await post.save({ session });
    
            // commit the transaction
            await session.commitTransaction();
            session.endSession();
    
            // populate the interaction
            const populatedInteraction = await Interaction.findById(interaction[0]._id)
                .populate("post", "title")
                .populate("user", ["nickname", "city"]);
    
            res.status(201).json({
                message: "Interaction created successfully",
                interaction: populatedInteraction
            });
    
        } catch (error) {
            await session.abortTransaction(); // cancel the transaction
            session.endSession();
    
            // handle the error
            res.status(500).json({ message: `Error in createInteraction: ${error.message}` });
        }
    },

    modifyInteraction: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            // search for the interaction by id
            const interaction = await Interaction.findById(req.params.id).session(session);
    
            if (!interaction) {
                return res.status(404).json({ message: "Interaction not found" });
            }
    
            // Destructure the request body
            const { user: userId, type, content } = req.body;
    
            // validate the type of the interaction
            const validTypes = ["like", "comment"];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ message: "Invalid interaction type" });
            }
    
            // find the user and validate that the user is the owner of the interaction
            const user = await User.findById(userId).session(session);
            if (!user || user._id.toString() !== interaction.user.toString()) {
                return res.status(403).json({ message: "You are not authorized to modify this interaction" });
            }
    
            // Logic for type, if is comment must need content, if is like doesn't need content
            if (interaction.type === "comment" && type === "like") {
                // if the type is change from comment to like, remove the content whit unset
                await Interaction.updateOne(
                    { _id: interaction._id },
                    { $unset: { content: null } },
                    { session }
                );
            } else if (type === "comment") {
                // if the type is change from like to comment, validate the content
                if (!content || typeof content !== "string") {
                    return res.status(400).json({ message: "Content is required for comments" });
                }
                interaction.content = content; // update the content
            }
    
            // update the type
            interaction.type = type;
    
            // save the interaction
            await interaction.save({ session });
    
            await session.commitTransaction();
            session.endSession();
    
            res.status(200).json({
                message: "Interaction updated successfully",
                interaction,
            });
        } catch (error) {
            await session.abortTransaction(); 
            session.endSession();
    
            res.status(500).json({ message: `Error in modifyInteraction: ${error.message}` });
        }
    },
    
    
    deleteInteraction: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction(); 

        try {
            const interactionId = req.params.id;
            const userId = req.body.user;
    
            // search for the interaction
            const interaction = await Interaction.findById(interactionId).session(session);
            if (!interaction) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: "Interaction not found" });
            }
    
            // find the post linked to the interaction
            const post = await Post.findById(interaction.post).session(session);
            if (!post) {
                await session.abortTransaction();
                session.endSession();
                return res.status(404).json({ message: "Post not found" });
            }
    
            // compare the owner of the interaction and the owner of the post
            const ownerPost = post.user.toString();
            const ownerInteraction = interaction.user.toString();
            if (ownerPost !== userId && ownerInteraction !== userId) {
                await session.abortTransaction();
                session.endSession();
                return res.status(403).json({ message: "You are not authorized to delete this interaction" });
            }
    
            // delete the interaction
            await Interaction.findByIdAndDelete(interactionId).session(session);
    
            // delete the id from the post
            post.interactions = post.interactions.filter(
                (interactionIdInPost) => interactionIdInPost.toString() !== interactionId
            );
            await post.save({ session });
    
            await session.commitTransaction();
            session.endSession();
    
            res.status(200).json({
                message: "Interaction deleted successfully",
                interaction,
            });
        } catch (error) {
            await session.abortTransaction(); // cancel the transaction in case of error
            session.endSession();
            res.status(500).json({ message: `from deleteInteraction: ${error.message}` });
        }
    }
    
}