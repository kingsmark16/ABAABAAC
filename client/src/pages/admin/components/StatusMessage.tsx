import { CheckCircle, AlertCircle } from 'lucide-react';

interface StatusMessageProps {
  type: 'success' | 'error';
  message: string;
}

const styles = {
  success:
    'bg-linear-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30',
  error:
    'bg-linear-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30',
} as const;

const icons = {
  success: CheckCircle,
  error: AlertCircle,
} as const;

export function StatusMessage({ type, message }: StatusMessageProps) {
  const Icon = icons[type];

  return (
    <div
      className={`mb-6 p-4 rounded-lg border backdrop-blur-sm flex items-center gap-2 animate-in slide-in-from-top duration-300 ${styles[type]}`}
    >
      <Icon size={20} />
      {message}
    </div>
  );
}
