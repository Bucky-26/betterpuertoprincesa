import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Marker,
  Popup,
  type LngLatBoundsLike,
  type Map as MapLibreMap,
} from 'maplibre-gl';
import { ExternalLink, Trees } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { miningSites, type MiningSite } from '../../data/miningSites';
import { createMap, withOverlays } from '../../lib/mapStyle';

// Hansen/UMD/Google/USGS/NASA tree cover loss, 2001-2024 (the most recent
// year published — annual satellite analysis lags about a year, so
// 2025/2026 loss isn't computed anywhere yet), via Global Forest Watch's
// public tile service (no API key required): https://www.globalforestwatch.org/
// 30m-resolution satellite-derived forest loss, not specific to any single
// mining concession.
//
// Hits the "dynamic" (server-rendered) endpoint directly rather than via the
// "latest" alias, which wastes two redirects per tile. Tiles a browser
// hasn't requested before render in ~1-2s (cold), but GFW's CDN caches every
// tile after its first request, so repeat views of this same bounded area
// are fast (~0.1-0.2s) — an acceptable trade for one more year of data than
// the older pre-rendered v1.11 static tiles.
//
// render_type=true_color is required: without it the endpoint returns
// data-encoded tiles (red = loss intensity, other channels = year) that
// GFW's own site decodes in the browser. Drawn raw, those show up as a
// dark red-black blanket over the whole island instead of actual loss.
const FOREST_LOSS_TILE_URL =
  'https://tiles.globalforestwatch.org/umd_tree_cover_loss/v1.13/dynamic/{z}/{x}/{y}.png?implementation=tcd_30&start_year=2001&end_year=2024&render_type=true_color';

// Slightly padded past the map's own PALAWAN_BOUNDS so tiles at the edge of
// the viewport aren't clipped mid-pan. [west, south, east, north].
const FOREST_LOSS_BOUNDS: [number, number, number, number] = [
  116.7, 7.8, 119.7, 10.7,
];

// GFW renders loss in pink, which would read as the site's balayong pink
// and sit too close to the red mining-site pins — shift it toward an
// orange "scorched earth" tone instead.
const MAP_STYLE = withOverlays(
  {
    'forest-loss': {
      type: 'raster',
      tiles: [FOREST_LOSS_TILE_URL],
      tileSize: 256,
      bounds: FOREST_LOSS_BOUNDS,
      attribution:
        'Tree cover loss: Hansen/UMD/Google/USGS/NASA, via <a href="https://www.globalforestwatch.org/" target="_blank" rel="noopener noreferrer">Global Forest Watch</a>',
    },
  },
  [
    {
      id: 'forest-loss',
      type: 'raster',
      source: 'forest-loss',
      layout: { visibility: 'none' },
      paint: {
        'raster-opacity': 0.9,
        'raster-hue-rotate': 60,
        'raster-brightness-max': 0.8,
      },
    },
  ]
);

const numberFormat = new Intl.NumberFormat('en-US');

function pinElement(site: MiningSite) {
  const el = document.createElement('button');
  el.type = 'button';
  el.setAttribute('aria-label', site.name);
  el.style.cssText = `display:block;width:14px;height:14px;border-radius:9999px;background:${site.status === 'active' ? '#dc2626' : '#78716c'};border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4);cursor:pointer;padding:0;`;
  return el;
}

const PALAWAN_BOUNDS: LngLatBoundsLike = [
  [117.2, 8.3],
  [119.2, 10.2],
];

