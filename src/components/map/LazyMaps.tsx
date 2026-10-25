import { lazy, Suspense, type ComponentProps, type Ref } from 'react';
import type { BarangayMapHandle } from './BarangayMap';

// MapLibre is a large dependency (~800 KB), so each map is split into its own
// chunk and only downloaded on pages that actually render one.
const BarangayMapImpl = lazy(() => import('./BarangayMap'));
const PalawanMiningMapImpl = lazy(() => import('./PalawanMiningMap'));
const LandmarkMapImpl = lazy(() => import('./LandmarkMap'));

function MapFallback() {
  return (
    <div className="h-96 w-full animate-pulse rounded-xl bg-gray-100 lg:h-[28rem]" />
  );
}

export function BarangayMap(
  props: ComponentProps<typeof BarangayMapImpl> & {
    ref?: Ref<BarangayMapHandle>;
  }
) {
  return (
    <Suspense fallback={<MapFallback />}>
      <BarangayMapImpl {...props} />
    </Suspense>
  );
}

export function PalawanMiningMap() {
  return (
    <Suspense fallback={<MapFallback />}>
      <PalawanMiningMapImpl />
    </Suspense>
  );
}

export function LandmarkMap(props: ComponentProps<typeof LandmarkMapImpl>) {
  return (
    <Suspense fallback={<MapFallback />}>
      <LandmarkMapImpl {...props} />
    </Suspense>
  );
}
