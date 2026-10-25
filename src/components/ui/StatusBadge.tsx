import { useTranslation } from 'react-i18next';

const STATUS_STYLES: Record<string, string> = {
  Completed: 'bg-green-50 text-green-700',
  'On-Going': 'bg-amber-50 text-amber-700',
  'For Procurement': 'bg-gray-100 text-gray-600',
  Terminated: 'bg-red-50 text-red-700',
};

const STATUS_DOTS: Record<string, string> = {
  Completed: 'bg-green-500',
  'On-Going': 'bg-amber-500',
  'For Procurement': 'bg-gray-400',
  Terminated: 'bg-red-500',
};

export function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation('common');
  const pillClass = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600';
  const dotClass = STATUS_DOTS[status] ?? 'bg-gray-400';

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${pillClass}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {t(`transparency.status.${status}`, { defaultValue: status })}
    </span>
  );
}
