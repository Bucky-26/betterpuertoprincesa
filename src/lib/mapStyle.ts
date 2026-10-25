import {
  Map as MapLibreMap,
  NavigationControl,
  type LayerSpecification,
  type MapOptions,
  type SourceSpecification,
  type StyleSpecification,
} from 'maplibre-gl';

// Custom basemap drawn from OpenFreeMap's free OpenMapTiles vector tiles
// (no API key — CARTO's basemaps now require one). Colors follow the site
// palette in src/index.css: bay blues for water, cool grays for
// roads/labels, so balayong-pink overlays (barangays, pins) read on top.
const COLORS = {
  land: '#f8f9fa', // gray-50
  water: '#d6e7f3', // primary-100
  waterLine: '#adcfe6', // primary-200
  waterLabel: '#134a71', // primary-700
  green: '#e4efdf',
  greenDark: '#d6e7cf',
  residential: '#f1f3f5', // gray-100
  roadMajor: '#ffffff',
  roadMajorCasing: '#ced4da', // gray-400
  roadMinor: '#ffffff',
  roadMinorCasing: '#dee2e6', // gray-300
  track: '#ced4da', // gray-400
  building: '#e9ecef', // gray-200
  boundary: '#adb5bd', // gray-500
  label: '#17212b', // gray-900
  labelSoft: '#45505b', // gray-700
  halo: '#ffffff',
};

const FONT_REGULAR = ['Noto Sans Regular'];
const FONT_BOLD = ['Noto Sans Bold'];
const FONT_ITALIC = ['Noto Sans Italic'];

const MAJOR_ROADS = ['motorway', 'trunk', 'primary'];
const MID_ROADS = ['secondary', 'tertiary'];
const MINOR_ROADS = ['minor', 'service'];

export const MAP_ATTRIBUTION =
  '<a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a> ' +
  '<a href="https://www.openmaptiles.org/" target="_blank" rel="noopener noreferrer">&copy; OpenMapTiles</a> ' +
  'Data from <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>';

