import Breadcrumbs from './Breadcrumbs';
import BalayongBranch from './BalayongBranch';

// Interior page header: same balayong ground as the home hero, with a
// branch reaching in from the right and a bay-blue rule underneath, so
// every page reads as part of one city.
export default function PageHeader({
  title,
  subtitle,
  breadcrumbs,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  return (
    <header className="relative overflow-hidden border-b-4 border-primary-800 bg-balayong-100">
      <BalayongBranch className="pointer-events-none absolute -top-10 -right-24 w-[20rem] opacity-50 md:-right-10 md:w-[26rem] md:opacity-100" />
      <div className="relative container mx-auto px-4 pt-6 pb-10 md:pb-14">
        <Breadcrumbs items={breadcrumbs} />
        <h1 className="mt-8 max-w-3xl font-display text-4xl leading-[1.08] text-gray-900 md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-700">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}
