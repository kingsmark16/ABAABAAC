import axiosInstance from "@/lib/axios";
import type { Post } from "@/types/post";


export const publicService = {
    getFeaturedPost: async (): Promise<Post | null> => {
        const { data } = await axiosInstance.get('/public/posts/featured');
        return data ?? null;
    }
}