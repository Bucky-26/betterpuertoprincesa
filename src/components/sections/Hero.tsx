import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone } from 'lucide-react';
import BalayongBranch from '../ui/BalayongBranch';
import { hotlines } from '../../data/hotlines';

// Pink field for the balayong, a bay-blue band along the bottom for the
// Baywalk, and the Prinsesa ng Baybay statue standing at the water's edge.
export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-balayong-100">
      <BalayongBranch className="pointer-events-none absolute -right-16 -top-6 w-[22rem] opacity-60 sm:w-[28rem] lg:right-auto lg:left-[52%] lg:w-[31rem] lg:opacity-100" />

      <div className="container relative mx-auto px-4">
        <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="pt-16 pb-12 md:pt-24 md:pb-16">
            <h1 className="font-display text-5xl leading-[1.02] text-gray-900 sm:text-6xl lg:text-7xl">
              {t('hero.greeting')}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-gray-700">
              {t('hero.subtitle')}
            </p>
            <Link
              to="/services"
              className="mt-8 inline-flex items-center rounded-full bg-primary-700 px-6 py-3 font-bold text-white transition-colors hover:bg-primary-800"
            >
              {t('hero.browseServices')}
            </Link>
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
          <p className="flex shrink-0 items-center gap-2 text-sm text-primary-100">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {t('hero.hotlinesLabel')}
          </p>
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
  );
}