export const BASE_MAP_STYLE: StyleSpecification = {
  version: 8,
  glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
  sources: {
    openmaptiles: {
      type: 'vector',
      url: 'https://tiles.openfreemap.org/planet',
      attribution: MAP_ATTRIBUTION,
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': COLORS.land },
    },
    {
      id: 'landcover-green',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landcover',
      filter: [
        'in',
        ['get', 'class'],
        ['literal', ['wood', 'grass', 'farmland', 'wetland']],
      ],
      paint: {
        'fill-color': [
          'match',
          ['get', 'class'],
          'wood',
          COLORS.greenDark,
          COLORS.green,
        ],
        'fill-opacity': 0.7,
      },
    },
    {
      id: 'park',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'park',
      paint: { 'fill-color': COLORS.green, 'fill-opacity': 0.6 },
    },
    {
      id: 'landuse-residential',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'landuse',
      filter: [
        'in',
        ['get', 'class'],
        ['literal', ['residential', 'suburb', 'neighbourhood']],
      ],
      paint: { 'fill-color': COLORS.residential, 'fill-opacity': 0.8 },
    },
    {
      id: 'waterway',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'waterway',
      paint: {
        'line-color': COLORS.waterLine,
        'line-width': ['interpolate', ['linear'], ['zoom'], 9, 0.5, 14, 2.5],
      },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'water',
      paint: { 'fill-color': COLORS.water },
    },
    {
      id: 'building',
      type: 'fill',
      source: 'openmaptiles',
      'source-layer': 'building',
      minzoom: 14,
      paint: { 'fill-color': COLORS.building },
    },
    {
      id: 'road-track',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 12,
      filter: ['in', ['get', 'class'], ['literal', ['track', 'path']]],
      paint: {
        'line-color': COLORS.track,
        'line-width': 1,
        'line-dasharray': [2, 2],
      },
    },
    {
      id: 'road-minor-casing',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 12,
      filter: ['in', ['get', 'class'], ['literal', MINOR_ROADS]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': COLORS.roadMinorCasing,
        'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1.5, 16, 8],
      },
    },
    {
      id: 'road-minor',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      minzoom: 12,
      filter: ['in', ['get', 'class'], ['literal', MINOR_ROADS]],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': COLORS.roadMinor,
        'line-width': ['interpolate', ['linear'], ['zoom'], 12, 0.75, 16, 6],
      },
    },
    {
      id: 'road-major-casing',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: [
        'in',
        ['get', 'class'],
        ['literal', [...MAJOR_ROADS, ...MID_ROADS]],
      ],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': COLORS.roadMajorCasing,
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8,
          1.5,
          12,
          4,
          16,
          14,
        ],
      },
    },
    {
      id: 'road-major',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: [
        'in',
        ['get', 'class'],
        ['literal', [...MAJOR_ROADS, ...MID_ROADS]],
      ],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: {
        'line-color': COLORS.roadMajor,
        'line-width': [
          'interpolate',
          ['linear'],
          ['zoom'],
          8,
          0.75,
          12,
          2.5,
          16,
          11,
        ],
      },
    },
    {
      id: 'boundary-admin',
      type: 'line',
      source: 'openmaptiles',
      'source-layer': 'boundary',
      filter: [
        'all',
        ['<=', ['get', 'admin_level'], 6],
        ['!=', ['get', 'maritime'], 1],
      ],
      paint: {
        'line-color': COLORS.boundary,
        'line-width': 1,
        'line-dasharray': [3, 2],
      },
    },
    {
      id: 'water-name',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'water_name',
      layout: {
        'text-field': ['get', 'name'],
        'text-font': FONT_ITALIC,
        'text-size': 12,
        'text-max-width': 8,
      },
      paint: {
        'text-color': COLORS.waterLabel,
        'text-halo-color': COLORS.halo,
        'text-halo-width': 1,
      },
    },
    {
      id: 'road-name',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'transportation_name',
      minzoom: 13,
      layout: {
        'symbol-placement': 'line',
        'text-field': ['get', 'name'],
        'text-font': FONT_REGULAR,
        'text-size': 11,
      },
      paint: {
        'text-color': COLORS.labelSoft,
        'text-halo-color': COLORS.halo,
        'text-halo-width': 1.5,
      },
    },
    {
      id: 'place-village',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      minzoom: 11,
      filter: [
        'in',
        ['get', 'class'],
        ['literal', ['village', 'hamlet', 'suburb', 'neighbourhood']],
      ],
      layout: {
        'text-field': ['get', 'name'],
        'text-font': FONT_REGULAR,
        'text-size': ['interpolate', ['linear'], ['zoom'], 11, 10, 15, 13],
        'text-max-width': 8,
      },
      paint: {
        'text-color': COLORS.labelSoft,
        'text-halo-color': COLORS.halo,
        'text-halo-width': 1.5,
      },
    },
    {
      id: 'place-town',
      type: 'symbol',
      source: 'openmaptiles',
      'source-layer': 'place',
      filter: ['in', ['get', 'class'], ['literal', ['city', 'town']]],
      layout: {
        'text-field': ['get', 'name'],
        'text-font': FONT_BOLD,
        'text-size': ['interpolate', ['linear'], ['zoom'], 8, 11, 14, 16],
        'text-max-width': 8,
      },
      paint: {
        'text-color': COLORS.label,
        'text-halo-color': COLORS.halo,
        'text-halo-width': 1.5,
      },
    },
  ],
};

// Returns BASE_MAP_STYLE with extra sources/layers baked in (rather than
// added on `load`) so overlays are part of the very first render. Overlay
// layers sit under the label layers so place names stay readable on top.
export function withOverlays(
  sources: Record<string, SourceSpecification>,
  layers: LayerSpecification[]
): StyleSpecification {
  const firstLabel = BASE_MAP_STYLE.layers.findIndex(l => l.type === 'symbol');
  return {
    ...BASE_MAP_STYLE,
    sources: { ...BASE_MAP_STYLE.sources, ...sources },
    layers: [
      ...BASE_MAP_STYLE.layers.slice(0, firstLabel),
      ...layers,
      ...BASE_MAP_STYLE.layers.slice(firstLabel),
    ],
  };
}

// Shared map setup: no scroll-zoom hijacking while scrolling the page, no
// rotation/tilt (flat civic maps), and +/- zoom buttons top-left.
export function createMap(
  options: Omit<MapOptions, 'style'> & { style?: StyleSpecification }
): MapLibreMap {
  const map = new MapLibreMap({
    style: BASE_MAP_STYLE,
    scrollZoom: false,
    dragRotate: false,
    pitchWithRotate: false,
    attributionControl: { compact: true },
    ...options,
  });
  map.touchZoomRotate.disableRotation();
  // Compact attribution opens itself once the source's attribution text
  // arrives; collapse it to the (i) button the first time that happens.
  const collapseAttribution = () => {
    const attrib = map
      .getContainer()
      .querySelector('.maplibregl-ctrl-attrib.maplibregl-compact');
    if (!attrib) return;
    attrib.classList.remove('maplibregl-compact-show');
    map.off('styledata', collapseAttribution);
    map.off('sourcedata', collapseAttribution);
  };
  map.on('styledata', collapseAttribution);
  map.on('sourcedata', collapseAttribution);
  map.addControl(new NavigationControl({ showCompass: false }), 'top-left');
  return map;
}
