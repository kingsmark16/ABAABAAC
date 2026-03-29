import { Trash2, Edit } from 'lucide-react';
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

interface PostTableProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export function PostTable({ posts, onEdit, onDelete }: PostTableProps) {
  return (
    <div className="rounded-lg border border-purple-500/20 bg-slate-800/30 backdrop-blur-sm overflow-hidden hover:border-purple-500/30 transition-all duration-300">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-40">Post Title</TableHead>
            <TableHead className="w-24">Mood</TableHead>
            <TableHead className="w-40">Images</TableHead>
            <TableHead className="w-40">Videos</TableHead>
            <TableHead className="w-40">Created Date</TableHead>
            <TableHead className="w-32 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              {/* Title */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{MOOD_EMOJI[post.mood]}</span>
                  <span className="font-medium text-white truncate">
                    {post.caption || 'Untitled Post'}
                  </span>
                </div>
              </TableCell>

              {/* Mood Badge */}
              <TableCell>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${MOOD_COLORS[post.mood]}`}
                >
                  {post.mood}
                </span>
              </TableCell>

              {/* Images */}
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {post.picture?.url ? (
                    <div
                      key={post.picture.id}
                      className="relative w-12 h-12 rounded overflow-hidden border border-purple-500/30 hover:border-purple-500/60 transition-colors"
                    >
                      <img
                        src={post.picture.url}
                        alt="Post image"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">No image</span>
                  )}
                </div>
              </TableCell>

              {/* Videos */}
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {post.video?.url ? (
                    <div
                      key={post.video.id}
                      className="relative w-12 h-12 rounded overflow-hidden border border-purple-500/30 hover:border-purple-500/60 transition-colors group"
                    >
                      {post.video.thumbnailUrl ? (
                        <>
                          <img
                            src={post.video.thumbnailUrl}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                            <div className="text-white text-xs font-semibold">▶</div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                          <div className="text-white text-lg">▶</div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">No video</span>
                  )}
                </div>
              </TableCell>

              {/* Created Date */}
              <TableCell>
                <span className="text-sm text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  <span className="text-gray-500">
                    {new Date(post.createdAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(post)}
                    className="gap-1 bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
                    title="Edit post"
                  >
                    <Edit size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onDelete(post.id)}
                    className="gap-1 bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300"
                    title="Delete post"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Delete</span>
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
