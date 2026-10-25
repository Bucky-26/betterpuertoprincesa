import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import BalayongBranch from '../ui/BalayongBranch';

export default function DirectoryBanner() {
  const { t } = useTranslation('common');
  return (
    <div className="relative overflow-hidden bg-balayong-200 text-gray-900">
      {/* Mirrored branch reaching in from the left gutter (wide screens only,
          where it can't sit under the text). */}
      <BalayongBranch className="pointer-events-none absolute -top-6 -left-36 hidden w-[22rem] -scale-x-100 xl:block" />
      <div className="relative container mx-auto flex flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-3xl">{t('directory.title')}</h2>
          <p className="mt-2 max-w-xl text-gray-800">
            {t('directory.subtitle')}
          </p>
        </div>
        <Link
          to="/government/departments"
          className="shrink-0 rounded-full bg-primary-700 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-800"
        >
          {t('directory.viewDirectory')}
        </Link>
      </div>
    </div>
  );
}
