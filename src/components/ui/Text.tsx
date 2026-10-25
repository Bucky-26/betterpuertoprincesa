import { cn } from '../../lib/utils';

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export function Text({
  size = 'md',
  className,
  children,
}: {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(sizes[size], 'mb-2 max-w-prose leading-relaxed', className)}
    >
      {children}
    </p>
  );
}
