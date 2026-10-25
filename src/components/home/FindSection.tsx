import { Link } from 'react-router-dom';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import CategoryList, { type CategoryItem } from '../ui/CategoryList';
import { useTranslation } from '../../hooks/useTranslation';
import { serviceCategories, governmentCategories } from '../../data/yamlLoader';

const LIMIT = 4;

function Column({
  title,
  items,
  basePath,
  moreHref,
  moreLabel,
}: {
  title: string;
  items: CategoryItem[];
  basePath: string;
  moreHref: string;
  moreLabel: string;
}) {
  return (
    <div>
      <Heading level={3} className="mb-4">
        {title}
      </Heading>
      <CategoryList items={items.slice(0, LIMIT)} basePath={basePath} />
      <Link
        to={moreHref}
        className="mt-4 inline-block font-bold text-primary-700 underline decoration-primary-200 decoration-2 underline-offset-4 hover:decoration-primary-600"
      >
        {moreLabel}
      </Link>
    </div>
  );
}

export default function FindSection() {
  const { t } = useTranslation();
  return (
    <Section>
      <Heading level={2}>{t('home.findTitle')}</Heading>
      <p className="mb-10 max-w-prose text-lg text-gray-600">
        {t('home.findSubtitle')}
      </p>
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Column
          title={t('services.title')}
          items={serviceCategories.categories as CategoryItem[]}
          basePath="/services"
          moreHref="/services"
          moreLabel={t('services.viewAll')}
        />
        <Column
          title={t('governmentActivity.title')}
          items={governmentCategories.categories as CategoryItem[]}
          basePath="/government"
          moreHref="/government"
          moreLabel={t('governmentActivity.viewAll')}
        />
      </div>
    </Section>
  );
}
