import {Interaction } from "../models/Interaction.js";


export const interactionController = {
    getAllInteractions: async (req, res) => {
        try {
            const interactions = await Interaction.find({__v: 0}).sort({ createdAt: -1 });
            res.status(200).json(interactions);
        } catch (error) {
            res.status(500).json({ message: `from getAllInteractions: ${error.message}` });
        }
    }
}