import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Store,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import PageHeader from '../components/ui/PageHeader';
import { publicMarkets, stallRentalGuidelines } from '../data/markets';

export default function Markets() {
  const { t } = useTranslation('common');
  const [filterType, setFilterType] = useState<string>('all');

  const filteredMarkets = publicMarkets.filter(market => {
    if (filterType === 'all') return true;
    return market.type === filterType;
  });

  return (
    <>
      <SEO
        title="Public Markets in Puerto Princesa City"
        description="Complete guide to public markets, bagsakan centers, coastal fish landings, and stall rental guidelines in Puerto Princesa City, Palawan."
        keywords="public markets Puerto Princesa, Old Market Malvar, New Market San Jose, Palawan palengke, fish landing Mandaragat, bagsakan Irawan, market stalls"
      />
      <main className="flex-grow">
        <PageHeader
          title="Public Markets in Puerto Princesa"
          subtitle="Guide to major city trading centers, fresh seafood hubs, community talipapas, and market stall leasing guidelines."
          breadcrumbs={[
            { label: t('navbar.home'), href: '/' },
            { label: 'Services', href: '/services' },
            { label: 'Public Markets' },
          ]}
        />

        {/* Overview & Quick Filters */}
        <Section className="!pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Heading level={2}>City Public Markets & Trading Centers</Heading>
              <Text className="text-gray-600 mt-1 max-w-2xl">
                Puerto Princesa’s public markets are operated and maintained by
                the City Economic Enterprise Department (CEED) in coordination
                with the City Agriculture and Veterinary offices.
              </Text>
            </div>
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 text-sm">
              {[
                { id: 'all', label: 'All Markets' },
                { id: 'major', label: 'Major Commercial Hubs' },
                { id: 'satellite', label: 'Community Talipapas' },
                { id: 'landing', label: 'Coastal Fish Landings' },
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterType(f.id)}
                  className={`rounded-full px-4 py-2 font-bold transition-colors ${
                    filterType === f.id
                      ? 'bg-primary-700 text-white shadow-xs'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Markets Cards Grid */}
        <Section className="!pt-2">
          <div className="grid gap-8 lg:grid-cols-2">
            {filteredMarkets.map(market => (
              <article
                key={market.id}
                id={market.id}
                className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-balayong-300 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span
                        className={`inline-block text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-2 ${
                          market.type === 'major'
                            ? 'bg-primary-100 text-primary-800'
                            : market.type === 'landing'
                              ? 'bg-balayong-100 text-balayong-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {market.type === 'major'
                          ? 'Major City Market'
                          : market.type === 'landing'
                            ? 'Fish Landing & Wholesale'
                            : 'Satellite Community Market'}
                      </span>
                      <h3 className="text-xl font-bold font-display text-gray-900">
                        {market.name}
                      </h3>
                      <p className="text-sm font-semibold text-balayong-600 mt-0.5">
                        {market.localName}
                      </p>
                    </div>
                    <div className="rounded-xl bg-balayong-50 p-3 text-balayong-700 shrink-0">
                      <Store className="h-6 w-6" />
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {market.description}
                  </p>

                  {/* Hours & Location details */}
                  <div className="space-y-2 rounded-xl bg-gray-50 p-4 text-xs text-gray-700 border border-gray-100 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-balayong-600 shrink-0" />
                      <span>
                        <strong>Hours:</strong> {market.operatingHours}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>
                        <strong>Peak Activity:</strong> {market.peakHours}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary-600 shrink-0" />
                      <span>
                        <strong>Location:</strong> {market.address}
                      </span>
                    </div>
                  </div>

                  {/* Sections / Products */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                      Market Sections & Commodities:
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-1.5 text-xs text-gray-600">
                      {market.sections.map((sec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{sec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                      Key Highlights:
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {market.features.map((feat, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-gray-100 px-2.5 py-1 text-[11px] font-medium text-gray-700"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-gray-500">
                    Admin: <strong>{market.adminOffice}</strong>
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${market.coordinates[1]},${market.coordinates[0]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-primary-700 hover:text-primary-800 underline decoration-primary-200 hover:decoration-primary-600"
                  >
                    Open in Maps
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </Section>

        {/* Market Stall Lease Guidelines & Rules */}
        <Section id="stall-guidelines" className="bg-balayong-50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-2 text-balayong-700">
              <ShoppingBag className="h-6 w-6" />
              <span className="text-xs font-bold uppercase tracking-wider">
                City Economic Enterprise Department (CEED)
              </span>
            </div>
            <Heading level={2}>How to Lease a Market Stall</Heading>
            <Text className="text-gray-700 mt-2 mb-6">
              Residents interested in operating a market stall, dry goods
              section, or food terminal space in any LGU-managed public market
              must submit their application directly to CEED.
            </Text>

            <div className="grid md:grid-cols-2 gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-balayong-200 shadow-sm">
              {/* Requirements */}
              <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <FileText className="h-5 w-5 text-primary-600" />
                  Stall Application Requirements
                </h3>
                <ul className="space-y-2.5 text-xs text-gray-700">
                  {stallRentalGuidelines.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-800 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rules & Payment */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    Market Rules & Compliance
                  </h3>
                  <ul className="space-y-2 text-xs text-gray-700">
                    {stallRentalGuidelines.rules.map((rule, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-balayong-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 rounded-xl bg-primary-50 p-4 border border-primary-100">
                  <p className="text-xs font-bold text-primary-900">
                    Pay Market Rent Online:
                  </p>
                  <p className="text-xs text-gray-600 mt-1 mb-3">
                    Existing stallholders can settle monthly lease rentals
                    online via the city’s official partner portal without
                    queuing at City Hall.
                  </p>
                  <a
                    href={stallRentalGuidelines.onlinePaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-700 px-5 py-2 font-bold text-white text-xs hover:bg-primary-800 transition-colors w-full sm:w-auto"
                  >
                    Open Filipizen Market Rental
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
