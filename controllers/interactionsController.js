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
			const filteredInteractions = interactions.filter(
				interaction => interaction.user !== null
			);
			res.status(200).json(filteredInteractions);
		} catch (error) {
			res.status(400).json({message: error.message});
		}
	},

    getInteractionById: async (req, res) => {
        try {
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
    
            // Validazione del tipo di interazione
            const validTypes = ["like", "comment"];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ message: "Invalid interaction type" });
            }
    
            // Validazione del campo `content` se il tipo è `comment`
            if (type === "comment" && (!content || typeof content !== "string")) {
                return res.status(400).json({ message: "Content is required for comments" });
            }
    
            // Trova il post e l'utente
            const post = await Post.findById(postId).session(session);
            const user = await User.findById(userId).session(session);
    
            // Controlla se il post o l'utente esistono
            if (!post || !user) {
                return res.status(404).json({ message: "Post or User not found" });
            }
    
            // Crea l'interazione
            const interaction = await Interaction.create(
                [{ type, post: postId, user: userId, content }], 
                { session }
            );
    
            // Aggiorna il post con l'ID della nuova interazione
            post.interactions.push(interaction[0]._id);
            await post.save({ session });
    
            // Conferma la transazione
            await session.commitTransaction();
            session.endSession();
    
            // Restituisci l'interazione creata, popolando i riferimenti
            const populatedInteraction = await Interaction.findById(interaction[0]._id)
                .populate("post", "title")
                .populate("user", ["nickname", "city"]);
    
            res.status(201).json({
                message: "Interaction created successfully",
                interaction: populatedInteraction
            });
    
        } catch (error) {
            await session.abortTransaction(); // Annulla la transazione in caso di errore
            session.endSession();
    
            // Restituisci un messaggio di errore
            res.status(500).json({ message: `Error in createInteraction: ${error.message}` });
        }
    },

    modifyInteraction: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
    
        try {
            const interaction = await Interaction.findById(req.params.id).session(session);
    
            if (!interaction) {
                return res.status(404).json({ message: "Interaction not found" });
            }
    
            const { user: userId, type, content } = req.body;
    
            // Validazione del tipo di interazione
            const validTypes = ["like", "comment"];
            if (!validTypes.includes(type)) {
                return res.status(400).json({ message: "Invalid interaction type" });
            }
    
            // Trova l'utente e verifica che sia autorizzato
            const user = await User.findById(userId).session(session);
            if (!user || user._id.toString() !== interaction.user.toString()) {
                return res.status(403).json({ message: "You are not authorized to modify this interaction" });
            }
    
            // Logica per la gestione del campo `content`
            if (interaction.type === "comment" && type === "like") {
                // Se il tipo cambia da "comment" a "like", usa $unset per rimuovere `content`
                await Interaction.updateOne(
                    { _id: interaction._id },
                    { $unset: { content: null } },
                    { session }
                );
            } else if (type === "comment") {
                // Se rimane "comment", verifica che `content` sia valido
                if (!content || typeof content !== "string") {
                    return res.status(400).json({ message: "Content is required for comments" });
                }
                interaction.content = content; // Aggiorna il contenuto
            }
    
            // Aggiorna il tipo
            interaction.type = type;
    
            // Salva le modifiche
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