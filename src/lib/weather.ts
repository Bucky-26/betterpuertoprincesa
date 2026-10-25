import { useEffect, useState } from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudRainWind,
  CloudSun,
  Sun,
  type LucideIcon,
} from 'lucide-react';

// City proper (near City Hall), used for the main reading.
export const CITY = { lat: 9.7392, lon: 118.7353 };

// Other places people check before heading out. Approximate coordinates;
// Open-Meteo's grid is a few km wide, so these are close enough.
export const NEARBY = [
  { key: 'sabang', lat: 10.198, lon: 118.904 },
  { key: 'hondaBay', lat: 9.86, lon: 118.8 },
] as const;

// WMO weather codes (Open-Meteo) → icon, a color that suits the condition,
// and a translation key under weather.conditions.
const CODES: Record<number, { icon: LucideIcon; color: string; key: string }> =
  {
    0: { icon: Sun, color: 'text-amber-500', key: 'clear' },
    1: { icon: CloudSun, color: 'text-amber-500', key: 'mainlyClear' },
    2: { icon: CloudSun, color: 'text-amber-500', key: 'partlyCloudy' },
    3: { icon: Cloud, color: 'text-gray-500', key: 'overcast' },
    45: { icon: CloudFog, color: 'text-gray-400', key: 'fog' },
    48: { icon: CloudFog, color: 'text-gray-400', key: 'fog' },
    51: { icon: CloudDrizzle, color: 'text-primary-400', key: 'drizzle' },
    53: { icon: CloudDrizzle, color: 'text-primary-400', key: 'drizzle' },
    55: { icon: CloudDrizzle, color: 'text-primary-500', key: 'drizzle' },
    61: { icon: CloudRain, color: 'text-primary-500', key: 'lightRain' },
    63: { icon: CloudRain, color: 'text-primary-600', key: 'rain' },
    65: { icon: CloudRainWind, color: 'text-primary-700', key: 'heavyRain' },
    80: { icon: CloudRain, color: 'text-primary-500', key: 'showers' },
    81: { icon: CloudRain, color: 'text-primary-600', key: 'showers' },
    82: { icon: CloudRainWind, color: 'text-primary-700', key: 'heavyRain' },
    95: { icon: CloudLightning, color: 'text-violet-600', key: 'thunderstorm' },
    96: { icon: CloudLightning, color: 'text-violet-600', key: 'thunderstorm' },
    99: { icon: CloudLightning, color: 'text-violet-700', key: 'thunderstorm' },
  };

const UNKNOWN = { icon: Cloud, color: 'text-gray-400', key: '' };

export function weatherInfo(code: number | null | undefined) {
  return (code != null && CODES[code]) || UNKNOWN;
}

export interface ForecastDay {
  date: string; // YYYY-MM-DD, local to Puerto Princesa
  max: number | null;
  min: number | null;
  code: number | null;
  rainChance: number | null;
  uvMax: number | null;
  sunrise: string | null; // local ISO time
  sunset: string | null;
}

export interface WeatherData {
  temp: number | null;
  code: number | null;
  wind: number | null;
  daily: ForecastDay[];
  nearby: { key: string; temp: number | null; code: number | null }[];
}

// One request per page load, shared by the info bar and the home section.
let weatherPromise: Promise<WeatherData> | null = null;
let ratesPromise: Promise<Record<string, number> | null> | null = null;

function loadWeather(): Promise<WeatherData> {
  const points = [CITY, ...NEARBY];
  const lats = points.map(p => p.lat).join(',');
  const lons = points.map(p => p.lon).join(',');
  return fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}` +
      '&current_weather=true&timezone=Asia%2FManila&forecast_days=6' +
      '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset'
  )
    .then(r => r.json())
    .then(raw => {
      const results = Array.isArray(raw) ? raw : [raw];
      const city = results[0];
      const d = city?.daily ?? {};
      return {
        temp: city?.current_weather?.temperature ?? null,
        code: city?.current_weather?.weathercode ?? null,
        wind: city?.current_weather?.windspeed ?? null,
        daily: (d.time ?? []).map((date: string, i: number) => ({
          date,
          max: d.temperature_2m_max?.[i] ?? null,
          min: d.temperature_2m_min?.[i] ?? null,
          code: d.weathercode?.[i] ?? null,
          rainChance: d.precipitation_probability_max?.[i] ?? null,
          uvMax: d.uv_index_max?.[i] ?? null,
          sunrise: d.sunrise?.[i] ?? null,
          sunset: d.sunset?.[i] ?? null,
        })),
        nearby: NEARBY.map((p, i) => ({
          key: p.key,
          temp: results[i + 1]?.current_weather?.temperature ?? null,
          code: results[i + 1]?.current_weather?.weathercode ?? null,
        })),
      };
    });
}

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(null);
  useEffect(() => {
    weatherPromise ??= loadWeather().catch(err => {
      weatherPromise = null;
      throw err;
    });
    let alive = true;
    weatherPromise.then(w => alive && setData(w)).catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return data;
}

// Rates are quoted per US dollar; convert to pesos per unit of `currency`.
export function pesoRate(
  rates: Record<string, number> | null,
  currency: string
) {
  if (!rates?.PHP || !rates[currency]) return null;
  return rates.PHP / rates[currency];
}

export function useRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  useEffect(() => {
    ratesPromise ??= fetch('https://open.er-api.com/v6/latest/USD')
      .then(r => r.json())
      .then(d => (d?.rates?.PHP ? (d.rates as Record<string, number>) : null))
      .catch(() => {
        ratesPromise = null;
        return null;
      });
    let alive = true;
    ratesPromise.then(r => alive && setRates(r));
    return () => {
      alive = false;
    };
  }, []);
  return rates;
}

// "05:42" from a local ISO timestamp like "2026-10-25T05:42".
export function clockTime(iso: string | null) {
  if (!iso) return '--';
  const [h, m] = iso.slice(11, 16).split(':').map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}
