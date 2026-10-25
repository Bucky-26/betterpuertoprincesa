import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import NewsList from '../ui/NewsList';
import BalayongBranch from '../ui/BalayongBranch';
import { news } from '../../data/news';

export default function HomeNewsSection() {
  const { t } = useTranslation('common');
  const items = [...news]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  return (
    <Section className="relative overflow-hidden bg-balayong-50">
      {/* Fills the empty space beside the news column on wide screens. */}
      <BalayongBranch className="pointer-events-none absolute top-44 -right-16 hidden w-[26rem] xl:block" />
      <div className="relative mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <Heading level={2}>{t('news.title')}</Heading>
          <p className="max-w-prose text-lg text-gray-600">
            {t('news.subtitle')}
          </p>
        </div>
        <Link
          to="/news"
          className="font-bold text-primary-700 underline decoration-primary-200 decoration-2 underline-offset-4 hover:decoration-primary-600"
        >
          {t('news.viewAll')}
        </Link>
      </div>
      <div className="relative max-w-4xl">
        <NewsList items={items} />
      </div>
    </Section>
  );
}
