import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Search,
  ShieldAlert,
  Flame,
  HeartPulse,
  Zap,
  Waves,
  MapPin,
  Clock,
  MessageSquare,
  AlertOctagon,
  CheckCircle2,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import PageHeader from '../components/ui/PageHeader';
import { emergencyDirectory, hotlines } from '../data/hotlines';

const CATEGORY_MAP: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  all: { label: 'All Contacts', icon: Phone },
  emergency: { label: 'Emergency & Rescue', icon: Flame },
  police: { label: 'Police Stations', icon: ShieldAlert },
  hospital: { label: 'Hospitals & Medical', icon: HeartPulse },
  utility: { label: 'Electricity & Water', icon: Zap },
  environment: { label: 'Coast Guard & Environment', icon: Waves },
};

export default function Hotlines() {
  const { t } = useTranslation('common');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredDirectory = useMemo(() => {
    return emergencyDirectory.filter(contact => {
      const matchesCategory =
        selectedCategory === 'all' || contact.category === selectedCategory;
      if (!matchesCategory) return false;

      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;

      return (
        contact.name.toLowerCase().includes(q) ||
        contact.description.toLowerCase().includes(q) ||
        contact.hotline.includes(q) ||
        (contact.location && contact.location.toLowerCase().includes(q))
      );
    });
  }, [selectedCategory, searchQuery]);

  return (
    <>
      <SEO
        title="Emergency Hotlines & Public Utilities Directory"
        description="Comprehensive directory of Puerto Princesa City emergency hotlines: CDRRMO, PNP, BFP, Ospital ng Palawan, PALECO power outages, PPCWD water leaks, and Coast Guard."
        keywords="Puerto Princesa emergency numbers, CDRRMO Palawan, PALECO hotline, PPCWD hotline, Ospital ng Palawan contact, Puerto Princesa police"
      />
      <main className="flex-grow">
        <PageHeader
          title="Emergency & Utility Hotlines"
          subtitle="Direct phone numbers, dispatch contacts, and public utility emergency desks across Puerto Princesa City."
          breadcrumbs={[
            { label: t('navbar.home'), href: '/' },
            { label: 'Hotlines & Directory' },
          ]}
        />

        {/* Priority 1-Tap Emergency Banner */}
        <Section className="!pb-4">
          <div className="rounded-2xl bg-gradient-to-r from-red-600 to-red-700 p-6 sm:p-8 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <AlertOctagon className="h-6 w-6 text-red-200 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-100">
                Life &amp; Safety Immediate Response
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              In an Urgent Emergency:
            </h2>
            <p className="mt-1 text-sm text-red-100 max-w-2xl">
              Tap any number below to dial immediately from your mobile phone.
            </p>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {hotlines.map(h => (
                <a
                  key={h.label}
                  href={`tel:${h.tel}`}
                  className="flex flex-col items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 p-3.5 backdrop-blur-sm border border-white/20 transition-all text-center group"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-red-100">
                    {h.label}
                  </span>
                  <span className="mt-1 text-sm sm:text-base font-extrabold text-white tabular-nums group-hover:scale-105 transition-transform">
                    {h.number}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Section>

        {/* Filter & Search Bar */}
        <Section className="!pt-4 !pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search emergency office, PALECO, water, police..."
                className="w-full rounded-full border border-gray-300 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 focus:border-primary-600 focus:ring-2 focus:ring-primary-100 outline-none"
              />
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.entries(CATEGORY_MAP).map(([key, item]) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedCategory(key)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 font-bold transition-colors ${
                      selectedCategory === key
                        ? 'bg-primary-700 text-white shadow-xs'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Directory Grid */}
        <Section className="!pt-2">
          {filteredDirectory.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="font-semibold text-gray-800">
                No contact matching your search
              </p>
              <p className="text-sm mt-1">
                Try resetting the search bar or category filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDirectory.map(contact => (
                <div
                  key={contact.id}
                  className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-balayong-300 transition-colors"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-100 text-primary-800">
                        {CATEGORY_MAP[contact.category]?.label ||
                          contact.category}
                      </span>
                      <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {contact.availableHours}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-gray-900 leading-snug">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                      {contact.description}
                    </p>

                    {contact.location && (
                      <p className="mt-3 flex items-start gap-1.5 text-xs text-gray-500">
                        <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0 mt-0.5" />
                        <span>{contact.location}</span>
                      </p>
                    )}
                  </div>

                  {/* Call Action Bar */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">
                        Hotline Number
                      </span>
                      <span className="font-bold text-sm text-gray-900 tabular-nums">
                        {contact.hotline}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={`tel:${contact.tel}`}
                        className="inline-flex items-center gap-1 rounded-full bg-primary-700 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary-800 transition-colors shadow-2xs"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Call
                      </a>
                      {contact.tel.startsWith('09') && (
                        <a
                          href={`sms:${contact.tel}`}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                          title="Send SMS"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Preparedness Tips */}
        <Section className="bg-balayong-50">
          <div className="max-w-4xl mx-auto">
            <Heading level={2}>Emergency Preparedness Reminders</Heading>
            <Text className="text-gray-700 mt-2 mb-6">
              Essential steps for households and businesses in Puerto Princesa
              to stay prepared for typhoons, earthquakes, and emergency
              situations.
            </Text>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="rounded-xl border border-balayong-200 bg-white p-5 shadow-xs">
                <CheckCircle2 className="h-6 w-6 text-primary-600 mb-2" />
                <h3 className="font-bold text-sm text-gray-900 mb-1">
                  Save Key Numbers in Contacts
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Save CDRRMO, your local Barangay Hall, and PALECO in your
                  mobile phone address book so you don’t need internet during a
                  power failure.
                </p>
              </div>

              <div className="rounded-xl border border-balayong-200 bg-white p-5 shadow-xs">
                <CheckCircle2 className="h-6 w-6 text-balayong-600 mb-2" />
                <h3 className="font-bold text-sm text-gray-900 mb-1">
                  Emergency 72-Hour Go-Bag
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Keep a backpack ready with 3 days of clean water,
                  non-perishable food, flashlights, powerbank, whistle,
                  prescription medicines, and photocopy of IDs.
                </p>
              </div>

              <div className="rounded-xl border border-balayong-200 bg-white p-5 shadow-xs">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mb-2" />
                <h3 className="font-bold text-sm text-gray-900 mb-1">
                  Know Your Barangay Evacuation Center
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Locate your designated barangay school gym or multi-purpose
                  hall before flooding or storm surges happen. Follow CDRRMO
                  advisory alerts promptly.
                </p>
              </div>
            </div>
          </div>
        </Section>
      </main>
    </>
  );
}
