import { Image, Video, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PostFormData } from '@/types/admin';
import { MOOD_OPTIONS } from '../constants';

interface PostFormProps {
  formData: PostFormData;
  isSubmitting: boolean;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'images' | 'videos') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function PostForm({
  formData,
  isSubmitting,
  isEditing,
  onInputChange,
  onFileChange,
  onSubmit,
}: PostFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Caption */}
      <div className="space-y-2">
        <Label htmlFor="caption" className="text-gray-300 text-sm font-semibold">
          Caption
        </Label>
        <Input
          id="caption"
          name="caption"
          value={formData.caption}
          onChange={onInputChange}
          placeholder="Enter post caption..."
          className="bg-slate-700 border-purple-500/30 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 rounded-lg"
        />
      </div>

      {/* Mood */}
      <div className="space-y-2">
        <Label htmlFor="mood" className="text-gray-300 text-sm font-semibold">
          Mood
        </Label>
        <select
          id="mood"
          name="mood"
          value={formData.mood}
          onChange={onInputChange}
          className="w-full px-4 py-2 bg-slate-700 border border-purple-500/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
        >
          {MOOD_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Images */}
      <FileField
        id="images"
        label="Images"
        icon={<Image size={16} />}
        accept="image/*"
        count={formData.images.length}
        onChange={(e) => onFileChange(e, 'images')}
      />

      {/* Videos */}
      <FileField
        id="videos"
        label="Videos"
        icon={<Video size={16} />}
        accept="video/*"
        count={formData.videos.length}
        onChange={(e) => onFileChange(e, 'videos')}
      />

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gap-2 bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
      >
        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
        {isSubmitting ? 'Submitting...' : isEditing ? 'Update Post' : 'Create Post'}
      </Button>
    </form>
  );
}

/* ------------------------------------------------------------------ */

interface FileFieldProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  accept: string;
  count: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function FileField({ id, label, icon, accept, count, onChange }: FileFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-gray-300 text-sm font-semibold flex items-center gap-2">
        {icon} {label}
      </Label>
      <Input
        id={id}
        type="file"
        multiple
        accept={accept}
        onChange={onChange}
        className="bg-slate-700 border-purple-500/30 text-white cursor-pointer rounded-lg transition-all hover:border-purple-400"
      />
      {count > 0 && (
        <p className="text-sm text-purple-300 mt-2 flex items-center gap-1">
          <CheckCircle size={14} /> {count} {label.toLowerCase()} selected
        </p>
      )}
    </div>
  );
}
