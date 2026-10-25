import {
  Landmark,
  Wallet,
  PiggyBank,
  ShieldAlert,
  HardHat,
  FileText,
  Route,
  Building2,
  Milestone,
  Waves,
  Droplet,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import PageHeader from '../components/ui/PageHeader';
import { BarChart } from '../components/ui/BarChart';
import { LineChart } from '../components/ui/LineChart';
import { StatusBadge } from '../components/ui/StatusBadge';
import {
  cityBudget,
  officialDocuments,
  dpwhProjects,
  annualBudgetHistory,
} from '../data/transparency';

const numberFormat = new Intl.NumberFormat('en-US');
const currencyFormat = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  maximumFractionDigits: 0,
});
const compactCurrencyFormat = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
  notation: 'compact',
  maximumFractionDigits: 1,
});

const maxSectorAmount = Math.max(...cityBudget.sectors.map(s => s.amount));

const categoryIcons: Record<string, LucideIcon> = {
  Roads: Route,
  'Buildings and Facilities': Building2,
  Bridges: Milestone,
  'Flood Control and Drainage': Waves,
  'Water Provision and Storage': Droplet,
};

// Validated categorical palette (adjacent-pair CVD-safe for line charts) —
// slot 1 swapped for this site's own brand blue; slots 2-4 are the
// dataviz skill's reference hues. Re-run scripts/validate_palette.js if
// this set changes.
const categoryColors: Record<string, string> = {
  Roads: '#0052bc',
  'Buildings and Facilities': '#eb6834',
  Bridges: '#1baf7a',
  'Water Provision and Storage': '#eda100',
};

const FLOOD_CONTROL = 'Flood Control and Drainage';

