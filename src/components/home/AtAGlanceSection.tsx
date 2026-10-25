import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { demographics, competitiveIndex } from '../../data/statistics';
import { cityBudget } from '../../data/transparency';

const numberFormat = new Intl.NumberFormat('en-US');
const billions = (n: number) => `₱${(n / 1e9).toFixed(2)} billion`;

// Two sourced facts that say more about the city than its size alone.
const strongestPillar = [...competitiveIndex.pillars].sort(
  (a, b) => a.rank - b.rank
)[0];
const biggestSector = [...cityBudget.sectors].sort(
  (a, b) => b.amount - a.amount
)[0];

export default function AtAGlanceSection() {
  const { t } = useTranslation('common');

  const stats = [
    {
      value: numberFormat.format(demographics.population.total),
      label: t('statistics.populationLabel'),
      source: `${demographics.population.year} ${demographics.population.source}`,
      sourceUrl: demographics.population.sourceUrl,
    },
    {
      value: String(demographics.barangayCount),
      label: t('statistics.barangaysLabel'),
      source: t('statistics.administrativeUnits'),
    },
    {
      value: '1st',
      label: t('statistics.incomeClassificationLabel'),
      source: demographics.incomeClass,
    },
    {
      value: `${numberFormat.format(demographics.landAreaKm2)} km²`,
      label: t('statistics.landAreaShortLabel'),
      source: t('statistics.totalCityArea'),
    },
  ];

  return (
    <Section className="bg-balayong-50">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div>
          <Heading level={2}>{t('glance.title')}</Heading>
          <p className="max-w-prose text-lg text-gray-600">
            {t('glance.subtitle')}
          </p>
        </div>
        <Link
          to="/statistics"
          className="font-bold text-primary-700 underline decoration-primary-200 decoration-2 underline-offset-4 hover:decoration-primary-600"
        >
          {t('statistics.viewFullProfile')}
        </Link>
      </div>

      <dl className="grid grid-cols-2 gap-y-8 lg:grid-cols-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="border-l-2 border-balayong-300 pl-4 pr-2"
          >
            <dt className="text-sm font-bold text-gray-700">{stat.label}</dt>
            <dd className="mt-1 font-display text-3xl text-primary-800 tabular-nums md:text-4xl">
              {stat.value}
            </dd>
            <dd className="mt-1 text-xs text-gray-600">
              {stat.sourceUrl ? (
                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-primary-700"
                >
                  {stat.source}
                </a>
              ) : (
                stat.source
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Link
          to="/statistics"
          className="group rounded-xl border border-balayong-200 bg-white p-5 transition-colors hover:border-balayong-400 md:p-6"
        >
          <p className="font-display text-2xl text-gray-900">
            {t('glance.cmciTitle', { rank: competitiveIndex.overallRank })}
          </p>
          <p className="mt-2 text-gray-700">
            {t('glance.cmciBody', {
              year: competitiveIndex.year,
              pillar: strongestPillar.name,
              rank: strongestPillar.rank,
            })}
          </p>
          <span className="mt-3 inline-block font-bold text-primary-700 underline decoration-primary-200 decoration-2 underline-offset-4 group-hover:decoration-primary-600">
            {t('statistics.viewFullProfile')}
          </span>
        </Link>
        <Link
          to="/transparency"
          className="group rounded-xl border border-balayong-200 bg-white p-5 transition-colors hover:border-balayong-400 md:p-6"
        >
          <p className="font-display text-2xl text-gray-900">
            {t('glance.budgetTitle', {
              amount: billions(cityBudget.totalAppropriations),
              year: cityBudget.year,
            })}
          </p>
          <p className="mt-2 text-gray-700">
            {t('glance.budgetBody', {
              sector: biggestSector.name,
              amount: billions(biggestSector.amount),
            })}
          </p>
          <span className="mt-3 inline-block font-bold text-primary-700 underline decoration-primary-200 decoration-2 underline-offset-4 group-hover:decoration-primary-600">
            {t('statistics.viewTransparency')}
          </span>
        </Link>
      </div>
    </Section>
  );
}
