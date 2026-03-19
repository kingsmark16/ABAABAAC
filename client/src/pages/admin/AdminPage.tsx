'use client';

import { useState, useCallback } from 'react';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Post, PostFormData } from '@/types/post';
import { usePosts, useCreatePost, useUpdatePost, useDeletePost } from '@/hooks/use-posts';
import { INITIAL_FORM_DATA } from './constants';
import { StatusMessage } from './components/StatusMessage';
import { PostForm } from './components/PostForm';
import { PostList } from './components/PostList';

const AdminPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState<PostFormData>({ ...INITIAL_FORM_DATA });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ── Queries & Mutations ──────────────────────────────────────────
  const { data: posts = [], isLoading } = usePosts();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();

  // ── Helpers ──────────────────────────────────────────────────────
  const showStatus = useCallback((type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    if (type === 'success') {
      setTimeout(() => setStatusMessage(null), 3000);
    }
  }, []);

  const resetForm = useCallback(() => {
    setEditingPost(null);
    setFormData({ ...INITIAL_FORM_DATA });
  }, []);

  const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      return err.response?.data?.error ?? 'Something went wrong';
    }
    return 'Something went wrong';
  };

  // ── Handlers ─────────────────────────────────────────────────────
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'videos') => {
    const files = Array.from(e.target.files ?? []);
    setFormData((prev) => ({ ...prev, [type]: files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingPost) {
        await updatePost.mutateAsync({ postId: editingPost.id, formData });
        showStatus('success', 'Post updated successfully!');
      } else {
        await createPost.mutateAsync(formData);
        showStatus('success', 'Post created successfully!');
      }

      resetForm();
      setDialogOpen(false);
    } catch (err) {
      showStatus('error', getErrorMessage(err));
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await deletePost.mutateAsync(postId);
      showStatus('success', 'Post deleted successfully!');
    } catch (err) {
      showStatus('error', getErrorMessage(err));
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setFormData({ caption: post.caption ?? '', mood: post.mood, images: [], videos: [] });
    setDialogOpen(true);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) resetForm();
    setDialogOpen(open);
  };

  const isSubmitting = createPost.isPending || updatePost.isPending;

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%      { transform: translate(30px, -50px) scale(1.1); }
          66%      { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob          { animation: blob 7s infinite; }
        .animation-delay-2000  { animation-delay: 2s; }
        .animation-delay-4000  { animation-delay: 4s; }
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-300 text-lg">Manage and create amazing posts</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                <Plus size={20} className="animate-pulse" />
                Create Post
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl bg-slate-800 border border-purple-500/30 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  {editingPost
                    ? 'Update your post details and media'
                    : 'Add a new post with images and videos'}
                </DialogDescription>
              </DialogHeader>

              <PostForm
                formData={formData}
                isSubmitting={isSubmitting}
                isEditing={!!editingPost}
                onInputChange={handleInputChange}
                onFileChange={handleFileChange}
                onSubmit={handleSubmit}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* ── Status messages ──────────────────────────────────── */}
        {statusMessage && (
          <StatusMessage type={statusMessage.type} message={statusMessage.text} />
        )}

        {/* ── Post list ────────────────────────────────────────── */}
        <PostList
          posts={posts}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AdminPage;
