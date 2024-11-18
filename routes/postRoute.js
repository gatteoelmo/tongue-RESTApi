import { postController } from "../controllers/postsController.js";
import express from "express";

const router = express.Router();

router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);
router.get('/bydate/:date', postController.filterPostsByDate);
router.post('/', postController.createPost);
router.patch('/:id', postController.modifyPost);
router.delete('/:id', postController.deletePost);

export default router;