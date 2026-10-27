export interface MarketItem {
  id: string;
  name: string;
  localName: string;
  type: 'major' | 'satellite' | 'landing';
  barangay: string;
  address: string;
  coordinates: [number, number]; // [lng, lat]
  operatingHours: string;
  peakHours: string;
  description: string;
  sections: string[];
  features: string[];
  stallRentalAvailable: boolean;
  adminOffice: string;
  contactNumber?: string;
}

export const publicMarkets: MarketItem[] = [
  {
    id: 'old-market-malvar',
    name: 'Puerto Princesa City Public Market',
    localName: 'Old Market (Palengke sa Malvar)',
    type: 'major',
    barangay: 'Tagumpay (Poblacion)',
    address: 'Malvar Street, Barangay Tagumpay, Puerto Princesa City',
    coordinates: [118.7297, 9.7431],
    operatingHours: '4:00 AM – 7:00 PM Daily',
    peakHours: '5:00 AM – 8:30 AM (Morning fresh catch & wholesale produce)',
    description:
      'The historic downtown public market of Puerto Princesa, situated near the City Baywalk and Puerto Princesa Port. Renowned for its vast seafood section supplied daily by local Palawan fisherfolk, fresh meats, local vegetables, dried fish (danggit, tuyo), and native Palaweño handicrafts.',
    sections: [
      'Wet Market: Fresh Fish & Seafood (Fresh catch from Honda Bay & Sulu Sea)',
      'Meat & Poultry Section (City Veterinary Office inspected)',
      'Fresh Fruits & Vegetables (Local produce & Baguio highland goods)',
      'Dried Fish & Seafood Section (Pasil and Palawan danggit, lamayo)',
      'Carinderia & Cooked Food Stalls (Local dishes, kakanin, chaolong stalls nearby)',
      'Dry Goods, Footwear, Clothes & Hardware',
      'Native Products & Souvenirs (Handwoven baskets, pearls, handicrafts)',
    ],
    features: [
      'Prime coastal seafood arriving directly before dawn',
      'Walking distance to City Baywalk and historic plaza',
      'Accredited City Veterinary and Meat Inspection Service',
      'Active weighing scale station (Timbangan ng Bayan)',
    ],
    stallRentalAvailable: true,
    adminOffice:
      'City Economic Enterprise Department (CEED) — Market Administration Building, Malvar St.',
    contactNumber: '(048) 717-8000 (City Hall Trunkline)',
  },
  {
    id: 'new-market-san-jose',
    name: 'San Jose New Market & Commercial Center',
    localName: 'New Market (Palengke sa San Jose)',
    type: 'major',
    barangay: 'San Jose',
    address: 'North National Highway, Barangay San Jose, Puerto Princesa City',
    coordinates: [118.7562, 9.7895],
    operatingHours: '3:00 AM – 8:00 PM Daily',
    peakHours: '3:30 AM – 6:30 AM (Bagsakan & Provincial Wholesale)',
    description:
      'The premier wholesale and agricultural trading center of Puerto Princesa, strategically positioned right beside the San Jose Land Transportation Terminal (connecting buses and vans to El Nido, Taytay, Roxas, Brooke’s Point, and southern Palawan). It serves as the primary "bagsakan" hub for produce coming from farming municipalities.',
    sections: [
      'Wholesale Agricultural Bagsakan (Bulk vegetables, root crops, bananas, coconuts)',
      'Wet Market (Fish, seafood, poultry, pork, beef)',
      'Rice & Grains Depot (Palawan organic rice, commercial rice)',
      'Agricultural Supplies & Feeds',
      'Dry Goods, Apparel & School Supplies',
      'Food Terminal & Eateries (24-hour options for travelers)',
      'Terminal Services & Cargo Forwarding',
    ],
    features: [
      'Direct adjacency to the main provincial Bus & Van Terminal',
      'Wholesale bulk pricing for retail store owners and sari-sari stores',
      'Spacious loading and parking bays for delivery trucks and jeeps',
      'Official DTI and CEED price monitoring board',
    ],
    stallRentalAvailable: true,
    adminOffice:
      'CEED Satellite Administration Office, San Jose Commercial Complex',
    contactNumber: '(048) 717-8000',
  },
  {
    id: 'santa-monica-talipapa',
    name: 'Santa Monica Community Market',
    localName: 'Talipapa sa Santa Monica',
    type: 'satellite',
    barangay: 'Santa Monica',
    address: 'North National Highway corner BM Road, Barangay Santa Monica',
    coordinates: [118.7512, 9.7745],
    operatingHours: '5:00 AM – 6:30 PM Daily',
    peakHours: '6:00 AM – 8:00 AM & 4:30 PM – 6:00 PM',
    description:
      'A bustling suburban community market serving the dense residential subdivisions and neighboring barangays of Santa Monica and Sicsican. Offers convenient daily grocery essentials without traveling downtown.',
    sections: [
      'Fresh Meat & Dressed Poultry',
      'Daily Fish and Seafood Stalls',
      'Vegetables, Spices & Fruits',
      'Sari-sari provisions & Cooked breakfast/merienda items',
    ],
    features: [
      'Quick roadside tricycle access',
      'Fresh afternoon produce restock',
      'Neighborhood convenience for residential clusters',
    ],
    stallRentalAvailable: true,
    adminOffice: 'Barangay Santa Monica Hall / CEED Field Coordinator',
  },
  {
    id: 'irawan-agri-market',
    name: 'Irawan Agri-Bagsakan & Farmers Market',
    localName: 'Bagsakan sa Irawan',
    type: 'satellite',
    barangay: 'Irawan',
    address: 'South National Highway, Barangay Irawan (Near City Hall Complex)',
    coordinates: [118.6948, 9.7789],
    operatingHours: '5:00 AM – 5:00 PM Daily',
    peakHours: '6:00 AM – 9:00 AM',
    description:
      'Situated along the southern corridor near the Puerto Princesa Government Center and Agricultural Station. Serves as a direct drop-off and retail market for local farmers from rural southern barangays (Napsan, Simpocan, Inagawan) selling farm-fresh vegetables, indigenous fruits, root crops, honey, and fresh eggs directly to consumers.',
    sections: [
      'Farm-Direct Vegetables and Greens',
      'Root Crops, Bananas & Palawan Wild Honey',
      'Fresh Meat & Fish Section',
      'Local Seedlings and Ornamental Plants',
    ],
    features: [
      'Direct-from-farmer pricing',
      'Freshly harvested seasonal local produce',
      'Close to City Hall and government employees center',
    ],
    stallRentalAvailable: true,
    adminOffice:
      'City Agriculture Office / CEED Coordinator, Irawan Agri-Station',
  },
  {
    id: 'mandaragat-fish-landing',
    name: 'Mandaragat / Bagong Silang Fish Landing Market',
    localName: 'Bulungan at Bagsakan sa Mandaragat',
    type: 'landing',
    barangay: 'Mandaragat & Bagong Silang',
    address: 'Coastal Access Road, Barangay Mandaragat, Puerto Princesa City',
    coordinates: [118.7412, 9.7548],
    operatingHours: '4:30 AM – 11:30 AM Daily',
    peakHours: '5:00 AM – 7:00 AM (Immediate boat arrival)',
    description:
      'An artisanal morning coastal fish landing where small-scale municipal fisherfolk bring their catch directly ashore from overnight fishing in Puerto Princesa Bay. Renowned among locals for ultra-fresh fish, squid, crabs, and shellfish at fishermen-direct prices before distribution to retail markets.',
    sections: [
      'Fresh Daily Marine Catch (Lapu-lapu, Kitang, Bisugo, Tuna, Maya-maya)',
      'Squid, Crabs, and Seasonal Shellfish',
      'Wholesale tub ("banyera") sales for re-sellers',
    ],
    features: [
      'Direct boat-to-shore fresh transactions',
      'Best early-morning seafood prices in the city',
      'Supports local municipal small-boat fisherfolk families',
    ],
    stallRentalAvailable: false,
    adminOffice:
      'City Agriculture & Fisheries Office (Fisheries Section) / Barangay Mandaragat',
  },
];

export const stallRentalGuidelines = {
  office:
    'City Economic Enterprise Department (CEED) - Public Markets Division',
  location:
    'CEED Building, Puerto Princesa City Hall Complex & Old Market Admin Office',
  onlinePaymentUrl: 'https://www.filipizen.com/partners/palawan_puertoprincesa',
  onlinePaymentService: 'Market Rental',
  requirements: [
    'Duly accomplished Market Stall Application Form (available at CEED office)',
    'Community Tax Certificate (Cedula) for the current year',
    'Barangay Clearance for business purpose from the applicant’s barangay of residence',
    'Two (2) valid government-issued IDs and 2x2 ID photos',
    'City Health Certificate / Sanitary Permit (Green Card) issued by City Health Office',
    'Contract of Lease issued by the City Mayor upon approval',
  ],
  rules: [
    'Subleasing or renting out allocated stalls to third parties without CEED written approval is strictly prohibited.',
    'Stallholders must maintain clean, sanitary stalls and follow the city solid waste segregation ordinance.',
    'All weighing scales must be calibrated and inspected regularly with the official City Treasurer seal.',
    'Rental payments are due monthly and can be paid on-site or via Filipizen (Market Rental portal).',
  ],
};
