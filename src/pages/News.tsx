import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import NewsList from '../components/ui/NewsList';
import PageHeader from '../components/ui/PageHeader';
import { news } from '../data/news';

const News: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <>
      <SEO
        title="News & Updates"
        description="Latest news and announcements from the City Government of Puerto Princesa."
        keywords="news, announcements, Puerto Princesa, city government"
      />
      <main className="flex-grow">
        <PageHeader title={t('news.title')} subtitle={t('news.subtitle')} />

        <Section>
          <div className="max-w-4xl">
            <NewsList
              items={[...news].sort((x, y) => y.date.localeCompare(x.date))}
            />
          </div>
        </Section>
      </main>
    </>
  );
};

export default News;
