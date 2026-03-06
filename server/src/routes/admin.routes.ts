import { Router } from "express";
import multer from "multer";
import { createPost, deletePost, getAllPosts, getPost } from "../controllers/admin.controller";
import { protectRoute } from "../middlewares/auth.middleware";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/',protectRoute, getAllPosts);
router.get('/:id', getPost);
router.post('/', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'videos', maxCount: 10 }]), createPost);
router.delete('/:id', deletePost);

export default router;