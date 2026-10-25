import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowDown,
  ArrowUp,
  Droplets,
  Sun,
  Sunrise,
  Sunset,
  Wind,
} from 'lucide-react';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { BarangayMap } from '../map/LazyMaps';
import {
  clockTime,
  pesoRate,
  useRates,
  useWeather,
  weatherInfo,
} from '../../lib/weather';

const CURRENCIES = [
  { code: 'USD', name: 'US dollar', unit: 1 },
  { code: 'KRW', name: 'Korean won', unit: 1000 },
  { code: 'JPY', name: 'Japanese yen', unit: 100 },
  { code: 'CNY', name: 'Chinese yuan', unit: 1 },
  { code: 'EUR', name: 'Euro', unit: 1 },
  { code: 'AUD', name: 'Australian dollar', unit: 1 },
];

const numberFormat = new Intl.NumberFormat('en-US');
const round = (n: number | null | undefined, unit = '°') =>
  n != null ? `${Math.round(n)}${unit}` : '--';

function uvLevel(uv: number | null) {
  if (uv == null) return null;
  if (uv < 3) return 'low';
  if (uv < 6) return 'moderate';
  if (uv < 8) return 'high';
  if (uv < 11) return 'veryHigh';
  return 'extreme';
}

function Panel({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-5 md:p-6 ${className}`}
    >
      <h3 className="mb-4 font-sans text-base font-bold text-gray-700">
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function WeatherMapSection() {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.resolvedLanguage === 'fil' ? 'fil-PH' : 'en-US';
  const weather = useWeather();
  const rates = useRates();
  const today = weather?.daily[0];
  const next =
    weather?.daily.slice(1, 6) ?? Array.from({ length: 5 }, () => null);
  const now = weatherInfo(weather?.code);
  const NowIcon = now.icon;
  const uv = uvLevel(today?.uvMax ?? null);

  // The rates table is short on purpose; rotate through it on wide lists.
  const [ratePage, setRatePage] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setRatePage(p => (p + 1) % 2), 6000);
    return () => clearInterval(id);
  }, []);
  const shownRates = CURRENCIES.slice(ratePage * 3, ratePage * 3 + 3);

  const dayLabel = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString(locale, {
      weekday: 'short',
    });
  const dayDate = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString(locale, {
      month: 'short',
      day: 'numeric',
    });

  return (
    <Section>
      <Heading level={2}>{t('weatherMap.title')}</Heading>
      <p className="max-w-prose text-lg text-gray-600">
        {t('weatherMap.subtitle')}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Weather now, the week ahead, and nearby spots */}
        <Panel title={t('weather.infoWeather')}>
          <div className="flex items-center gap-4">
            <NowIcon className={`h-14 w-14 ${now.color}`} aria-hidden="true" />
            <div>
              <p className="font-display text-5xl leading-none text-gray-900 tabular-nums">
                {round(weather?.temp, '°C')}
              </p>
              <p className="mt-1 font-bold text-gray-800">
                {now.key ? t(`weather.conditions.${now.key}`) : '--'}
              </p>
              <p className="text-sm text-gray-600">{t('weather.cityProper')}</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-2 text-sm">
            {[
              {
                icon: ArrowUp,
                label: t('weather.high'),
                value: round(today?.max),
              },
              {
                icon: ArrowDown,
                label: t('weather.low'),
                value: round(today?.min),
              },
              {
                icon: Wind,
                label: t('weather.wind'),
                value: round(weather?.wind, ' km/h'),
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-lg bg-primary-50 px-3 py-2">
                <dt className="flex items-center gap-1 text-xs text-primary-800">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {label}
                </dt>
                <dd className="mt-0.5 font-bold text-gray-900 tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <h4 className="mt-6 mb-2 text-sm font-bold text-gray-700">
            {t('weather.forecast')}
          </h4>
          <ul className="grid grid-cols-5 gap-1 text-center">
            {next.map((day, i) => {
              const info = weatherInfo(day?.code);
              const Icon = info.icon;
              return (
                <li key={day?.date ?? i} className="rounded-lg py-2">
                  <p className="text-sm font-bold text-gray-800">
                    {day ? dayLabel(day.date) : '--'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {day ? dayDate(day.date) : ''}
                  </p>
                  <Icon
                    className={`mx-auto my-1.5 h-6 w-6 ${info.color}`}
                    aria-label={
                      info.key ? t(`weather.conditions.${info.key}`) : undefined
                    }
                  />
                  <p className="text-sm tabular-nums">
                    <span className="font-bold text-gray-900">
                      {round(day?.max)}
                    </span>{' '}
                    <span className="text-gray-500">{round(day?.min)}</span>
                  </p>
                </li>
              );
            })}
          </ul>

          <h4 className="mt-6 mb-2 text-sm font-bold text-gray-700">
            {t('weather.nearbyTitle')}
          </h4>
          <ul className="space-y-2">
            {(weather?.nearby ?? []).map(place => {
              const info = weatherInfo(place.code);
              const Icon = info.icon;
              return (
                <li
                  key={place.key}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2"
                >
                  <Icon
                    className={`h-5 w-5 ${info.color}`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-sm text-gray-800">
                    {t(`weather.nearby.${place.key}`)}
                  </span>
                  <span className="font-bold text-gray-900 tabular-nums">
                    {round(place.temp, '°C')}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            {t('weather.weatherSource')}
          </p>
        </Panel>

        {/* Interactive barangay map: search, select, population */}
        <Panel
          title={t('statistics.barangayMapHeading')}
          className="lg:col-span-2"
        >
          <p className="-mt-2 mb-3 text-sm text-gray-600">
            {t('statistics.barangayMapSubtitle')}
          </p>
          <BarangayMap />
        </Panel>

        {/* Today at a glance: sun, rain, UV */}
        <Panel title={t('weather.todayTitle')}>
          <dl className="space-y-3">
            {[
              {
                icon: Sunrise,
                label: t('weather.sunrise'),
                value: clockTime(today?.sunrise ?? null),
              },
              {
                icon: Sunset,
                label: t('weather.sunset'),
                value: clockTime(today?.sunset ?? null),
              },
              {
                icon: Droplets,
                label: t('weather.rainChance'),
                value: round(today?.rainChance, '%'),
              },
              {
                icon: Sun,
                label: t('weather.uv'),
                value:
                  today?.uvMax != null
                    ? `${Math.round(today.uvMax)} (${t(`weather.uvLevels.${uv}`)})`
                    : '--',
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-balayong-100 text-balayong-700">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <dt className="flex-1 text-sm text-gray-700">{label}</dt>
                <dd className="font-bold text-gray-900 tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </Panel>

        {/* Exchange rates */}
        <Panel title={t('weather.currencyTitle')} className="lg:col-span-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                <th className="pb-2 font-normal">{t('weather.currencyCol')}</th>
                <th className="pb-2 text-right font-normal">
                  {t('weather.rateCol')}
                </th>
              </tr>
            </thead>
            <tbody key={ratePage} className="motion-safe:animate-fade-in">
              {shownRates.map(c => {
                const rate = pesoRate(rates, c.code);
                return (
                  <tr key={c.code} className="border-b border-gray-100">
                    <td className="py-2.5">
                      <span className="font-bold text-gray-900">
                        {c.unit > 1 ? `${numberFormat.format(c.unit)} ` : ''}
                        {c.code}
                      </span>
                      <span className="block text-xs text-gray-500">
                        {c.name}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-bold text-gray-900 tabular-nums">
                      {rate ? `₱${(rate * c.unit).toFixed(2)}` : '--'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="mt-3 text-xs text-gray-500">
            {t('weather.ratesSource')}
          </p>
        </Panel>
      </div>
    </Section>
  );
}
