import type { UtilityAdvisory } from '../types/utilityAdvisory';

type UtilityAdvisoriesResponse = {
  advisories: UtilityAdvisory[];
  palecoCount: number;
  ppcwdCount: number;
  totalCount: number;
  lastUpdated: string;
  isLive: boolean;
};

export async function fetchLiveUtilityAdvisories(): Promise<UtilityAdvisoriesResponse> {
  const response = await fetch('/api/advisories', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Advisories API HTTP ${response.status}`);
  }

  const payload: unknown = await response.json();
  if (!payload || typeof payload !== 'object') {
    throw new Error('Advisories API returned invalid payload');
  }

  const data = payload as UtilityAdvisoriesResponse;
  return {
    advisories: Array.isArray(data.advisories) ? data.advisories : [],
    palecoCount: data.palecoCount ?? 0,
    ppcwdCount: data.ppcwdCount ?? 0,
    totalCount: data.totalCount ?? 0,
    lastUpdated: data.lastUpdated ?? new Date().toISOString(),
    isLive: Boolean(data.isLive),
  };
}
