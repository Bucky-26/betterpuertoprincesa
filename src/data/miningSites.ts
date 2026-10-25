// Known mining sites in Palawan, for public-awareness mapping only. Coordinates
// are approximate (barangay/municipality-level, not surveyed concession
// boundaries) — do not treat as cadastral data. Do not fabricate entries;
// every site must be named in an official MGB record or a cited news source.
//
// Sources:
// - MGB, "60 Operating Metallic Mines in the Philippines" (as of June 2025):
//   https://mgb.gov.ph/images/Mineral_Statistics/2025/METALLIC-OPERATING-MINES-AS-OF-JUNE-2025.pdf
// - Friends of the Earth Japan (2025): https://foejapan.org/en/issue/20250414/23643/
// - Bulatlat (2026): https://www.bulatlat.com/2026/07/29/palawan-community-resists-mining-as-brookes-point-barricade-gets-dismantled/
// - PCIJ (2021): https://pcij.org/2021/10/27/puerto-princesa-cautionary-tale-as-duterte-opens-new-mining-areas/

export interface MiningSite {
  id: string;
  name: string;
  operator?: string;
  tenement?: string;
  municipality: string;
  barangay: string;
  commodity: string;
  areaHa?: number;
  status: 'active' | 'historical';
  description: string;
  lat: number;
  lng: number;
  sourceLabel: string;
  sourceUrl: string;
}

export const miningSites: MiningSite[] = [
  {
    id: 'rio-tuba',
    name: 'Rio Tuba Nickel Mining Corporation',
    tenement: 'MPSA No. 114-98-IV',
    municipality: 'Bataraza',
    barangay: 'Rio Tuba',
    commodity: 'Nickel',
    areaHa: 4538.44,
    status: 'active',
    description:
      "The Philippines' largest lateritic nickel producer, open-pit mining since 1975. Owned by Nickel Asia Corporation.",
    lat: 8.5316,
    lng: 117.4344,
    sourceLabel: 'MGB, Operating Metallic Mines (June 2025)',
    sourceUrl:
      'https://mgb.gov.ph/images/Mineral_Statistics/2025/METALLIC-OPERATING-MINES-AS-OF-JUNE-2025.pdf',
  },
  {
    id: 'coral-bay',
    name: 'Coral Bay Nickel Corporation',
    tenement: 'HPAL processing plant',
    municipality: 'Bataraza',
    barangay: 'Rio Tuba',
    commodity: 'Nickel-cobalt (processed)',
    status: 'active',
    description:
      'Hydrometallurgical (HPAL) plant processing nickel-cobalt ore since 2005. Fifteen years of water monitoring have repeatedly found hexavalent chromium, a chemical that causes cancer, above safety limits in the nearby Togpon River during the rainy season.',
    lat: 8.529,
    lng: 117.441,
    sourceLabel: 'Friends of the Earth Japan (2025)',
    sourceUrl: 'https://foejapan.org/en/issue/20250414/23643/',
  },
  {
    id: 'ipilan',
    name: 'Ipilan Nickel Corporation',
    operator: 'Celestial Nickel Mining Exploration Corporation',
    tenement: 'MPSA No. 017-93-IV',
    municipality: "Brooke's Point",
    barangay: 'Ipilan',
    commodity: 'Nickel',
    areaHa: 2917.27,
    status: 'active',
    description:
      'Health studies have linked prolonged exposure to nickel and chromium near this mine to respiratory and skin conditions among nearby farming and fishing communities.',
    lat: 8.77,
    lng: 117.83,
    sourceLabel: 'MGB, Operating Metallic Mines (June 2025)',
    sourceUrl:
      'https://mgb.gov.ph/images/Mineral_Statistics/2025/METALLIC-OPERATING-MINES-AS-OF-JUNE-2025.pdf',
  },
  {
    id: 'infanta-calmia',
    name: 'Infanta Nickel Project',
    operator: 'CALMIA Nickel, Inc.',
    tenement: 'MPSA No. 220-2005-IVB',
    municipality: "Brooke's Point",
    barangay: "Sitio Linao (Pala'wan ancestral domain)",
    commodity: 'Nickel',
    areaHa: 1113.98,
    status: 'active',
    description:
      "Pala'wan Indigenous residents barricaded this site for nearly three months in 2026 to block mining equipment, saying the project proceeded without their free, prior, and informed consent. The barricade was dismantled by government agencies in June 2026.",
    lat: 8.79,
    lng: 117.86,
    sourceLabel: 'Bulatlat (2026)',
    sourceUrl:
      'https://www.bulatlat.com/2026/07/29/palawan-community-resists-mining-as-brookes-point-barricade-gets-dismantled/',
  },
  {
    id: 'citinickel',
    name: 'Citinickel Mines and Development Corporation',
    tenement: 'MPSA No. 229-2007-IVB',
    municipality: 'Narra & Sofronio Española',
    barangay: 'San Isidro (Narra) / Punang (Sofronio Española)',
    commodity: 'Nickel',
    areaHa: 2176,
    status: 'active',
    description:
      'Nickel mining operation spanning two municipalities in southern Palawan.',
    lat: 9.293,
    lng: 118.411,
    sourceLabel: 'MGB, Operating Metallic Mines (June 2025)',
    sourceUrl:
      'https://mgb.gov.ph/images/Mineral_Statistics/2025/METALLIC-OPERATING-MINES-AS-OF-JUNE-2025.pdf',
  },
  {
    id: 'pqmi',
    name: 'Palawan Quicksilver Mines Inc. (PQMI)',
    municipality: 'Puerto Princesa City',
    barangay: 'Santa Lourdes',
    commodity: 'Mercury (historical)',
    status: 'historical',
    description:
      "Abandoned mercury mine that operated from 1954 to 1976. In 2017, residents living near the site tested positive for mercury poisoning, with symptoms like those of Minamata disease. It is a warning inside Puerto Princesa's own city limits.",
    lat: 9.838,
    lng: 118.772,
    sourceLabel: 'PCIJ (2021)',
    sourceUrl:
      'https://pcij.org/2021/10/27/puerto-princesa-cautionary-tale-as-duterte-opens-new-mining-areas/',
  },
];
