import { CircleAlert, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BannerProps {
  type?: 'info' | 'error';
  title?: string;
  description: React.ReactNode;
  icon?: boolean;
}

const styles = {
  info: 'border-primary-200 bg-primary-50 text-primary-900',
  error: 'border-error-200 bg-error-50 text-error-800',
};

export function Banner({
  type = 'info',
  title,
  description,
  icon = false,
}: BannerProps) {
  const Icon = type === 'error' ? CircleAlert : Info;
  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={cn('flex gap-3 rounded-xl border px-4 py-3', styles[type])}
    >
      {icon && <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
      <div>
        {title && <p className="font-bold">{title}</p>}
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
