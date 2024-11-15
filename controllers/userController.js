import {User} from "../models/User.js";
import mongoose from "mongoose";

export const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.find({}, { /*_id: 0,*/ __v: 0 });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({  message: `from getAllUsers: ${error.message}`  });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: `from getUserById: ${error.message}` });
        }
    },

    createUser: async (req, res) => {
        try {
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(500).json({ message: `from createUser: ${error.message}` });
        }
    },

    modifyUser: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            user.set(req.body);
            await user.save();
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: `from modifyUser: ${error.message}` });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: `from deleteUser: ${error.message}` });
        }
    }
}