import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  Popup,
  type ExpressionSpecification,
  type LngLatBoundsLike,
  type Map as MapLibreMap,
  type MapLayerMouseEvent,
} from 'maplibre-gl';
import type { Feature, FeatureCollection, Geometry, Position } from 'geojson';
import { Search, MapPin, Users } from 'lucide-react';
// Barangay boundary polygons: NAMRIA/PSA 2023 administrative boundaries,
// high-resolution city file (bgysubmuns-municity-1731500000.0.1) from
// faeldon/philippines-json-maps, 66 features. Coordinates rounded to 5
// decimals (~1 m); names/pcodes kept from the earlier PSGC-matched set:
// https://github.com/faeldon/philippines-json-maps
import barangayBoundaries from '../../data/geo/puerto-princesa-barangays.json';
import { barangayPopulation2024 } from '../../data/barangayPopulation';
import { normalizeBarangayName } from '../../lib/barangayNames';
import { createMap, withOverlays } from '../../lib/mapStyle';
import { demographics } from '../../data/statistics';

const numberFormat = new Intl.NumberFormat('en-US');

interface BarangayProperties {
  name: string;
  pcode: string;
}

const boundaries = barangayBoundaries as FeatureCollection<
  Geometry,
  BarangayProperties
>;

// Feature-state driven styling. Priority:
// an external highlight (hovering the list) wins over the selection, which
// wins over a plain mouse hover.
const isOn = (key: string): ExpressionSpecification => [
  'boolean',
  ['feature-state', key],
  false,
];

const MAP_STYLE = withOverlays(
  {
    barangays: { type: 'geojson', data: boundaries, promoteId: 'pcode' },
  },
  [
    {
      id: 'barangay-fill',
      type: 'fill',
      source: 'barangays',
      paint: {
        'fill-color': [
          'case',
          isOn('highlighted'),
          '#e66f9b', // balayong-400
          isOn('selected'),
          '#d94b7f', // balayong-500
          '#f09dbc', // balayong-300
        ],
        'fill-opacity': [
          'case',
          isOn('highlighted'),
          0.55,
          isOn('selected'),
          0.7,
          isOn('hover'),
          0.55,
          0.3,
        ],
      },
    },
    {
      id: 'barangay-line',
      type: 'line',
      source: 'barangays',
      paint: {
        'line-color': [
          'case',
          isOn('highlighted'),
          '#9c2652', // balayong-700
          isOn('selected'),
          '#7a1f42', // balayong-800
          '#bd3266', // balayong-600
        ],
        'line-width': [
          'case',
          isOn('highlighted'),
          2,
          isOn('selected'),
          2.5,
          isOn('hover'),
          2,
          1,
        ],
      },
    },
  ]
);

// Recursively walks GeoJSON coordinate arrays (Polygon or MultiPolygon,
// any nesting depth) to compute a bounds box.
function extendBoundsFromCoordinates(
  coords: Position | Position[] | Position[][] | Position[][][],
  bounds: { minLat: number; minLng: number; maxLat: number; maxLng: number }
) {
  if (typeof coords[0] === 'number') {
    const [lng, lat] = coords as Position;
    bounds.minLat = Math.min(bounds.minLat, lat);
    bounds.maxLat = Math.max(bounds.maxLat, lat);
    bounds.minLng = Math.min(bounds.minLng, lng);
    bounds.maxLng = Math.max(bounds.maxLng, lng);
  } else {
    (coords as unknown[]).forEach(c =>
      extendBoundsFromCoordinates(c as Position[], bounds)
    );
  }
}

function getFeatureBounds(
  feature: Feature<Geometry, BarangayProperties>
): LngLatBoundsLike {
  const bounds = {
    minLat: Infinity,
    minLng: Infinity,
    maxLat: -Infinity,
    maxLng: -Infinity,
  };
  extendBoundsFromCoordinates(
    // @ts-expect-error -- geometry.coordinates shape varies by type, walked generically
    feature.geometry.coordinates,
    bounds
  );
  return [
    [bounds.minLng, bounds.minLat],
    [bounds.maxLng, bounds.maxLat],
  ];
}

const CITY_BOUNDS = (() => {
  const bounds = {
    minLat: Infinity,
    minLng: Infinity,
    maxLat: -Infinity,
    maxLng: -Infinity,
  };
  boundaries.features.forEach(f =>
    // @ts-expect-error -- geometry.coordinates shape varies by type, walked generically
    extendBoundsFromCoordinates(f.geometry.coordinates, bounds)
  );
  return [
    [bounds.minLng, bounds.minLat],
    [bounds.maxLng, bounds.maxLat],
  ] as LngLatBoundsLike;
})();

// Geodesic polygon area (same spherical-excess formula as turf's `area`),
// so each barangay's land area comes from the boundary itself.
const EARTH_RADIUS_M = 6378137;
const toRad = (deg: number) => (deg * Math.PI) / 180;

