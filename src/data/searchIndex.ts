export interface SearchItem {
  id: string;
  title: string;
  category:
    | 'Service'
    | 'Market'
    | 'Hotline'
    | 'Transparency'
    | 'Government'
    | 'Tool'
    | 'Landmark';
  description: string;
  url: string;
  keywords: string[];
}

export const searchIndex: SearchItem[] = [
  // Public Markets
  {
    id: 'market-old-malvar',
    title: 'Puerto Princesa City Public Market (Old Market / Malvar)',
    category: 'Market',
    description:
      'Central downtown public market for fresh seafood, meats, fruits, vegetables, and native goods.',
    url: '/markets#old-market-malvar',
    keywords: [
      'palengke',
      'malvar',
      'old market',
      'isda',
      'fresh fish',
      'seafood',
      'downtown',
      'stall',
      'talipapa',
    ],
  },
  {
    id: 'market-new-san-jose',
    title: 'San Jose New Market & Commercial Center',
    category: 'Market',
    description:
      'Premier wholesale agricultural bagsakan and retail market adjacent to San Jose Transport Terminal.',
    url: '/markets#new-market-san-jose',
    keywords: [
      'palengke',
      'san jose',
      'new market',
      'bagsakan',
      'terminal',
      'gulay',
      'wholesale',
      'bigas',
    ],
  },
  {
    id: 'market-santa-monica',
    title: 'Santa Monica Community Market (Talipapa)',
    category: 'Market',
    description:
      'Suburban fresh market serving Santa Monica, BM Road, and Sicsican residents.',
    url: '/markets#santa-monica-talipapa',
    keywords: [
      'palengke',
      'santa monica',
      'talipapa',
      'bm road',
      'fresh goods',
    ],
  },
  {
    id: 'market-irawan',
    title: 'Irawan Agri-Bagsakan & Farmers Market',
    category: 'Market',
    description:
      'Direct-from-farmer fresh produce, root crops, honey, and vegetables near City Hall.',
    url: '/markets#irawan-agri-market',
    keywords: [
      'palengke',
      'irawan',
      'bagsakan',
      'farmers',
      'gulay',
      'honey',
      'city hall',
    ],
  },
  {
    id: 'market-mandaragat',
    title: 'Mandaragat / Bagong Silang Fish Landing Market',
    category: 'Market',
    description:
      'Early morning coastal fish landing where municipal fisherfolk sell directly off fishing boats.',
    url: '/markets#mandaragat-fish-landing',
    keywords: [
      'palengke',
      'mandaragat',
      'fish landing',
      'bulungan',
      'seafood',
      'banca',
      'isda',
    ],
  },
  {
    id: 'market-stall-rental',
    title: 'Public Market Stall Rental & CEED Lease Application',
    category: 'Market',
    description:
      'How to apply for a market stall, requirements, and monthly payment through Filipizen.',
    url: '/markets#stall-guidelines',
    keywords: [
      'rent stall',
      'palengke pwesto',
      'ceed',
      'filipizen',
      'lease',
      'market rental',
    ],
  },

  // Interactive Tools
  {
    id: 'tool-fare-calculator',
    title: 'Tricycle Fare Calculator & Route Matrix',
    category: 'Tool',
    description:
      'Official City Ordinance-based tricycle tariff calculator with 20% discount support and CTMO reporting guidelines.',
    url: '/fare-calculator',
    keywords: [
      'taripa',
      'fare',
      'pamasahe',
      'tricycle',
      'trike',
      'ordinance',
      'ctmo',
      'discount',
      'student discount',
      'pwd',
    ],
  },
  {
    id: 'tool-hotlines-directory',
    title: 'Emergency, Hospital & Utilities Directory',
    category: 'Hotline',
    description:
      'Complete verified directory with 1-tap calling for CDRRMO, Police, Fire, ONP, PALECO, and PPCWD.',
    url: '/hotlines',
    keywords: [
      'emergency',
      'hotline',
      'sakuna',
      'sunog',
      'pulis',
      'hospital',
      'onp',
      'paleco',
      'brownout',
      'kuryente',
      'tubig',
      'ppcwd',
    ],
  },

  // Key Services
  {
    id: 'service-business-permits',
    title: 'Apply for Barangay Clearance and Mayor’s Business Permits',
    category: 'Service',
    description:
      'Step-by-step process for registering a new business or renewing permits in Puerto Princesa.',
    url: '/services/business/apply-for-barangay-clearance-and-mayors-business-permits',
    keywords: [
      'business permit',
      'mayor permit',
      'bplo',
      'clearance',
      'negosyo',
      'dti',
      'sec',
      'bir',
    ],
  },
  {
    id: 'service-renew-business-tax',
    title: 'Renew Permits and Pay Local Business Taxes',
    category: 'Service',
    description:
      'Annual business tax assessment, early payment discounts, and online payment via Filipizen.',
    url: '/services/business/renew-permits-and-pay-local-business-taxes',
    keywords: [
      'renew business',
      'business tax',
      'filipizen',
      'buwis',
      'cedula',
      'amendment',
    ],
  },
  {
    id: 'service-tricycle-franchise',
    title: 'Apply or Renew Motorized Tricycle Franchise (MTOP)',
    category: 'Service',
    description:
      'Motorized Tricycle Operators Permit (MTOP) issuance, renewal, and franchise guidelines under the MTFRB.',
    url: '/services/business/apply-or-renew-motorized-tricycle-franchise-mtop',
    keywords: [
      'tricycle franchise',
      'mtop',
      'mtfrb',
      'prangkisa',
      'trike permit',
      'body number',
      'ctmo',
    ],
  },
  {
    id: 'service-sanitary-health-card',
    title: 'Get Sanitary Permit and City Health Card (Green Card)',
    category: 'Service',
    description:
      'City Health Office requirements for food handlers, service workers, medical tests, and annual sanitary clearance.',
    url: '/services/health-services/get-sanitary-permit-and-city-health-card',
    keywords: [
      'health card',
      'green card',
      'sanitary permit',
      'city health office',
      'stool exam',
      'xray',
      'food handler',
    ],
  },
  {
    id: 'service-free-checkups',
    title: 'Get Free Check-ups, Basic Medicines, and Vaccines',
    category: 'Service',
    description:
      'Where to visit City Health satellite stations and barangay health centers for free consultation and medicines.',
    url: '/services/health-services/get-free-check-ups-basic-medicines-and-vaccines',
    keywords: [
      'checkup',
      'gamot',
      'bakuna',
      'health center',
      'libre',
      'konsulta',
      'doktor',
    ],
  },
  {
    id: 'service-maternal-child',
    title: 'Access Maternal Care and Child Immunization',
    category: 'Service',
    description:
      'Prenatal check-ups, infant vaccines, nutrition assistance, and birthing clinic locations.',
    url: '/services/health-services/access-maternal-care-and-child-immunization',
    keywords: [
      'buntis',
      'bakuna sanggol',
      'prenatal',
      'immunization',
      'nutrition',
      'nanay',
    ],
  },
  {
    id: 'service-hospital-confinement',
    title: 'Go to Local Hospital for Treatment or Confinement',
    category: 'Service',
    description:
      'Admission, emergency room, and Malasakit Center medical subsidy guidelines at Ospital ng Palawan.',
    url: '/services/health-services/go-to-the-local-hospital-for-treatment-or-confinement',
    keywords: [
      'ospital',
      'hospital',
      'onp',
      'malasakit center',
      'emergency room',
      'admit',
    ],
  },
  {
    id: 'service-civil-birth',
    title: 'Register a Birth Certificate (Civil Registry)',
    category: 'Service',
    description:
      'Timely vs. late registration of birth certificates at the Puerto Princesa City Civil Registrar Office.',
    url: '/services/civil-registry/register-birth-certificate',
    keywords: [
      'birth certificate',
      'kapanganakan',
      'civil registrar',
      'rehistro',
      'psa',
      'late registration',
    ],
  },
  {
    id: 'service-civil-marriage',
    title: 'Apply for Marriage License & Pre-Marriage Orientation',
    category: 'Service',
    description:
      'Requirements, CENOMAR, family planning seminar, and 10-day notice for marriage licenses in Puerto Princesa.',
    url: '/services/civil-registry/apply-for-marriage-license',
    keywords: [
      'kasal',
      'marriage license',
      'cenomar',
      'civil wedding',
      'cho seminar',
      'pre-marriage',
    ],
  },
  {
    id: 'service-civil-death',
    title: 'Register Death Certificate & Certified Records',
    category: 'Service',
    description:
      'Death reporting, burial permits, and securing certified true copies of city civil registry documents.',
    url: '/services/civil-registry/request-certified-copies-and-death-certificates',
    keywords: [
      'death certificate',
      'libing',
      'burial permit',
      'certified copy',
      'civil registry',
    ],
  },
  {
    id: 'service-senior-pwd-solo',
    title: 'Apply for Senior Citizen, Solo Parent, or PWD Assistance',
    category: 'Service',
    description:
      'ID application requirements, local welfare stipends, and discount cards through CSWDO.',
    url: '/services/social-welfare/apply-for-senior-citizen-solo-parent-or-pwd-assistance',
    keywords: [
      'senior citizen',
      'pwd',
      'solo parent',
      'ra 11861',
      'cswdo',
      'ayuda',
      'diskwento',
    ],
  },
  {
    id: 'service-scholarships',
    title: 'Apply for Local City Scholarships',
    category: 'Service',
    description:
      'Educational assistance and college scholarship grants for Puerto Princesa students.',
    url: '/services/education/apply-for-local-scholarships',
    keywords: [
      'scholarship',
      'iskolar',
      'edukasyon',
      'college',
      'tuition',
      'estudyante',
    ],
  },
  {
    id: 'service-zoning-building',
    title: 'Request Zoning, Land Use, or Building Permits',
    category: 'Service',
    description:
      'City Engineering and Zoning Office requirements for constructing homes or commercial structures.',
    url: '/services/housing-land-use/request-zoning-land-use-or-building-permits',
    keywords: [
      'building permit',
      'zoning',
      'locational clearance',
      'engineering',
      'bahay',
      'patayo',
    ],
  },
  {
    id: 'service-traffic-violations',
    title: 'Settle Traffic Violations & Citations (CTMO)',
    category: 'Service',
    description:
      'How to pay traffic citation tickets, contest unjust apprehension, and impound release procedures.',
    url: '/services/infrastructure-public-works/settle-traffic-violation-or-contest-citation',
    keywords: [
      'traffic violation',
      'ticket',
      'ctmo',
      'huli',
      'tubos motor',
      'impound',
      'citation',
    ],
  },

  // Transparency & Data
  {
    id: 'transparency-budget',
    title: 'Budget Transparency & National Tax Allotment',
    category: 'Transparency',
    description:
      'Puerto Princesa FY2026 budget allocations, 10-year budget history, and official Full Disclosure reports.',
    url: '/transparency',
    keywords: [
      'budget',
      'transparency',
      'pera ng bayan',
      'nta',
      'disaster fund',
      'appropriations',
      'gao',
    ],
  },
  {
    id: 'transparency-dpwh',
    title: 'DPWH Infrastructure Projects Tracker',
    category: 'Transparency',
    description:
      'Tracking flood control, roads, bridges, and public facility construction projects in Puerto Princesa.',
    url: '/transparency#dpwh-projects',
    keywords: [
      'dpwh',
      'flood control',
      'kalsada',
      'tulay',
      'drainage',
      'projects',
      'kontrata',
    ],
  },
  {
    id: 'transparency-mining',
    title: 'Palawan Mining Watch & Forest Loss',
    category: 'Transparency',
    description:
      'Interactive map of mining concessions, 2025 moratorium analysis, tree cover loss data, and investigations.',
    url: '/mining-watch',
    keywords: [
      'mining',
      'nickel',
      'mina',
      'palawan mining',
      'moratorium',
      'forest loss',
      'bataraza',
      'rio tuba',
    ],
  },
  {
    id: 'statistics-demographics',
    title: 'City Statistics & 66-Barangay Population Map',
    category: 'Transparency',
    description:
      '2024 PSA Census population (316,384), land area, DTI CMCI competitiveness rankings, and interactive map.',
    url: '/statistics',
    keywords: [
      'populasyon',
      'population',
      'statistics',
      'barangay',
      'cmci',
      'census',
      'psa',
    ],
  },

  // Landmark & Government
  {
    id: 'landmark-prinsesa',
    title: 'Ang Prinsesa ng Baybay Landmark',
    category: 'Landmark',
    description:
      'The story, Tagbanua cultural heritage, trivia, and location of the statue at the Puerto Princesa Baywalk.',
    url: '/prinsesa-ng-baybay',
    keywords: [
      'prinsesa ng baybay',
      'baywalk',
      'statue',
      'monument',
      'tagbanua',
      'tourist',
      'kasaysayan',
    ],
  },
  {
    id: 'gov-executive',
    title: 'City Mayor and Executive Department',
    category: 'Government',
    description:
      'Office of the City Mayor Lucilo R. Bayron, executive initiatives, and community assistance programs.',
    url: '/government/departments/executive',
    keywords: ['mayor', 'lucilo bayron', 'city hall', 'executive', 'alkalde'],
  },
  {
    id: 'gov-legislative',
    title: 'Sangguniang Panlungsod (City Council)',
    category: 'Government',
    description:
      'City legislative councilors, Vice Mayor presiding officer, ordinances, and public session details.',
    url: '/government/departments/legislative',
    keywords: [
      'city council',
      'sangguniang panlungsod',
      'vice mayor',
      'councilor',
      'ordinansa',
    ],
  },
  {
    id: 'tool-minimum-wage',
    title: 'Current Minimum Wage in Puerto Princesa & Palawan (₱455/day)',
    category: 'Tool',
    description:
      'Official DOLE MIMAROPA Wage Order No. RB-MIMAROPA-13 rates (₱455.00/day private sector, ₱7,000.00/month domestic workers), overtime calculator, and labor rights.',
    url: '/minimum-wage',
    keywords: [
      'minimum wage',
      'sahod',
      'sweldo',
      'salary',
      'dole',
      'mimaropa',
      'wage order',
      'rb-mimaropa-13',
      'kasambahay',
      'domestic worker',
      'overtime calculator',
      'labor code',
      '13th month pay',
      'holiday pay',
      'night differential',
      'worker rights',
      'senA',
    ],
  },
  {
    id: 'service-utility-advisories',
    title: 'PALECO & PPCWD Utility Advisories & Outages Tracker',
    category: 'Service',
    description:
      'Real-time automated bulletin tracking PALECO power service advisories, unscheduled blackouts, PPCWD water interruptions, and feeder maintenance.',
    url: '/advisories',
    keywords: [
      'paleco',
      'ppcwd',
      'brownout',
      'blackout',
      'power outage',
      'water interruption',
      'water cut',
      'advisory',
      'feeder',
      'kuryente',
      'tubig',
      'electric cooperative',
      'water district',
      'scheduled interruption',
    ],
  },
  {
    id: 'service-paleco-outages',
    title: 'PALECO Power Advisories & Outage Schedule',
    category: 'Service',
    description:
      'Live power service bulletins, restored feeders, transformer repairs, and scheduled line maintenance from Palawan Electric Cooperative.',
    url: '/advisories',
    keywords: [
      'paleco',
      'brownout schedule',
      'power outage',
      'kuryente',
      'blackout',
      'feeder 1',
      'feeder 2',
      'feeder 3',
      'recloser',
      'line clearing',
      'warriors of light',
    ],
  },
  {
    id: 'service-ppcwd-water-advisories',
    title: 'PPCWD Water Advisories & Pipeline Interruptions',
    category: 'Service',
    description:
      'Water supply alerts, low pressure announcements, transmission line maintenance, and water quality testing from Puerto Princesa City Water District.',
    url: '/advisories',
    keywords: [
      'ppcwd',
      'tubig',
      'water interruption',
      'low pressure',
      'water leak',
      'water district',
      'transmission line',
      'montible',
      'maoyon',
      'water tank',
    ],
  },
];
