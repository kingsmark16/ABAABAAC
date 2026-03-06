import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { Post } from '@/types/admin';
import { PostCard } from './PostCard';

interface PostListProps {
  posts: Post[];
  isLoading: boolean;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export function PostList({ posts, isLoading, onEdit, onDelete }: PostListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="relative">
          <Loader2 size={48} className="animate-spin text-purple-400" />
          <div className="absolute inset-0 blur-xl bg-purple-500/20 rounded-full" />
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card className="bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 transition-all duration-300">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="mb-4 text-4xl">📝</div>
          <p className="text-gray-300 text-lg">No posts yet. Create your first post!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
