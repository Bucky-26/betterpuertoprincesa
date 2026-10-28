import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Search,
  Store,
  Calculator,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import BalayongBranch from '../ui/BalayongBranch';
import { hotlines } from '../../data/hotlines';
import SearchModal from '../search/SearchModal';

// Pink field for the balayong, a bay-blue band along the bottom for the
// Baywalk, and the Prinsesa ng Baybay statue standing at the water's edge.
export default function Hero() {
  const { t } = useTranslation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [initialSearchQuery, setInitialSearchQuery] = useState('');

  const openSearchWith = (query: string) => {
    setInitialSearchQuery(query);
    setSearchOpen(true);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-balayong-100">
        <BalayongBranch className="pointer-events-none absolute -right-16 -top-6 w-[26rem] opacity-60 sm:w-[34rem] lg:-right-4 lg:w-[42rem] lg:opacity-100" />
        {/* A smaller branch reaching in from the left edge, mirrored, to
            balance the one behind the statue. */}
        <BalayongBranch className="pointer-events-none absolute bottom-10 -left-28 hidden w-[24rem] -scale-x-100 rotate-[200deg] opacity-50 md:block lg:w-[30rem] lg:opacity-80" />

        <div className="container relative mx-auto px-4">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="pt-16 pb-12 md:pt-24 md:pb-16">
              <h1 className="font-display text-5xl leading-[1.02] text-gray-900 sm:text-6xl lg:text-7xl">
                {t('hero.greeting')}
              </h1>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-700">
                {t('hero.subtitle')}
              </p>

              {/* Instant Search Bar Trigger */}
              <div className="mt-8 max-w-lg">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => openSearchWith('')}
                    className="flex-1 flex items-center justify-between gap-3 rounded-full bg-white px-5 py-3.5 text-sm text-gray-500 shadow-sm border border-balayong-300 hover:border-balayong-500 transition-all text-left group"
                    aria-label="Search city services, public markets, hotlines, or offices"
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Search className="h-4 w-4 text-gray-400 group-hover:text-primary-600 transition-colors shrink-0" />
                      <span className="truncate">
                        Search permits, markets, fare, hotlines...
                      </span>
                    </span>
                    <kbd className="hidden sm:inline-block rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-mono font-semibold text-gray-400">
                      Ctrl+K
                    </kbd>
                  </button>

                  <Link
                    to="/services"
                    className="inline-flex items-center justify-center rounded-full bg-primary-700 px-6 py-3.5 font-bold text-white text-sm transition-colors hover:bg-primary-800 shrink-0 shadow-sm"
                  >
                    {t('hero.browseServices')}
                  </Link>
                </div>

                {/* Popular Discovery Shortcuts */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-bold text-gray-600 mr-1">
                    Quick Links:
                  </span>
                  <Link
                    to="/markets"
                    className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-balayong-200 px-3 py-1 font-semibold text-gray-800 hover:bg-balayong-50 hover:text-balayong-900 shadow-2xs transition-colors"
                  >
                    <Store className="h-3 w-3 text-balayong-600" /> Public
                    Markets
                  </Link>
                  <Link
                    to="/fare-calculator"
                    className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-balayong-200 px-3 py-1 font-semibold text-gray-800 hover:bg-balayong-50 hover:text-balayong-900 shadow-2xs transition-colors"
                  >
                    <Calculator className="h-3 w-3 text-primary-600" /> Tricycle
                    Fare
                  </Link>
                  <Link
                    to="/hotlines"
                    className="inline-flex items-center gap-1 rounded-full bg-white/90 border border-balayong-200 px-3 py-1 font-semibold text-gray-800 hover:bg-balayong-50 hover:text-balayong-900 shadow-2xs transition-colors"
                  >
                    <ShieldAlert className="h-3 w-3 text-red-600" /> Hotlines
                  </Link>
                  <button
                    type="button"
                    onClick={() => openSearchWith('business permit')}
                    className="rounded-full bg-white/80 border border-balayong-200 px-3 py-1 font-medium text-gray-700 hover:bg-balayong-50 transition-colors"
                  >
                    Business Permit
                  </button>
                  <button
                    type="button"
                    onClick={() => openSearchWith('birth certificate')}
                    className="rounded-full bg-white/80 border border-balayong-200 px-3 py-1 font-medium text-gray-700 hover:bg-balayong-50 transition-colors"
                  >
                    Civil Registry
                  </button>
                </div>
              </div>
            </div>

            <Link
              to="/prinsesa-ng-baybay"
              aria-label={t('landmark.title')}
              className="group relative hidden h-[26rem] self-end lg:block"
            >
              <img
                src="/prinsesa-ng-baybay.svg"
                alt=""
                className="absolute bottom-0 left-1/2 h-full w-auto -translate-x-1/2 drop-shadow-[0_2px_0_rgb(14_55_85/0.25)]"
              />
            </Link>
          </div>
        </div>

        <div className="relative bg-primary-800 text-white">
          <div className="container mx-auto flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:gap-6">
            <Link
              to="/hotlines"
              className="flex shrink-0 items-center gap-2 text-sm text-primary-100 hover:text-white"
            >
              <Phone className="h-4 w-4 text-balayong-300" aria-hidden="true" />
              <span>{t('hero.hotlinesLabel')}</span>
              <ArrowRight className="h-3.5 w-3.5 text-primary-300" />
            </Link>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {hotlines.map(h => (
                <li key={h.label}>
                  <a
                    href={`tel:${h.tel}`}
                    className="text-sm whitespace-nowrap hover:text-balayong-200"
                  >
                    <span className="font-bold">{h.label}</span>{' '}
                    <span className="text-primary-100">{h.number}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        initialQuery={initialSearchQuery}
      />
    </>
  );
}
