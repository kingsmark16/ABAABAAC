import { Router } from "express";
import { getFeaturedPost, getPostById, getPosts } from "../controllers/public.controller";

const router = Router();

router.get('/', getPosts);
router.get('/post/:id', getPostById);
router.get('/posts/featured', getFeaturedPost);


export default router;
