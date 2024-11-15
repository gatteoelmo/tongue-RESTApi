import { userController } from "../controllers/userController.js";
import express from "express";

const router = express.Router();

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.patch('/:id', userController.modifyUser);
router.delete('/:id', userController.deleteUser);

export default router;