function SitePopup({ site }: { site: MiningSite }) {
  const { t } = useTranslation('common');
  return (
    <div className="min-w-[220px] space-y-1">
      <p className="font-semibold text-gray-900">{site.name}</p>
      {site.operator && (
        <p className="text-xs text-gray-500">
          {t('miningWatch.map.popupOperator')}: {site.operator}
        </p>
      )}
      <p className="text-xs text-gray-500">
        {site.barangay}, {site.municipality}
      </p>
      <p className="text-xs text-gray-500">{site.commodity}</p>
      {site.areaHa ? (
        <p className="text-xs text-gray-500">
          {t('miningWatch.map.sizeLabel')}: {numberFormat.format(site.areaHa)}{' '}
          ha
        </p>
      ) : null}
      {site.tenement && (
        <p className="text-xs text-gray-500">
          {t('miningWatch.map.permitLabel')}: {site.tenement}
        </p>
      )}
      <p className="text-xs font-medium text-gray-700">
        {site.status === 'active'
          ? t('miningWatch.map.popupActive')
          : t('miningWatch.map.popupHistorical')}
      </p>
      <p className="text-sm text-gray-700">
        {t(`miningWatch.siteDescriptions.${site.id}`, {
          defaultValue: site.description,
        })}
      </p>
      <a
        href={site.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
      >
        {site.sourceLabel}
        <ExternalLink className="h-3 w-3" strokeWidth={2.5} />
      </a>
    </div>
  );
}

export default function PalawanMiningMap() {
  const { t } = useTranslation('common');
  const [showForestLoss, setShowForestLoss] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const loadedRef = useRef(false);
  const showForestLossRef = useRef(showForestLoss);
  // Popup bodies are DOM nodes owned by MapLibre; React fills them through
  // portals so the popup content stays ordinary JSX.
  const [popupNodes] = useState(() =>
    miningSites.map(() => document.createElement('div'))
  );

  useEffect(() => {
    if (!containerRef.current) return;
    const map = createMap({
      container: containerRef.current,
      style: MAP_STYLE,
      bounds: PALAWAN_BOUNDS,
    });
    mapRef.current = map;

    const applyForestLoss = () =>
      map.setLayoutProperty(
        'forest-loss',
        'visibility',
        showForestLossRef.current ? 'visible' : 'none'
      );
    map.on('load', () => {
      loadedRef.current = true;
      applyForestLoss();
    });

    miningSites.forEach((site, i) => {
      new Marker({ element: pinElement(site) })
        .setLngLat([site.lng, site.lat])
        .setPopup(
          new Popup({ offset: 10, maxWidth: '300px' }).setDOMContent(
            popupNodes[i]
          )
        )
        .addTo(map);
    });

    return () => {
      loadedRef.current = false;
      mapRef.current = null;
      map.remove();
    };
  }, [popupNodes]);

  useEffect(() => {
    showForestLossRef.current = showForestLoss;
    if (loadedRef.current) {
      mapRef.current?.setLayoutProperty(
        'forest-loss',
        'visibility',
        showForestLoss ? 'visible' : 'none'
      );
    }
  }, [showForestLoss]);

  return (
    <div>
      <div className="relative z-0">
        <button
          type="button"
          onClick={() => setShowForestLoss(v => !v)}
          aria-pressed={showForestLoss}
          className={`absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold shadow transition-colors ${
            showForestLoss
              ? 'border-orange-700 bg-orange-600 text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Trees className="h-3.5 w-3.5" strokeWidth={2.5} />
          {t('miningWatch.map.toggleForestLoss')}
        </button>
        <div
          ref={containerRef}
          className="h-96 w-full rounded-md lg:h-[28rem]"
        />
        {miningSites.map((site, i) =>
          createPortal(<SitePopup site={site} />, popupNodes[i], site.id)
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-white bg-red-600 shadow" />
          {t('miningWatch.map.legendActive')}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-white bg-stone-500 shadow" />
          {t('miningWatch.map.legendHistorical')}
        </span>
        {showForestLoss && (
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-orange-500/80" />
            {t('miningWatch.map.legendForestLoss')}
          </span>
        )}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {t('miningWatch.map.sourcesBefore')}{' '}
        <a
          href="https://www.globalforestwatch.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-primary-600"
        >
          Global Forest Watch
        </a>
        {t('miningWatch.map.sourcesAfter')}
      </p>
    </div>
  );
}
