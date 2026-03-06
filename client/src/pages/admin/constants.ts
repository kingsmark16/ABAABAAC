import type { Mood } from '@/types/admin';

export const MOOD_COLORS: Record<Mood, string> = {
  HAPPY: 'bg-linear-to-br from-yellow-100 to-amber-100 text-yellow-900 border border-yellow-200',
  SAD: 'bg-linear-to-br from-blue-100 to-cyan-100 text-blue-900 border border-blue-200',
  RAGE: 'bg-linear-to-br from-red-100 to-pink-100 text-red-900 border border-red-200',
};

export const MOOD_EMOJI: Record<Mood, string> = {
  HAPPY: '😊',
  SAD: '😢',
  RAGE: '😠',
};

export const MOOD_OPTIONS: { value: Mood; label: string }[] = [
  { value: 'HAPPY', label: '😊 Happy' },
  { value: 'SAD', label: '😢 Sad' },
  { value: 'RAGE', label: '😠 Rage' },
];

export const INITIAL_FORM_DATA = {
  caption: '',
  mood: 'HAPPY' as Mood,
  images: [] as File[],
  videos: [] as File[],
};
