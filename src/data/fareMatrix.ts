export interface LocationPoint {
  id: string;
  name: string;
  zone:
    | 'Downtown / Poblacion'
    | 'Commercial & Transit'
    | 'North Corridor'
    | 'South Corridor';
  distanceFromCenterKm: number; // reference point: Rizal Park / Mendoza Park (Km 0)
  popularLandmarks: string[];
}

export interface FuelBracket {
  id: string;
  label: string;
  gasolinePriceRange: string;
  baseFareRegular: number; // First 2.0 km
  baseFareDiscounted: number; // 20% statutory discount
  perKmRateRegular: number; // Succeeding km
  perKmRateDiscounted: number;
  description: string;
  isDefault?: boolean;
}

export const FUEL_BRACKETS: FuelBracket[] = [
  {
    id: 'bracket-50-59',
    label: '₱50 – ₱59.99 / L',
    gasolinePriceRange: '₱50.00 – ₱59.99',
    baseFareRegular: 12.0,
    baseFareDiscounted: 9.6,
    perKmRateRegular: 2.0,
    perKmRateDiscounted: 1.6,
    description: 'Baseline tariff tier under City Ordinance No. 1129.',
  },
  {
    id: 'bracket-60-69',
    label: '₱60 – ₱69.99 / L',
    gasolinePriceRange: '₱60.00 – ₱69.99',
    baseFareRegular: 14.0,
    baseFareDiscounted: 11.2,
    perKmRateRegular: 2.25,
    perKmRateDiscounted: 1.8,
    description:
      'Second tier (+₱2.00 adjustment for gasoline at ₱60–₱69.99/L).',
  },
  {
    id: 'bracket-70-79',
    label: '₱70 – ₱79.99 / L',
    gasolinePriceRange: '₱70.00 – ₱79.99',
    baseFareRegular: 15.0,
    baseFareDiscounted: 12.0,
    perKmRateRegular: 2.5,
    perKmRateDiscounted: 2.0,
    description:
      'Prevailing Puerto Princesa retail pump tier (Standard ₱15 base / ₱2.50 per excess km).',
    isDefault: true,
  },
  {
    id: 'bracket-80-89',
    label: '₱80 – ₱89.99 / L',
    gasolinePriceRange: '₱80.00 – ₱89.99',
    baseFareRegular: 17.0,
    baseFareDiscounted: 13.6,
    perKmRateRegular: 2.75,
    perKmRateDiscounted: 2.2,
    description: 'High fuel tier activated if gasoline surpasses ₱80/L.',
  },
];

export const LOCATIONS: LocationPoint[] = [
  {
    id: 'poblacion-center',
    name: 'Mendoza Park / Rizal Avenue (City Center)',
    zone: 'Downtown / Poblacion',
    distanceFromCenterKm: 0.0,
    popularLandmarks: [
      'Mendoza Park',
      'Palawan Heritage Center',
      'Old City Hall',
      'Cathedral',
    ],
  },
  {
    id: 'baywalk-port',
    name: 'Puerto Princesa Port & Baywalk',
    zone: 'Downtown / Poblacion',
    distanceFromCenterKm: 1.4,
    popularLandmarks: [
      'Port of Puerto Princesa',
      'Baywalk',
      'Prinsesa ng Baybay statue',
      'Old Market (Malvar)',
    ],
  },
  {
    id: 'capitol-complex',
    name: 'Palawan Provincial Capitol & Rizal Ave Ext.',
    zone: 'Downtown / Poblacion',
    distanceFromCenterKm: 1.2,
    popularLandmarks: [
      'Provincial Capitol Building',
      'Legislative Building',
      'Palawan Museum',
    ],
  },
  {
    id: 'airport',
    name: 'Puerto Princesa International Airport',
    zone: 'Downtown / Poblacion',
    distanceFromCenterKm: 2.3,
    popularLandmarks: [
      'Passenger Terminal',
      'Airport Junction',
      'Rizal Ave East',
    ],
  },
  {
    id: 'sm-puerto',
    name: 'SM City Puerto Princesa (Malvar)',
    zone: 'Downtown / Poblacion',
    distanceFromCenterKm: 0.9,
    popularLandmarks: [
      'SM City',
      'National Highway Junction',
      'San Pedro border',
    ],
  },
  {
    id: 'san-pedro-junction',
    name: 'Barangay San Pedro / City Coliseum',
    zone: 'Commercial & Transit',
    distanceFromCenterKm: 3.5,
    popularLandmarks: [
      'City Coliseum Sports Complex',
      'San Pedro National High School',
    ],
  },
  {
    id: 'robinsons-palawan',
    name: 'Robinsons Place Palawan (San Manuel)',
    zone: 'Commercial & Transit',
    distanceFromCenterKm: 5.2,
    popularLandmarks: [
      'Robinsons Mall',
      'PSA CRS Outlet',
      'San Manuel Commercial Strip',
    ],
  },
  {
    id: 'san-jose-terminal',
    name: 'San Jose Land Transportation Terminal & New Market',
    zone: 'Commercial & Transit',
    distanceFromCenterKm: 6.8,
    popularLandmarks: [
      'San Jose New Market',
      'Provincial Bus & Van Terminal',
      'Bagsakan',
    ],
  },
  {
    id: 'city-hall-irawan',
    name: 'New City Hall Government Center (Sta. Monica / Irawan)',
    zone: 'South Corridor',
    distanceFromCenterKm: 7.2,
    popularLandmarks: [
      'City Government Center',
      'Executive Building',
      'Legislative Hall',
    ],
  },
  {
    id: 'sta-monica-bakers',
    name: 'Santa Monica (Baker’s Hill / Mitra Junction)',
    zone: 'North Corridor',
    distanceFromCenterKm: 8.5,
    popularLandmarks: [
      'Santa Monica Market',
      'Baker’s Hill entry',
      'Mitra’s Ranch road',
    ],
  },
  {
    id: 'sicsican',
    name: 'Barangay Sicsican Proper',
    zone: 'North Corridor',
    distanceFromCenterKm: 10.8,
    popularLandmarks: [
      'Sicsican Bridge',
      'Sicsican National High School',
      'F. Ponce de Leon',
    ],
  },
  {
    id: 'irawan-proper',
    name: 'Barangay Irawan (Agri-Center & Hospital)',
    zone: 'South Corridor',
    distanceFromCenterKm: 11.5,
    popularLandmarks: [
      'Irawan Agri-Bagsakan',
      'Palawan Flora & Fauna',
      'Ospital ng Palawan (Irawan Annex)',
    ],
  },
  {
    id: 'honda-bay-sta-lourdes',
    name: 'Honda Bay Wharf (Santa Lourdes)',
    zone: 'North Corridor',
    distanceFromCenterKm: 14.5,
    popularLandmarks: [
      'Honda Bay Island Hopping Wharf',
      'Sta. Lourdes Highway',
    ],
  },
];

