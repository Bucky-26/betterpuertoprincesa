import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Banknote, Clock } from 'lucide-react';
import { Ticker } from '../ui/Ticker';
import { pesoRate, useRates, useWeather, weatherInfo } from '../../lib/weather';

// Currencies visitors and residents check most, with a sensible unit for
// small-value ones (₩1 or ¥1 would round to centavos).
const CURRENCIES = [
  { code: 'USD', symbol: 'US$', unit: 1 },
  { code: 'KRW', symbol: '₩', unit: 1000 },
  { code: 'JPY', symbol: '¥', unit: 100 },
  { code: 'CNY', symbol: 'CN¥', unit: 1 },
  { code: 'EUR', symbol: '€', unit: 1 },
];

const numberFormat = new Intl.NumberFormat('en-US');

function useManilaClock(locale: string) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  return {
    date: now.toLocaleDateString(locale, {
      timeZone: 'Asia/Manila',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
    time: now.toLocaleTimeString(locale, {
      timeZone: 'Asia/Manila',
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
}

export default function InfoBar() {
  const { t, i18n } = useTranslation('common');
  const locale = i18n.resolvedLanguage === 'fil' ? 'fil-PH' : 'en-US';
  const weather = useWeather();
  const rates = useRates();
  const { date, time } = useManilaClock(locale);
  const info = weatherInfo(weather?.code);
  const Icon = info.icon;

  const rateItems = CURRENCIES.map(c => {
    const rate = pesoRate(rates, c.code);
    return rate
      ? `${c.symbol}${numberFormat.format(c.unit)} = ₱${(rate * c.unit).toFixed(2)}`
      : `${c.symbol}${numberFormat.format(c.unit)} = ₱--`;
  });

  return (
    <div
      className="border-b border-primary-100 bg-primary-50 text-[0.8125rem] text-primary-900"
      role="complementary"
      aria-label={t('weather.infoWeather')}
    >
      <div className="container mx-auto flex items-center justify-between gap-6 px-4 py-2">
        <p
          className="flex min-w-0 items-center gap-2"
          aria-label={t('weather.infoWeather')}
        >
          <Icon
            className={`h-4 w-4 shrink-0 ${info.color}`}
            aria-hidden="true"
          />
          <span className="font-bold">Puerto Princesa</span>
          <span className="tabular-nums">
            {weather?.temp != null ? `${Math.round(weather.temp)}°C` : '--°C'}
          </span>
          {info.key && (
            <span className="hidden truncate text-primary-700 sm:inline">
              {t(`weather.conditions.${info.key}`)}
            </span>
          )}
        </p>

        <div className="flex shrink-0 items-center gap-6">
          <p
            className="hidden items-center gap-2 md:flex"
            aria-label={t('weather.infoRates')}
          >
            <Banknote
              className="h-4 w-4 text-balayong-600"
              aria-hidden="true"
            />
            <Ticker items={rateItems} intervalMs={4000} />
          </p>
          <p
            className="flex items-center gap-2"
            aria-label={t('weather.infoTime')}
          >
            <Clock className="h-4 w-4 text-balayong-600" aria-hidden="true" />
            <span className="hidden sm:inline">{date}</span>
            <span className="font-bold">{time}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