const Transparency: React.FC = () => {
  const { t } = useTranslation('common');

  const floodControlCategory = dpwhProjects.categories.find(
    c => c.name === FLOOD_CONTROL
  );
  const otherCategories = dpwhProjects.categories.filter(
    c => c.name !== FLOOD_CONTROL
  );
  const floodControlProjects = dpwhProjects.projects.filter(
    p => p.category === FLOOD_CONTROL
  );
  const otherProjectsTotal =
    dpwhProjects.summary.totalBudget - (floodControlCategory?.totalBudget ?? 0);
  const otherProjectsCount =
    dpwhProjects.summary.totalProjects - (floodControlCategory?.count ?? 0);

  return (
    <>
      <SEO
        title="Budget Transparency"
        description="Puerto Princesa City's official budget and National Tax Allotment, sourced from the City Government's Full Disclosure documents, plus DPWH infrastructure spending sourced from DPWH's public project database."
        keywords="transparency, budget, national tax allotment, NTA, GAO, Puerto Princesa, DPWH projects, public spending"
      />
      <main className="flex-grow">
        <PageHeader
          title={t('transparency.title')}
          subtitle={t('transparency.subtitle')}
        />

        <Section>
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="h-6 w-6 text-primary-600" strokeWidth={2.5} />
            <Heading level={2} className="!mb-0">
              {t('transparency.budgetTitle', { year: cityBudget.year })}
            </Heading>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 min-w-0">
              <div className="text-sm text-gray-500">
                {t('transparency.totalAppropriations')}
              </div>
              <div
                className="text-2xl font-bold text-gray-900 mt-1 truncate"
                title={currencyFormat.format(cityBudget.totalAppropriations)}
              >
                {compactCurrencyFormat.format(cityBudget.totalAppropriations)}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 min-w-0">
              <div className="text-sm text-gray-500">
                {t('transparency.currentOperating')}
              </div>
              <div
                className="text-2xl font-bold text-gray-900 mt-1 truncate"
                title={currencyFormat.format(
                  cityBudget.totalCurrentOperatingExpenditures
                )}
              >
                {compactCurrencyFormat.format(
                  cityBudget.totalCurrentOperatingExpenditures
                )}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 min-w-0">
              <div className="text-sm text-gray-500">
                {t('transparency.capitalOutlay')}
              </div>
              <div
                className="text-2xl font-bold text-gray-900 mt-1 truncate"
                title={currencyFormat.format(cityBudget.totalCapitalOutlay)}
              >
                {compactCurrencyFormat.format(cityBudget.totalCapitalOutlay)}
              </div>
            </div>
          </div>

          <Heading level={3} className="!mt-8 !mb-4">
            {t('transparency.sectorTitle')}
          </Heading>
          <div className="space-y-3">
            {cityBudget.sectors.map(s => (
              <div key={s.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700 font-medium">{s.name}</span>
                  <span className="text-gray-600">
                    {currencyFormat.format(s.amount)}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full"
                    style={{
                      width: `${(s.amount / maxSectorAmount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Text size="sm" className="!text-gray-400 mt-4">
            {t('statistics.source')}:{' '}
            <a
              href={cityBudget.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {cityBudget.source}
            </a>
          </Text>
        </Section>

        <Section className="!bg-gray-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Wallet
                  className="h-5 w-5 text-primary-600"
                  strokeWidth={2.5}
                />
                <Heading level={3} className="!mb-0">
                  {t('transparency.ntaTitle')}
                </Heading>
              </div>
              <div
                className="text-2xl font-bold text-gray-900 mt-2 truncate"
                title={currencyFormat.format(
                  cityBudget.nationalTaxAllotment.estimatedTotal
                )}
              >
                {compactCurrencyFormat.format(
                  cityBudget.nationalTaxAllotment.estimatedTotal
                )}
              </div>
              <Text size="sm" className="!text-gray-500 mt-2">
                {t('transparency.ntaNote')}
              </Text>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 min-w-0">
              <Heading level={3} className="!mb-2">
                <ShieldAlert
                  className="inline-block h-5 w-5 text-primary-600 mr-2 align-text-top"
                  strokeWidth={2.5}
                />
                {cityBudget.disasterFund.name}
              </Heading>
              <div
                className="text-2xl font-bold text-gray-900 mt-2 truncate"
                title={currencyFormat.format(cityBudget.disasterFund.amount)}
              >
                {compactCurrencyFormat.format(cityBudget.disasterFund.amount)}
              </div>
              <Text size="sm" className="!text-gray-500 mt-2">
                {t('transparency.ldrrmfNote', {
                  percent: cityBudget.disasterFund.percentOfNTA,
                })}
              </Text>
            </div>
          </div>
        </Section>

        <Section className="!bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="h-6 w-6 text-primary-600" strokeWidth={2.5} />
            <Heading level={2} className="!mb-0">
              {t('transparency.annualBudgetTitle')}
            </Heading>
          </div>
          <Text className="!max-w-2xl">
            {t('transparency.annualBudgetDescription')}
          </Text>
          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
            <BarChart
              orientation="vertical"
              data={annualBudgetHistory.years.map(y => ({
                label: String(y.year),
                value: y.totalAppropriations,
              }))}
              formatValue={v => compactCurrencyFormat.format(v)}
            />
          </div>
          <Text size="sm" className="!text-gray-400 mt-4">
            {annualBudgetHistory.note}
          </Text>
          <Text size="sm" className="!text-gray-400">
            {t('statistics.source')}:{' '}
            <a
              href={annualBudgetHistory.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {annualBudgetHistory.source}
            </a>
          </Text>
        </Section>

        <Section>
          <div className="flex items-center gap-2 mb-2">
            <Waves className="h-6 w-6 text-primary-600" strokeWidth={2.5} />
            <Heading level={2} className="!mb-0">
              {t('transparency.floodControlTitle')}
            </Heading>
          </div>
          <Text className="!max-w-2xl">
            {t('transparency.floodControlDescription', {
              count: floodControlCategory?.count ?? 0,
              cost: numberFormat.format(floodControlCategory?.totalBudget ?? 0),
            })}
          </Text>

          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
            <Text size="sm" className="!text-gray-500 !mb-4 !max-w-none">
              {t('transparency.byYearCaption')}
            </Text>
            <BarChart
              orientation="vertical"
              data={(dpwhProjects.byYear[FLOOD_CONTROL] ?? []).map(y => ({
                label: String(y.year),
                value: y.totalBudget,
              }))}
              formatValue={v => compactCurrencyFormat.format(v)}
            />
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                  <th className="py-2 pr-4">{t('statistics.tableProject')}</th>
                  <th className="py-2 pr-4">{t('statistics.tableLocation')}</th>
                  <th className="py-2 pr-4">{t('statistics.tableCost')}</th>
                  <th className="py-2">{t('statistics.tableStatus')}</th>
                </tr>
              </thead>
              <tbody>
                {floodControlProjects.map(p => (
                  <tr key={p.name} className="border-b border-gray-100">
                    <td className="py-3 pr-4 text-gray-900">
                      {p.name}
                      {p.contractor && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {t('statistics.contractorLabel')}: {p.contractor}
                        </div>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{p.location}</td>
                    <td className="py-3 pr-4 text-gray-600">
                      {currencyFormat.format(p.cost)}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <a
            href={dpwhProjects.browseFloodControlUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
          >
            {t('transparency.viewAllProjects', {
              count: floodControlCategory?.count ?? 0,
            })}
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
          </a>
          <Text size="sm" className="!text-gray-400 mt-4">
            {t('transparency.infrastructureNote')}
          </Text>
          <Text size="sm" className="!text-gray-400">
            {t('statistics.source')}:{' '}
            <a
              href={dpwhProjects.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {dpwhProjects.source}
            </a>{' '}
            ({t('transparency.asOf')}: {dpwhProjects.summary.asOf})
          </Text>
        </Section>

        <Section className="!bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <HardHat className="h-6 w-6 text-primary-600" strokeWidth={2.5} />
            <Heading level={2} className="!mb-0">
              {t('transparency.infrastructureTitle')}
            </Heading>
          </div>
          <Text className="!max-w-2xl">
            {t('transparency.infrastructureDescription', {
              count: otherProjectsCount,
              cost: numberFormat.format(otherProjectsTotal),
            })}
          </Text>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            {otherCategories.map(c => {
              const Icon = categoryIcons[c.name] ?? HardHat;
              return (
                <div
                  key={c.name}
                  className="bg-white rounded-lg border border-gray-200 p-4 min-w-0"
                >
                  <Icon
                    className="h-5 w-5 text-primary-600 mb-2"
                    strokeWidth={2.5}
                  />
                  <div className="text-xs font-semibold text-gray-500 uppercase truncate">
                    {c.name}
                  </div>
                  <div
                    className="text-lg font-bold text-gray-900 mt-1 truncate"
                    title={currencyFormat.format(c.totalBudget)}
                  >
                    {compactCurrencyFormat.format(c.totalBudget)}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {t('transparency.categoryProjectCount', {
                      count: c.count,
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <Text size="sm" className="!text-gray-500 mt-6 !max-w-none">
            {t('transparency.byYearCaption')}
          </Text>
          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-2">
            <LineChart
              series={otherCategories.map(c => ({
                name: c.name,
                color: categoryColors[c.name] ?? '#0052bc',
                data: (dpwhProjects.byYear[c.name] ?? []).map(y => ({
                  year: y.year,
                  value: y.totalBudget,
                })),
              }))}
              formatValue={v => compactCurrencyFormat.format(v)}
            />
          </div>

          {otherCategories.map(category => {
            const projectsInCategory = dpwhProjects.projects.filter(
              p => p.category === category.name
            );
            if (projectsInCategory.length === 0) return null;
            return (
              <div key={category.name} className="mt-8">
                <Heading level={3} className="!mb-3">
                  {category.name}
                </Heading>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                        <th className="py-2 pr-4">
                          {t('statistics.tableProject')}
                        </th>
                        <th className="py-2 pr-4">
                          {t('statistics.tableLocation')}
                        </th>
                        <th className="py-2 pr-4">
                          {t('statistics.tableCost')}
                        </th>
                        <th className="py-2">{t('statistics.tableStatus')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectsInCategory.map(p => (
                        <tr key={p.name} className="border-b border-gray-100">
                          <td className="py-3 pr-4 text-gray-900">
                            {p.name}
                            {p.contractor && (
                              <div className="text-xs text-gray-500 mt-0.5">
                                {t('statistics.contractorLabel')}:{' '}
                                {p.contractor}
                              </div>
                            )}
                          </td>
                          <td className="py-3 pr-4 text-gray-600">
                            {p.location}
                          </td>
                          <td className="py-3 pr-4 text-gray-600">
                            {currencyFormat.format(p.cost)}
                          </td>
                          <td className="py-3">
                            <StatusBadge status={p.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

          <a
            href={dpwhProjects.browseAllUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:underline"
          >
            {t('transparency.viewAllProjects', { count: otherProjectsCount })}
            <ExternalLink className="h-3.5 w-3.5" strokeWidth={2.5} />
          </a>
          <Text size="sm" className="!text-gray-400 mt-4">
            {t('transparency.infrastructureNote')}
          </Text>
          <Text size="sm" className="!text-gray-400">
            {t('statistics.source')}:{' '}
            <a
              href={dpwhProjects.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {dpwhProjects.source}
            </a>{' '}
            ({t('transparency.asOf')}: {dpwhProjects.summary.asOf})
          </Text>
        </Section>

        <Section className="!bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-6 w-6 text-primary-600" strokeWidth={2.5} />
            <Heading level={2} className="!mb-0">
              {t('transparency.documentsTitle')}
            </Heading>
          </div>
          <Text className="!max-w-2xl">
            {t('transparency.documentsSubtitle')}
          </Text>
          <ul className="mt-6 space-y-2 max-w-2xl">
            {officialDocuments.map(doc => (
              <li key={doc.url}>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline font-medium text-sm"
                >
                  {doc.label}
                </a>
              </li>
            ))}
          </ul>
        </Section>

        <Section>
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="h-6 w-6 text-primary-600" strokeWidth={2.5} />
            <Heading level={2} className="!mb-0">
              {t('transparency.disclaimerTitle')}
            </Heading>
          </div>
          <Text className="!max-w-2xl !text-gray-600">
            {t('transparency.disclaimerBody')}
          </Text>
        </Section>
      </main>
    </>
  );
};

export default Transparency;
