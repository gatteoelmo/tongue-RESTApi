import { interactionController } from "../controllers/interactionsController.js";
import express from "express";

const router = express.Router();

router.get('/', interactionController.getAllInteractions);
router.get('/:id', interactionController.getInteractionById);
router.post('/', interactionController.createInteraction);
router.patch('/:id', interactionController.modifyInteraction);
router.delete('/:id', interactionController.deleteInteraction);

export default router;