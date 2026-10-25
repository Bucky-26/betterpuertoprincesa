import { cn } from '../../lib/utils';
export default function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={cn('py-12 md:py-16 bg-white', className)} id={id}>
      <div className="container mx-auto px-4">{children}</div>
    </section>
  );
}
