import { Trash2, Edit, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Post } from '@/types/admin';
import { MOOD_COLORS, MOOD_EMOJI } from '../constants';

interface PostCardProps {
  post: Post;
  index: number;
  onEdit: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export function PostCard({ post, index, onEdit, onDelete }: PostCardProps) {
  const hasMedia = (post.pictures?.length ?? 0) > 0 || (post.videos?.length ?? 0) > 0;

  return (
    <Card
      className="bg-slate-800/50 border border-purple-500/20 backdrop-blur-sm hover:border-purple-500/40 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20 animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Post info */}
          <div className="flex-1">
            <CardTitle className="text-2xl text-white mb-2 flex items-center gap-2">
              <span>{MOOD_EMOJI[post.mood]}</span>
              {post.caption || 'Untitled Post'}
            </CardTitle>

            <CardDescription className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${MOOD_COLORS[post.mood]}`}
              >
                {post.mood}
              </span>
              <span className="text-gray-400">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </CardDescription>
          </div>

          {/* Actions */}
          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(post)}
              className="gap-2 flex-1 md:flex-none bg-blue-500/20 border-blue-500/30 text-blue-300 hover:bg-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
            >
              <Edit size={16} />
              Edit
            </Button>
            <Button
              size="sm"
              onClick={() => onDelete(post.id)}
              className="gap-2 flex-1 md:flex-none bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30 hover:border-red-500/50 transition-all duration-300"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Media preview grid */}
        {hasMedia && (
          <div className="mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(post.pictures ?? []).map((pic) => (
                <div key={pic.id} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={pic.url}
                    alt="Post"
                    className="w-full aspect-square object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg" />
                </div>
              ))}

              {(post.videos ?? []).map((video) => (
                <div key={video.id} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={video.thumbnailUrl || 'https://via.placeholder.com/150'}
                    alt="Video thumbnail"
                    className="w-full aspect-square object-cover rounded-lg transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-all duration-300 rounded-lg">
                    <div className="text-white text-sm font-semibold bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                      {Math.floor(video.length / 60)}:
                      {String(video.length % 60).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Media counts */}
        <div className="text-sm text-gray-400 flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Image size={14} /> {post.pictures?.length ?? 0} image(s)
          </span>
          <span className="flex items-center gap-1">
            <Video size={14} /> {post.videos?.length ?? 0} video(s)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
