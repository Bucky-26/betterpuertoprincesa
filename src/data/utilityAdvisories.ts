import rawData from './utilityAdvisories.json';
import type {
  UtilityAdvisory,
  UtilityAdvisoriesData,
  UtilitySource,
} from '../types/utilityAdvisory';

export const utilityData: UtilityAdvisoriesData =
  rawData as UtilityAdvisoriesData;

export const utilityAdvisories: UtilityAdvisory[] = utilityData.advisories;
export const utilityMetadata = utilityData.metadata;

/**
 * Filter advisories by utility provider (PALECO vs PPCWD)
 */
export function getAdvisoriesBySource(
  source: UtilitySource
): UtilityAdvisory[] {
  return utilityAdvisories.filter(advisory => advisory.source === source);
}

/**
 * Filter advisories affecting a specific barangay
 */
export function getAdvisoriesByBarangay(barangay: string): UtilityAdvisory[] {
  const query = barangay.toLowerCase();
  return utilityAdvisories.filter(advisory =>
    advisory.affectedAreas.some(area => area.toLowerCase().includes(query))
  );
}

/**
 * Get active/ongoing urgent outage announcements
 */
export function getUrgentAdvisories(): UtilityAdvisory[] {
  return utilityAdvisories.filter(advisory => advisory.isUrgent);
}

/**
 * Get unique list of all barangays and local zones affected across all advisories
 */
export function getAllAffectedZones(): string[] {
  const zones = new Set<string>();
  for (const advisory of utilityAdvisories) {
    for (const area of advisory.affectedAreas) {
      zones.add(area);
    }
  }
  return Array.from(zones).sort();
}
