import {
  Users,
  MapPin,
  Ruler,
  Award,
  TrendingUp,
  Landmark,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import PageHeader from '../components/ui/PageHeader';
import type { BarangayMapHandle } from '../components/map/BarangayMap';
import { BarangayMap } from '../components/map/LazyMaps';
import { demographics, competitiveIndex } from '../data/statistics';

const numberFormat = new Intl.NumberFormat('en-US');

const Statistics: React.FC = () => {
  const { t } = useTranslation('common');
  const [hoveredBarangay, setHoveredBarangay] = useState<string | null>(null);
  const mapRef = useRef<BarangayMapHandle>(null);

  const metrics = [
    {
      icon: Users,
      value: numberFormat.format(demographics.population.total),
      label: t('statistics.populationLabel'),
      source: `${demographics.population.year} ${demographics.population.source}`,
      sourceUrl: demographics.population.sourceUrl,
    },
    {
      icon: MapPin,
      value: String(demographics.barangayCount),
      label: t('statistics.barangaysLabel'),
      source: t('statistics.administrativeUnits'),
    },
    {
      icon: Ruler,
      value: numberFormat.format(demographics.landAreaKm2),
      label: t('statistics.landAreaLabel'),
      source: t('statistics.totalCityArea'),
    },
    {
      icon: Award,
      value: '1st',
      label: t('statistics.incomeClassLabel'),
      source: demographics.incomeClass,
    },
  ];

  return (
    <>
      <SEO
        title="City Statistics"
        description="Demographics, competitiveness index, and fiscal transparency data for Puerto Princesa City, Palawan."
        keywords="statistics, demographics, population, barangays, competitiveness index, fiscal transparency, Puerto Princesa"
      />
      <main className="flex-grow">
        <PageHeader
          title={t('statistics.title')}
          subtitle={t('statistics.subtitle', {
            city: demographics.city,
            province: demographics.province,
          })}
        />

        <Section>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map(m => (
              <div
                key={m.label}
                className="bg-white rounded-lg border border-gray-200 p-6 text-center shadow-sm"
              >
                <m.icon
                  className="h-8 w-8 mx-auto mb-3 text-primary-600"
                  strokeWidth={2.5}
                />
                <div className="text-3xl font-bold text-gray-900">
                  {m.value}
                </div>
                <div className="text-sm font-medium text-gray-700 mt-1">
                  {m.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {m.sourceUrl ? (
                    <a
                      href={m.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-primary-600"
                    >
                      {m.source}
                    </a>
                  ) : (
                    m.source
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section className="!bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp
              className="h-6 w-6 text-primary-600"
              strokeWidth={2.5}
            />
            <Heading level={2} className="!mb-0">
              {t('statistics.competitivenessTitle')}
            </Heading>
          </div>
          <Text className="!max-w-2xl">
            {competitiveIndex.description}. {t('statistics.overallRank')}{' '}
            <strong>#{competitiveIndex.overallRank}</strong> (
            {competitiveIndex.year} {t('statistics.cmciYear')}).
          </Text>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
            {competitiveIndex.pillars.map(p => (
              <div
                key={p.name}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="text-xs font-semibold text-gray-500 uppercase">
                  {p.name}
                </div>
                <div className="text-2xl font-bold text-primary-600 mt-1">
                  #{p.rank}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {t('statistics.score')}: {p.score.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <Text size="sm" className="!text-gray-400 mt-4">
            {t('statistics.source')}: {competitiveIndex.source}
          </Text>
        </Section>

        <Section>
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="h-6 w-6 text-primary-600" strokeWidth={2.5} />
            <Heading level={2} className="!mb-0">
              {t('statistics.fiscalTitle')}
            </Heading>
          </div>
          <Text className="!max-w-2xl">{t('statistics.fiscalTeaser')}</Text>
          <Link
            to="/transparency"
            className="inline-block mt-4 px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-md hover:bg-primary-700 transition-colors"
          >
            {t('statistics.viewTransparency')}
          </Link>
        </Section>

        <Section className="!bg-gray-50">
          <Heading level={2}>
            {t('statistics.barangaysHeading', {
              count: demographics.barangayCount,
            })}
          </Heading>
          <Text className="!max-w-2xl !mb-6">
            {t('statistics.barangayMapSubtitle')}
          </Text>
          <BarangayMap ref={mapRef} highlightedName={hoveredBarangay} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-8">
            {demographics.barangays.map(b => (
              <button
                key={b}
                type="button"
                onMouseEnter={() => setHoveredBarangay(b)}
                onMouseLeave={() => setHoveredBarangay(null)}
                onClick={() => mapRef.current?.focusByName(b)}
                className="text-sm text-left text-gray-700 bg-white border border-gray-200 rounded px-3 py-2 cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors outline-none focus:outline-none focus-visible:outline-none"
              >
                {b}
              </button>
            ))}
          </div>
        </Section>
      </main>
    </>
  );
};

export default Statistics;
