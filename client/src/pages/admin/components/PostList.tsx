import { Loader2, Trash2, Edit } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Post } from '@/types/post';
import { MOOD_COLORS, MOOD_EMOJI } from '../constants';

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
    <div className="rounded-lg border border-purple-500/20 bg-slate-800/50 backdrop-blur-sm overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-purple-500/20 hover:bg-slate-700/50">
            <TableHead className="text-gray-300 font-semibold">Mood</TableHead>
            <TableHead className="text-gray-300 font-semibold">Caption</TableHead>
            <TableHead className="text-gray-300 font-semibold">Images</TableHead>
            <TableHead className="text-gray-300 font-semibold">Videos</TableHead>
            <TableHead className="text-gray-300 font-semibold">Created</TableHead>
            <TableHead className="text-gray-300 font-semibold">Media Preview</TableHead>
            <TableHead className="text-gray-300 font-semibold text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow
              key={post.id}
              className="border-purple-500/20 hover:bg-slate-700/50 transition-colors duration-200"
            >
              {/* Mood */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{MOOD_EMOJI[post.mood]}</span>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${MOOD_COLORS[post.mood]}`}
                  >
                    {post.mood}
                  </span>
                </div>
              </TableCell>

              {/* Caption */}
              <TableCell className="text-gray-200 max-w-xs truncate">
                {post.caption || <span className="text-gray-500 italic">Untitled</span>}
              </TableCell>

              {/* Images count */}
              <TableCell className="text-gray-300">
                {post.pictures?.length ?? 0}
              </TableCell>

              {/* Videos count */}
              <TableCell className="text-gray-300">
                {post.videos?.length ?? 0}
              </TableCell>

              {/* Created date */}
              <TableCell className="text-gray-400 text-sm">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </TableCell>

              {/* Media preview */}
              <TableCell>
                <div className="flex gap-1">
                  {(post.pictures ?? []).slice(0, 2).map((pic) => (
                    <img
                      key={pic.id}
                      src={pic.url}
                      alt="thumbnail"
                      className="w-12 h-12 object-cover rounded border border-purple-500/30 hover:border-purple-400 transition-colors"
                    />
                  ))}
                  {(post.videos ?? []).slice(0, 2).map((video) => (
                    <div
                      key={video.id}
                      className="relative w-12 h-12 overflow-hidden rounded border border-purple-500/30 hover:border-purple-400 transition-colors"
                    >
                      <img
                        src={video.thumbnailUrl || 'https://via.placeholder.com/48'}
                        alt="video thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-white text-xs">▶</div>
                      </div>
                    </div>
                  ))}
                  {((post.pictures?.length ?? 0) + (post.videos?.length ?? 0) > 4) && (
                    <div className="w-12 h-12 rounded border border-purple-500/30 flex items-center justify-center bg-slate-700/50 text-xs text-gray-400 font-semibold">
                      +{((post.pictures?.length ?? 0) + (post.videos?.length ?? 0)) - 4}
                    </div>
                  )}
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(post)}
                    className="gap-1 bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <Edit size={14} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDelete(post.id)}
                    className="gap-1 bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
