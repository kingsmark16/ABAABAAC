import axios from 'axios';
import type { Post, PostFormData } from '@/types/post';

const API_BASE = 'http://localhost:3000/api/admin';

export const adminService = {
  getPosts: async (): Promise<Post[]> => {
    const { data } = await axios.get(API_BASE);
    return Array.isArray(data) ? data : [];
  },

  createPost: async (formData: PostFormData): Promise<Post> => {
    const form = new FormData();
    form.append('caption', formData.caption);
    form.append('mood', formData.mood);

    formData.images.forEach((file) => form.append('images', file));
    formData.videos.forEach((file) => form.append('videos', file));

    const { data } = await axios.post(API_BASE, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },

  deletePost: async (postId: string): Promise<void> => {
    await axios.delete(`${API_BASE}/${postId}`);
  },

  /**
   * "Update" a post by deleting and re-creating it.
   * Replace with a proper PATCH/PUT when available.
   */
  updatePost: async (postId: string, formData: PostFormData): Promise<Post> => {
    await adminService.deletePost(postId);
    return adminService.createPost(formData);
  },
} as const;
