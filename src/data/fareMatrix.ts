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
  baseFareRegular: 15.0, // First 2 kilometers
  baseFareDiscounted: 12.0, // 20% off for Student, Senior, PWD
  perKmRateRegular: 2.5, // Per additional km past 2km
  perKmRateDiscounted: 2.0, // Discounted per km
  baseDistanceKm: 2.0,
  ordinanceRef:
    'Sangguniang Panlungsod City Ordinance & MTFRB Taripa Guidelines',
  reportHotlines: [
    {
      label: 'City Traffic Management Office (CTMO)',
      number: '(048) 717-8000',
    },
    { label: 'City Police Station 1 (Downtown)', number: '0917 311 5746' },
  ],
};

export function calculateFare(
  originId: string,
  destinationId: string,
  isDiscounted: boolean
): {
  distanceKm: number;
  fare: number;
  baseFare: number;
  excessFare: number;
  isBaseOnly: boolean;
} {
  const origin = LOCATIONS.find(l => l.id === originId) ?? LOCATIONS[0];
  const dest = LOCATIONS.find(l => l.id === destinationId) ?? LOCATIONS[1];

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
    ? FARE_CONFIG.baseFareDiscounted
    : FARE_CONFIG.baseFareRegular;
  const perKm = isDiscounted
    ? FARE_CONFIG.perKmRateDiscounted
    : FARE_CONFIG.perKmRateRegular;

  if (distanceKm <= FARE_CONFIG.baseDistanceKm) {
    return {
      distanceKm,
      fare: baseFare,
      baseFare,
      excessFare: 0,
      isBaseOnly: true,
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
  };
}
