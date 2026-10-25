import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // Lifts the border to balayong pink on hover, for cards that are links.
  hoverable?: boolean;
}

export function Card({ children, className, hoverable = false }: CardProps) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-xl border border-gray-200 bg-white',
        hoverable &&
          'transition-colors hover:border-balayong-300 hover:bg-balayong-50/40',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('p-5 md:p-8', className)}>{children}</div>;
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('p-5', className)}>{children}</div>;
}