function ringAreaM2(ring: Position[]) {
  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const p1 = ring[i];
    const p2 = ring[(i + 1) % ring.length];
    const p3 = ring[(i + 2) % ring.length];
    total += (toRad(p3[0]) - toRad(p1[0])) * Math.sin(toRad(p2[1]));
  }
  return Math.abs((total * EARTH_RADIUS_M * EARTH_RADIUS_M) / 2);
}

function polygonAreaM2(rings: Position[][]) {
  const [outer, ...holes] = rings;
  return holes.reduce((a, h) => a - ringAreaM2(h), ringAreaM2(outer));
}

function geometryAreaKm2(geometry: Geometry) {
  if (geometry.type === 'Polygon')
    return polygonAreaM2(geometry.coordinates) / 1e6;
  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.reduce((a, p) => a + polygonAreaM2(p), 0) / 1e6;
  }
  return 0;
}

// Per-barangay figures for the details card, computed once.
const CITY_POPULATION = demographics.population.total;
const AREA_KM2 = new Map(
  boundaries.features.map(f => [
    f.properties.pcode,
    geometryAreaKm2(f.geometry),
  ])
);
const POPULATION_RANK = new Map(
  boundaries.features
    .map(f => f.properties.name)
    .filter(n => barangayPopulation2024[normalizeBarangayName(n)] != null)
    .sort(
      (a, b) =>
        barangayPopulation2024[normalizeBarangayName(b)] -
        barangayPopulation2024[normalizeBarangayName(a)]
    )
    .map((name, i) => [normalizeBarangayName(name), i + 1])
);

function pcodeByName(name: string | null) {
  if (!name) return undefined;
  return boundaries.features.find(
    f =>
      normalizeBarangayName(f.properties.name) === normalizeBarangayName(name)
  )?.properties.pcode;
}

// Moves a boolean feature-state flag from one barangay to another.
function moveFlag(
  map: MapLibreMap,
  key: string,
  from: string | undefined,
  to: string | undefined
) {
  if (from === to) return;
  if (from) {
    map.setFeatureState({ source: 'barangays', id: from }, { [key]: false });
  }
  if (to) {
    map.setFeatureState({ source: 'barangays', id: to }, { [key]: true });
  }
}

interface BarangayMapProps {
  // Externally-driven highlight (e.g. hovering a barangay in a list
  // elsewhere on the page), distinct from the internal click-to-select state.
  highlightedName?: string | null;
}

export interface BarangayMapHandle {
  // Selects and zooms to a barangay by name, e.g. from a list elsewhere on
  // the page — mirrors clicking the region directly on the map.
  focusByName: (name: string) => void;
}

