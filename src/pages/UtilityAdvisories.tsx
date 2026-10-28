import { useState, useMemo, useEffect } from 'react';
import {
  Zap,
  Droplets,
  Search,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  BookOpen,
  Share2,
  Check,
  PhoneCall,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import SEO from '../components/SEO';
import Section from '../components/ui/Section';
import { Heading } from '../components/ui/Heading';
import { Text } from '../components/ui/Text';
import PageHeader from '../components/ui/PageHeader';
import { fetchLiveUtilityAdvisories } from '../lib/liveUtilitySync';
import type { UtilityAdvisory, UtilitySource } from '../types/utilityAdvisory';

const defaultMetadata = {
  lastUpdated: new Date().toISOString(),
  palecoCount: 0,
  ppcwdCount: 0,
  totalCount: 0,
};

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export default function UtilityAdvisories() {
  const [advisories, setAdvisories] = useState<UtilityAdvisory[]>([]);
  const [metadata, setMetadata] = useState(defaultMetadata);
  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);
  const [liveSynced, setLiveSynced] = useState<boolean>(false);
  const [liveNotice, setLiveNotice] = useState<string | null>(null);

  const [selectedSource, setSelectedSource] = useState<'ALL' | UtilitySource>(
    'ALL'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedBarangay, setSelectedBarangay] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readingAdvisory, setReadingAdvisory] =
    useState<UtilityAdvisory | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Live scraper sync function
  const syncLiveAdvisories = async () => {
    setIsSyncingLive(true);
    setLiveNotice(null);
    try {
      const liveData = await fetchLiveUtilityAdvisories();
      if (
        Array.isArray(liveData?.advisories) &&
        liveData.advisories.length > 0
      ) {
        setAdvisories(prevList => {
          const safePrev = Array.isArray(prevList) ? prevList : [];
          const previousIds = new Set(safePrev.map(a => a.id));
          const newCount = liveData.advisories.filter(
            a => !previousIds.has(a.id)
          ).length;

          // Map by ID, giving preference to latest scraped records
          const advisoryMap = new Map<string, UtilityAdvisory>();
          safePrev.forEach(a => advisoryMap.set(a.id, a));
          liveData.advisories.forEach(a => advisoryMap.set(a.id, a));

          const merged = Array.from(advisoryMap.values()).sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          setMetadata(prevMeta => ({
            ...prevMeta,
            lastUpdated: liveData.lastUpdated,
            palecoCount: merged.filter(a => a.source === 'PALECO').length,
            ppcwdCount: merged.filter(a => a.source === 'PPCWD').length,
            totalCount: liveData.totalCount,
          }));
          setLiveSynced(true);

          if (newCount > 0) {
            setLiveNotice(
              `✨ Live scrape synced: Loaded ${newCount} fresh advisory update${
                newCount > 1 ? 's' : ''
              } directly from PALECO & PPCWD!`
            );
          }

          return merged;
        });
      }
    } catch (err) {
      console.warn('Live fetch error:', err);
    } finally {
      setIsSyncingLive(false);
    }
  };

  // Automatically fetch live advisories in background on mount
  useEffect(() => {
    void syncLiveAdvisories();
  }, []);

  // Compute all affected zones dynamically based on active advisories
  const allZones = useMemo(() => {
    const zones = new Set<string>();
    if (Array.isArray(advisories)) {
      for (const advisory of advisories) {
        if (Array.isArray(advisory?.affectedAreas)) {
          for (const area of advisory.affectedAreas) {
            zones.add(area);
          }
        }
      }
    }
    return Array.from(zones).sort();
  }, [advisories]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setReadingAdvisory(null);
      }
    };
    if (readingAdvisory) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [readingAdvisory]);

  // Copy shareable link
  const handleCopyShare = (advisory: UtilityAdvisory) => {
    navigator.clipboard.writeText(
      `${window.location.origin}/advisories?id=${advisory.id}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filtered Advisories
  const filteredAdvisories = useMemo(() => {
    if (!Array.isArray(advisories)) return [];
    return advisories.filter(advisory => {
      // Source filter
      if (selectedSource !== 'ALL' && advisory.source !== selectedSource) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'ALL') {
        if (selectedCategory === 'power-outages') {
          if (
            advisory.category !== 'power-outage' &&
            advisory.category !== 'power-interruption'
          )
            return false;
        } else if (selectedCategory === 'water-alerts') {
          if (
            advisory.category !== 'water-interruption' &&
            advisory.category !== 'water-advisory' &&
            advisory.category !== 'water-quality'
          )
            return false;
        } else if (selectedCategory === 'maintenance') {
          if (advisory.category !== 'maintenance') return false;
        } else if (selectedCategory === 'news') {
          if (advisory.category !== 'news') return false;
        }
      }

      // Barangay / Zone filter
      if (selectedBarangay !== 'ALL') {
        const matchesZone = advisory.affectedAreas.some(
          area => area.toLowerCase() === selectedBarangay.toLowerCase()
        );
        if (!matchesZone) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = advisory.title.toLowerCase().includes(q);
        const inSummary = advisory.summary.toLowerCase().includes(q);
        const inContent = advisory.content.toLowerCase().includes(q);
        const inReason = advisory.reason?.toLowerCase().includes(q);
        const inAreas = advisory.affectedAreas.some(a =>
          a.toLowerCase().includes(q)
        );
        const inFeeders = advisory.feeders?.some(f =>
          f.toLowerCase().includes(q)
        );
        if (
          !inTitle &&
          !inSummary &&
          !inContent &&
          !inReason &&
          !inAreas &&
          !inFeeders
        ) {
          return false;
        }
      }

      return true;
    });
  }, [
    advisories,
    selectedSource,
    selectedCategory,
    selectedBarangay,
    searchQuery,
  ]);

  const hasActiveFilters =
    selectedSource !== 'ALL' ||
    selectedCategory !== 'ALL' ||
    selectedBarangay !== 'ALL' ||
    searchQuery.trim().length > 0;

  const resetFilters = () => {
    setSelectedSource('ALL');
    setSelectedCategory('ALL');
    setSelectedBarangay('ALL');
    setSearchQuery('');
  };

  const palecoCount = metadata.palecoCount;
  const ppcwdCount = metadata.ppcwdCount;
  const totalCount = metadata.totalCount;

  return (
    <>
      <SEO
        title="PALECO & PPCWD Advisories & Outages | Better Puerto Princesa"
        description="Real-time public utility advisory tracker for Puerto Princesa City. Read official PALECO power service advisories, unscheduled blackouts, PPCWD water interruptions, and maintenance directly on our website."
        keywords="PALECO power outage, PALECO advisory, PPCWD water interruption, Puerto Princesa brownout schedule, Palawan electric cooperative, Puerto Princesa water district, blackout PPC, water cut PPC"
      />

      <PageHeader
        title="Utility Advisories & Outages"
        subtitle="Read live automated PALECO power bulletins, scheduled line interruptions, and PPCWD water supply advisories directly on our site without leaving the portal."
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: 'Utility Advisories' },
        ]}
      />

      {/* Sync Status & Hotlines Bar */}
      <section className="border-b border-gray-200 bg-gray-50 py-3.5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Live Scrape Status Indicator */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs md:text-sm text-gray-600">
              {isSyncingLive ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-primary-700">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary-600" />
                  <span>
                    Syncing live data from paleco.net & ppcwater.gov.ph...
                  </span>
                </span>
              ) : liveSynced ? (
                <span className="inline-flex items-center gap-2 font-medium text-emerald-800">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  </span>
                  <span>
                    <strong>Live Scrape Active:</strong> Scraped directly from
                    PALECO & PPCWD REST endpoints.
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                  <span>
                    <strong>Official Ingestion:</strong> PALECO & PPCWD
                    WordPress REST APIs.
                  </span>
                </span>
              )}

              <span className="hidden sm:inline text-gray-300">|</span>
              <span className="text-gray-500 text-xs">
                Updated: {formatDate(metadata.lastUpdated)}
              </span>

              {/* Refresh Button */}
              <button
                type="button"
                onClick={syncLiveAdvisories}
                disabled={isSyncingLive}
                className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
                title="Fetch latest posts from PALECO and PPCWD right now"
              >
                <RefreshCw
                  className={`h-3 w-3 text-gray-600 ${
                    isSyncingLive ? 'animate-spin text-primary-600' : ''
                  }`}
                />
                <span>{isSyncingLive ? 'Syncing...' : 'Sync Live Scrape'}</span>
              </button>
            </div>

            {/* Quick Emergency Call Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="tel:09175532836"
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-500/20"
                title="Call PALECO 24/7 Outage Hotline"
              >
                <Zap className="h-3.5 w-3.5 text-amber-600" />
                <span>PALECO Hotline: 0917 553 2836</span>
              </a>
              <a
                href="tel:09173108865"
                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-900 transition hover:bg-sky-500/20"
                title="Call PPCWD 24/7 Water Dispatch"
              >
                <Droplets className="h-3.5 w-3.5 text-sky-600" />
                <span>PPCWD Hotline: 0917 310 8865</span>
              </a>
            </div>
          </div>

          {/* New Scrape Notification Banner */}
          {liveNotice && (
            <div className="mt-3 flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{liveNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setLiveNotice(null)}
                className="rounded p-1 text-emerald-700 hover:bg-emerald-100"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Section */}
      <Section className="py-8 md:py-12">
        {/* Metric Quick Cards */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => {
              setSelectedSource('ALL');
              setSelectedCategory('ALL');
            }}
            className={`rounded-xl border p-4 text-left transition ${
              selectedSource === 'ALL'
                ? 'border-primary-600 bg-primary-50/50 ring-2 ring-primary-500/20'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className="text-xs font-medium text-gray-500">All Bulletins</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {totalCount}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">Combined records</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedSource('PALECO');
              setSelectedCategory('ALL');
            }}
            className={`rounded-xl border p-4 text-left transition ${
              selectedSource === 'PALECO'
                ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-amber-700">⚡ PALECO</p>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {palecoCount}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">Power advisories</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedSource('PPCWD');
              setSelectedCategory('ALL');
            }}
            className={`rounded-xl border p-4 text-left transition ${
              selectedSource === 'PPCWD'
                ? 'border-sky-500 bg-sky-50/60 ring-2 ring-sky-500/20'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-sky-700">💧 PPCWD</p>
              <Droplets className="h-4 w-4 text-sky-500" />
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {ppcwdCount}
            </p>
            <p className="mt-1 text-[11px] text-gray-500">Water advisories</p>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedSource('PALECO');
              setSelectedCategory('power-outages');
            }}
            className="rounded-xl border border-gray-200 bg-white p-4 text-left transition hover:border-gray-300"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-emerald-700">
                Outages Logged
              </p>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {
                advisories.filter(
                  a =>
                    a.category === 'power-outage' ||
                    a.category === 'power-interruption'
                ).length
              }
            </p>
            <p className="mt-1 text-[11px] text-gray-500">
              Restored & scheduled
            </p>
          </button>
        </div>

        {/* Search & Dynamic Filter Controls */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:p-6">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search advisories, affected barangay, Feeder #, or cause (e.g. San Pedro, Feeder 2, transformer)..."
                className="w-full rounded-xl border border-gray-300 bg-gray-50/50 py-2.5 pl-11 pr-10 text-sm text-gray-900 placeholder-gray-500 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Provider and Category Filter Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" /> Provider:
              </span>
              <button
                type="button"
                onClick={() => setSelectedSource('ALL')}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedSource === 'ALL'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Sources
              </button>
              <button
                type="button"
                onClick={() => setSelectedSource('PALECO')}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedSource === 'PALECO'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
                }`}
              >
                <Zap className="h-3 w-3" />
                PALECO Only
              </button>
              <button
                type="button"
                onClick={() => setSelectedSource('PPCWD')}
                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  selectedSource === 'PPCWD'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-sky-50 text-sky-900 hover:bg-sky-100'
                }`}
              >
                <Droplets className="h-3 w-3" />
                PPCWD Only
              </button>

              <div className="hidden md:block h-4 w-px bg-gray-200 mx-1" />

              <span className="text-xs font-semibold text-gray-500">
                Category:
              </span>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700 focus:border-primary-500 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="power-outages">
                  Power Outages & Interruptions
                </option>
                <option value="water-alerts">
                  Water Supply & Interruptions
                </option>
                <option value="maintenance">Maintenance & Line Clearing</option>
                <option value="news">Official Notices & News</option>
              </select>

              <span className="text-xs font-semibold text-gray-500 ml-1">
                Barangay:
              </span>
              <select
                value={selectedBarangay}
                onChange={e => setSelectedBarangay(e.target.value)}
                className="max-w-[180px] truncate rounded-lg border border-gray-300 bg-white px-2.5 py-1 text-xs text-gray-700 focus:border-primary-500 focus:outline-none"
              >
                <option value="ALL">All Barangays / Zones</option>
                {allZones.map(zone => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-auto inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                >
                  <X className="h-3.5 w-3.5" />
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
          <p>
            Showing{' '}
            <strong className="text-gray-900">
              {filteredAdvisories.length}
            </strong>{' '}
            of {totalCount} advisories
            {selectedBarangay !== 'ALL' && (
              <span>
                {' '}
                in <strong>{selectedBarangay}</strong>
              </span>
            )}
          </p>
        </div>

        {/* Advisory List Grid */}
        {filteredAdvisories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />
            <h3 className="mt-3 text-base font-semibold text-gray-900">
              No advisories matched your query
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try clearing filters or searching for another barangay or keyword.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-primary-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredAdvisories.map(advisory => {
              const isExpanded = expandedId === advisory.id;
              const isPaleco = advisory.source === 'PALECO';

              return (
                <article
                  key={advisory.id}
                  className="group flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-300 hover:shadow-md"
                >
                  <div>
                    {/* Header Chips */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        {isPaleco ? (
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800">
                            <Zap className="h-3.5 w-3.5 text-amber-600" />
                            PALECO Power
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-800">
                            <Droplets className="h-3.5 w-3.5 text-sky-600" />
                            PPCWD Water
                          </span>
                        )}

                        <span
                          className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${
                            advisory.status === 'Restored'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : advisory.status === 'Scheduled'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : advisory.isUrgent
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {advisory.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        <span>{formatDate(advisory.date)}</span>
                      </div>
                    </div>

                    {/* Featured Image if available */}
                    {advisory.imageUrl && (
                      <div className="mt-3 overflow-hidden rounded-xl bg-gray-100 max-h-48 cursor-pointer">
                        <img
                          src={advisory.imageUrl}
                          alt={advisory.title}
                          loading="lazy"
                          onClick={() => setReadingAdvisory(advisory)}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}

                    {/* Title */}
                    <h2 className="mt-3 text-base font-bold leading-snug text-gray-900">
                      <button
                        type="button"
                        onClick={() => setReadingAdvisory(advisory)}
                        className="text-left hover:text-primary-700 transition"
                      >
                        {advisory.title}
                      </button>
                    </h2>

                    {/* Specific Outage Times & Reason Details */}
                    {(advisory.timeOut ||
                      advisory.timeRestored ||
                      advisory.reason) && (
                      <div className="mt-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-700">
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {advisory.timeOut && (
                            <div className="flex items-start gap-1.5">
                              <Clock className="h-3.5 w-3.5 text-rose-500 mt-0.5 shrink-0" />
                              <span>
                                <strong className="text-gray-900">
                                  Outage:
                                </strong>{' '}
                                {advisory.timeOut}
                              </span>
                            </div>
                          )}
                          {advisory.timeRestored && (
                            <div className="flex items-start gap-1.5">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                              <span>
                                <strong className="text-gray-900">
                                  Restored:
                                </strong>{' '}
                                {advisory.timeRestored}
                              </span>
                            </div>
                          )}
                        </div>

                        {advisory.reason && (
                          <div className="mt-2 border-t border-gray-200/60 pt-2 flex items-start gap-1.5">
                            <Info className="h-3.5 w-3.5 text-gray-500 mt-0.5 shrink-0" />
                            <span>
                              <strong className="text-gray-900">
                                Cause/Details:
                              </strong>{' '}
                              {advisory.reason}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Affected Areas Badges */}
                    {advisory.affectedAreas.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                          <MapPin className="h-3 w-3 text-rose-500" />
                          <span>Affected Barangays & Locations:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {advisory.affectedAreas.map(area => (
                            <button
                              key={area}
                              type="button"
                              onClick={() => setSelectedBarangay(area)}
                              className={`rounded-md px-2 py-0.5 text-xs font-medium transition ${
                                selectedBarangay.toLowerCase() ===
                                area.toLowerCase()
                                  ? 'bg-primary-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {area}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary / Content */}
                    <div className="mt-3 text-xs leading-relaxed text-gray-600">
                      {isExpanded ? (
                        <p className="whitespace-pre-line">
                          {advisory.content}
                        </p>
                      ) : (
                        <p>{advisory.summary}</p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                    <button
                      type="button"
                      onClick={() => setReadingAdvisory(advisory)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-700 transition"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Read Full Advisory
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : advisory.id)
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 transition"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="h-3.5 w-3.5" /> Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3.5 w-3.5" /> Preview
                          </>
                        )}
                      </button>

                      <a
                        href={advisory.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-primary-700 transition"
                        title="View original link"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Legal & Public Domain Notice Section */}
        <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50/50 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-blue-500/10 p-3 text-blue-600 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold text-gray-900">
                Is Scraping & Displaying This Public Utility Information Legal?
              </h2>
              <p className="mt-2 text-xs md:text-sm leading-relaxed text-gray-700">
                <strong>Yes, absolutely.</strong> Under Philippine Law (Republic
                Act No. 8293 — Intellectual Property Code of the Philippines,
                Section 176.1),{' '}
                <em>
                  &quot;No copyright shall subsist in any work of the Government
                  of the Philippines.&quot;
                </em>{' '}
                Official advisories, power maintenance schedules, and public
                health water notices issued by government-owned or public
                utility corporations (such as PPCWD and PALECO) are matters of
                vital public interest in the public domain.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs text-gray-600">
                <p>
                  •{' '}
                  <strong>
                    1987 Philippine Constitution (Art. III, Sec. 7):
                  </strong>{' '}
                  Guarantees citizens the fundamental right to information on
                  matters of public concern.
                </p>
                <p>
                  •{' '}
                  <strong>
                    Fair Use & News of the Day (RA 8293 Sec. 184):
                  </strong>{' '}
                  Informational bulletins and news of the day for civic
                  reporting are protected.
                </p>
                <p>
                  • <strong>Zero PII Collected:</strong> Compliant with RA 10173
                  (Data Privacy Act) — no personal citizen data is touched or
                  stored.
                </p>
                <p>
                  • <strong>Public Endpoints & Attribution:</strong> Fetched via
                  public WP REST feeds with full source credit and direct links.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Consumer Tips & Hotline Dispatch Section */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-balayong-50/60 p-6 md:p-8">
          <div className="max-w-3xl">
            <Heading
              level={2}
              className="text-xl md:text-2xl font-display text-gray-900"
            >
              Utility Contact & Reporting Guidelines
            </Heading>
            <Text className="mt-2 text-sm text-gray-700">
              If your residence experiences an unscheduled power blackout or
              sudden loss of water pressure not reflected on this bulletin,
              report directly to the official 24/7 dispatch hotlines.
            </Text>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-amber-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      PALECO Emergency Reporting
                    </h3>
                    <p className="text-xs text-gray-500">
                      Power outages & hazards
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-1.5">
                  <p>
                    • <strong>Mobile Hotline:</strong> 0917 553 2836
                  </p>
                  <p>
                    • <strong>Landline:</strong> (048) 433-9144 / (048) 433-2001
                  </p>
                  <p>
                    • <strong>Office:</strong> KM 3.5, North National Highway,
                    Tiniguiban
                  </p>
                  <p>
                    • When reporting, specify your Barangay, Sitio, and nearby
                    transformer pole number.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                  <a
                    href="tel:09175532836"
                    className="flex-1 rounded-lg bg-amber-600 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-amber-700 transition"
                  >
                    Call PALECO Dispatch
                  </a>
                </div>
              </div>

              <div className="rounded-xl border border-sky-200 bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-sky-500/10 p-2 text-sky-600">
                    <Droplets className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      PPCWD Water Service Reports
                    </h3>
                    <p className="text-xs text-gray-500">
                      Pipeline leaks & low pressure
                    </p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-600 space-y-1.5">
                  <p>
                    • <strong>Mobile Hotline:</strong> 0917 310 8865
                  </p>
                  <p>
                    • <strong>Landline:</strong> (048) 433-2342 / (048) 433-2550
                  </p>
                  <p>
                    • <strong>Office:</strong> PPCWD Building, Rizal Avenue
                  </p>
                  <p>
                    • Store sufficient emergency water in clean, covered
                    containers before scheduled supply works.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                  <a
                    href="tel:09173108865"
                    className="flex-1 rounded-lg bg-sky-600 py-2 text-center text-xs font-semibold text-white shadow-sm hover:bg-sky-700 transition"
                  >
                    Call PPCWD Dispatch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* FULL IN-APP READER MODAL */}
      {readingAdvisory && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setReadingAdvisory(null)}
        >
          <div
            className="relative flex flex-col w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 bg-gray-50/80">
              <div className="flex items-center gap-2">
                {readingAdvisory.source === 'PALECO' ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-800">
                    <Zap className="h-3.5 w-3.5 text-amber-600" />
                    PALECO Official Bulletin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-800">
                    <Droplets className="h-3.5 w-3.5 text-sky-600" />
                    PPCWD Official Advisory
                  </span>
                )}

                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                    readingAdvisory.status === 'Restored'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : readingAdvisory.status === 'Scheduled'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : readingAdvisory.isUrgent
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}
                >
                  {readingAdvisory.status}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setReadingAdvisory(null)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition"
                aria-label="Close reader"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Reader Body */}
            <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8 space-y-6">
              {/* Optional Poster / Featured Image */}
              {readingAdvisory.imageUrl && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100 max-h-80 flex items-center justify-center">
                  <img
                    src={readingAdvisory.imageUrl}
                    alt={readingAdvisory.title}
                    className="w-full h-full object-contain max-h-80"
                  />
                </div>
              )}

              {/* Title & Metadata */}
              <div>
                <h1 className="text-xl md:text-2xl font-bold leading-tight text-gray-900 font-display">
                  {readingAdvisory.title}
                </h1>

                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-gray-500 border-b border-gray-100 pb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" />
                    {formatDate(readingAdvisory.date)}
                  </span>
                  <span>•</span>
                  <span>Provider: {readingAdvisory.providerName}</span>
                </div>
              </div>

              {/* Outage Breakdown Highlights Box */}
              {(readingAdvisory.timeOut ||
                readingAdvisory.timeRestored ||
                readingAdvisory.reason) && (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs md:text-sm text-gray-800 space-y-2.5">
                  <p className="font-semibold text-gray-900 uppercase tracking-wider text-[11px]">
                    Interruption Breakdown:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {readingAdvisory.timeOut && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-rose-500 shrink-0" />
                        <span>
                          <strong>Outage Started:</strong>{' '}
                          {readingAdvisory.timeOut}
                        </span>
                      </div>
                    )}
                    {readingAdvisory.timeRestored && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Power Restored:</strong>{' '}
                          {readingAdvisory.timeRestored}
                        </span>
                      </div>
                    )}
                  </div>
                  {readingAdvisory.reason && (
                    <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                      <Info className="h-4 w-4 text-gray-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Cause / Line Details:</strong>{' '}
                        {readingAdvisory.reason}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Affected Barangays Tags */}
              {readingAdvisory.affectedAreas.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                    Affected Barangays & Locations:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {readingAdvisory.affectedAreas.map(area => (
                      <span
                        key={area}
                        className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Article Content */}
              <div className="border-t border-gray-100 pt-4 text-sm leading-relaxed text-gray-800 space-y-4 whitespace-pre-line">
                {readingAdvisory.content}
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-50 px-5 py-3.5">
              <div className="flex items-center gap-2">
                <a
                  href={
                    readingAdvisory.source === 'PALECO'
                      ? 'tel:09175532836'
                      : 'tel:09173108865'
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
                >
                  <PhoneCall className="h-3.5 w-3.5" />
                  Call {readingAdvisory.source}
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyShare(readingAdvisory)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={readingAdvisory.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-primary-700 transition"
                >
                  <span>Official Source ({readingAdvisory.source})</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setReadingAdvisory(null)}
                  className="rounded-lg bg-gray-200 px-3.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