export const FARE_CONFIG = {
  baseDistanceKm: 2.0,
  defaultBracketId: 'bracket-70-79',
  legalBasis: {
    ordinanceNumber: 'City Ordinance No. 1129',
    title: 'The New Tricycle Fare Ordinance of Puerto Princesa City of 2021',
    authorizingBody:
      'Sangguniang Panlungsod ng Puerto Princesa & City Tricycle Franchising and Regulatory Board (CTFRB)',
    stakeholders:
      'Federation of Tricycle Operators and Drivers Association of Puerto Princesa City (FTODA)',
    formulaRule:
      'Automatic Fuel Bracket System: The minimum fare automatically increases or decreases by ₱2.00 for every ₱10.00 movement in the prevailing retail pump price of gasoline per liter in Puerto Princesa City.',
    sourceUrl:
      'https://palawan-news.com/city-council-approves-ordinance-fixing-minimum-tricycle-fare/',
    sourceName: 'Palawan News & Sangguniang Panlungsod Records',
  },
  discountRules: [
    {
      group: 'Students',
      law: 'Republic Act No. 11314 (Student Fare Discount Act)',
      percentage: '20% off regular fare',
      validity: 'Year-round including weekends, semester breaks, and holidays',
    },
    {
      group: 'Senior Citizens',
      law: 'Republic Act No. 9994 (Expanded Senior Citizens Act)',
      percentage: '20% off regular fare',
      validity: 'Year-round upon presentation of Senior Citizen / OSCA ID',
    },
    {
      group: 'Persons with Disabilities (PWD)',
      law: 'Republic Act No. 10754',
      percentage: '20% off regular fare',
      validity: 'Year-round upon presentation of PWD ID',
    },
  ],
  reportHotlines: [
    {
      label: 'City Traffic Management Office (CTMO)',
      number: '(048) 717-8000',
    },
    {
      label: 'City Police Station 1 (Downtown / Mendoza Park)',
      number: '0917 311 5746',
    },
    {
      label: 'City Mayor’s Information / Action Center',
      number: '(048) 434-2222',
    },
  ],
};

export function calculateFare(
  originId: string,
  destinationId: string,
  isDiscounted: boolean,
  bracketId: string = 'bracket-70-79'
): {
  distanceKm: number;
  fare: number;
  baseFare: number;
  excessFare: number;
  isBaseOnly: boolean;
  bracket: FuelBracket;
} {
  const origin = LOCATIONS.find(l => l.id === originId) ?? LOCATIONS[0];
  const dest = LOCATIONS.find(l => l.id === destinationId) ?? LOCATIONS[1];
  const bracket =
    FUEL_BRACKETS.find(b => b.id === bracketId) ??
    FUEL_BRACKETS.find(b => b.isDefault) ??
    FUEL_BRACKETS[0];

  // Approximate point-to-point road distance via downtown spine
  const distanceKm = Math.max(
    0.8,
    Math.round(
      Math.abs(origin.distanceFromCenterKm - dest.distanceFromCenterKm) *
        1.25 *
        10
    ) / 10
  );

  const baseFare = isDiscounted
    ? bracket.baseFareDiscounted
    : bracket.baseFareRegular;
  const perKm = isDiscounted
    ? bracket.perKmRateDiscounted
    : bracket.perKmRateRegular;

  if (distanceKm <= FARE_CONFIG.baseDistanceKm) {
    return {
      distanceKm,
      fare: baseFare,
      baseFare,
      excessFare: 0,
      isBaseOnly: true,
      bracket,
    };
  }

  const excessDistance = distanceKm - FARE_CONFIG.baseDistanceKm;
  const excessFare = Math.round(excessDistance * perKm * 2) / 2; // round to nearest 50 centavos
  const totalFare = Math.ceil(baseFare + excessFare);

  return {
    distanceKm,
    fare: totalFare,
    baseFare,
    excessFare,
    isBaseOnly: false,
    bracket,
  };
}