const BarangayMap = forwardRef<BarangayMapHandle, BarangayMapProps>(
  function BarangayMap({ highlightedName = null }, ref) {
    const { t } = useTranslation('common');
    const [selected, setSelected] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<MapLibreMap | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    const matches = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return boundaries.features
        .filter(f => f.properties.name.toLowerCase().includes(q))
        .slice(0, 8);
    }, [query]);

    const activeName = highlightedName
      ? (boundaries.features.find(
          f =>
            normalizeBarangayName(f.properties.name) ===
            normalizeBarangayName(highlightedName)
        )?.properties.name ?? highlightedName)
      : selected;
    const activePopulation = activeName
      ? barangayPopulation2024[normalizeBarangayName(activeName)]
      : undefined;
    const activeArea = AREA_KM2.get(pcodeByName(activeName) ?? '');
    const activeRank = activeName
      ? POPULATION_RANK.get(normalizeBarangayName(activeName))
      : undefined;

    function showWholeCity() {
      setSelected(null);
      mapRef.current?.fitBounds(CITY_BOUNDS, { padding: 24 });
    }

    function focusBarangay(feature: Feature<Geometry, BarangayProperties>) {
      setSelected(feature.properties.name);
      setQuery('');
      mapRef.current?.fitBounds(getFeatureBounds(feature), {
        maxZoom: 13,
        padding: 24,
      });
    }
    // Map event handlers are bound once; route clicks through a ref so they
    // always call the latest focusBarangay.
    const focusRef = useRef(focusBarangay);
    focusRef.current = focusBarangay;

    useEffect(() => {
      if (!containerRef.current) return;
      const map = createMap({
        container: containerRef.current,
        style: MAP_STYLE,
        bounds: CITY_BOUNDS,
      });
      mapRef.current = map;
      map.on('load', () => setMapLoaded(true));

      const tooltip = new Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'map-tooltip',
        offset: 12,
      });
      let hoveredId: string | undefined;

      map.on('mousemove', 'barangay-fill', (e: MapLayerMouseEvent) => {
        const feature = e.features?.[0];
        if (!feature) return;
        const id = feature.id as string;
        moveFlag(map, 'hover', hoveredId, id);
        hoveredId = id;
        map.getCanvas().style.cursor = 'pointer';
        const name = String(feature.properties.name);
        const population = barangayPopulation2024[normalizeBarangayName(name)];
        tooltip
          .setLngLat(e.lngLat)
          .setText(
            population
              ? `${name} · Pop. ${numberFormat.format(population)}`
              : name
          )
          .addTo(map);
      });
      map.on('mouseleave', 'barangay-fill', () => {
        moveFlag(map, 'hover', hoveredId, undefined);
        hoveredId = undefined;
        map.getCanvas().style.cursor = '';
        tooltip.remove();
      });
      map.on('click', 'barangay-fill', (e: MapLayerMouseEvent) => {
        const pcode = e.features?.[0]?.id;
        const feature = boundaries.features.find(
          f => f.properties.pcode === pcode
        );
        if (feature) focusRef.current(feature);
      });

      return () => {
        tooltip.remove();
        mapRef.current = null;
        setMapLoaded(false);
        map.remove();
      };
    }, []);

    // Mirror React state into feature-state once the barangay source exists.
    const selectedId = pcodeByName(selected);
    const highlightedId = pcodeByName(highlightedName);
    const appliedRef = useRef<{ selected?: string; highlighted?: string }>({});
    useEffect(() => {
      const map = mapRef.current;
      if (!map || !mapLoaded) return;
      moveFlag(map, 'selected', appliedRef.current.selected, selectedId);
      moveFlag(
        map,
        'highlighted',
        appliedRef.current.highlighted,
        highlightedId
      );
      appliedRef.current = { selected: selectedId, highlighted: highlightedId };
    }, [mapLoaded, selectedId, highlightedId]);

    useImperativeHandle(ref, () => ({
      focusByName(name: string) {
        const feature = boundaries.features.find(
          f =>
            normalizeBarangayName(f.properties.name) ===
            normalizeBarangayName(name)
        );
        if (feature) focusBarangay(feature);
      },
    }));

    return (
      <div>
        <div className="relative mb-3 flex justify-end">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('statistics.searchBarangayPlaceholder')}
              className="w-full rounded-full border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            {matches.length > 0 && (
              <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                {matches.map(f => (
                  <li key={f.properties.pcode}>
                    <button
                      type="button"
                      onClick={() => focusBarangay(f)}
                      className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-primary-50"
                    >
                      {f.properties.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="relative z-0">
          <div
            ref={containerRef}
            className="h-96 w-full overflow-hidden rounded-xl lg:h-[28rem]"
          />
        </div>

        <div
          className="mt-3 rounded-xl border border-balayong-200 bg-white px-4 py-3 text-sm text-gray-700"
          aria-live="polite"
        >
          {activeName ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-balayong-600" />
                  <span>
                    {t('statistics.selectedBarangay')}{' '}
                    <strong className="text-base text-gray-900">
                      {activeName}
                    </strong>
                  </span>
                </p>
                {selected && !highlightedName && (
                  <button
                    type="button"
                    onClick={showWholeCity}
                    className="rounded-full px-3 py-1 text-sm font-bold text-primary-700 hover:bg-primary-50"
                  >
                    {t('statistics.details.showCity')}
                  </button>
                )}
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <dt className="flex items-center gap-1 text-xs text-gray-500">
                    <Users className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('statistics.details.population')}
                  </dt>
                  <dd className="font-bold text-gray-900 tabular-nums">
                    {activePopulation != null
                      ? numberFormat.format(activePopulation)
                      : '--'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">
                    {t('statistics.details.landArea')}
                  </dt>
                  <dd className="font-bold text-gray-900 tabular-nums">
                    {activeArea != null
                      ? `${activeArea.toFixed(activeArea < 10 ? 2 : 1)} km²`
                      : '--'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">
                    {t('statistics.details.density')}
                  </dt>
                  <dd className="font-bold text-gray-900 tabular-nums">
                    {activePopulation != null && activeArea
                      ? numberFormat.format(
                          Math.round(activePopulation / activeArea)
                        )
                      : '--'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">
                    {t('statistics.details.rank')}
                  </dt>
                  <dd className="font-bold text-gray-900 tabular-nums">
                    {activeRank != null
                      ? t('statistics.details.rankValue', {
                          rank: activeRank,
                          total: POPULATION_RANK.size,
                        })
                      : '--'}
                  </dd>
                </div>
              </dl>
              {activePopulation != null && (
                <p className="mt-2 text-xs text-gray-500">
                  {t('statistics.details.share', {
                    percent: (
                      (activePopulation / CITY_POPULATION) *
                      100
                    ).toFixed(1),
                  })}
                </p>
              )}
            </>
          ) : (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-balayong-600" />
              {t('statistics.mapHint')}
            </p>
          )}
        </div>

        <p className="mt-2 text-xs text-gray-600">
          {t('statistics.mapSourcesLabel')}:{' '}
          <a
            href="https://github.com/faeldon/philippines-json-maps"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary-600"
          >
            {t('statistics.mapSourceBoundaries')}
          </a>
          {', '}
          <a
            href="https://psa.gov.ph/classification/psgc/barangays/1731500000"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary-600"
          >
            {t('statistics.mapSourcePopulation')}
          </a>
        </p>
      </div>
    );
  }
);

export default BarangayMap;
