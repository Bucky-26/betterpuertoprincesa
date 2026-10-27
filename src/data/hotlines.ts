export interface Hotline {
  label: string;
  number: string;
  tel: string;
}

export interface DetailedContact {
  id: string;
  category: 'emergency' | 'police' | 'hospital' | 'utility' | 'environment';
  name: string;
  description: string;
  hotline: string;
  tel: string;
  altNumber?: string;
  location?: string;
  availableHours: string;
}

// Quick banner hotlines displayed in the Hero and Navbar ticker
export const hotlines: Hotline[] = [
  { label: '911', number: '0927 797 2009', tel: '09277972009' },
  { label: 'Police', number: '0917 311 5746', tel: '09173115746' },
  { label: 'Fire', number: '0964 945 2971', tel: '09649452971' },
  { label: 'CDRRMO', number: '0965 314 8399', tel: '09653148399' },
  { label: 'Hospital', number: '0927 133 8635', tel: '09271338635' },
];

// Comprehensive verified directory of Puerto Princesa emergency, medical, utility & law enforcement contacts
export const emergencyDirectory: DetailedContact[] = [
  {
    id: 'cdrrmo',
    category: 'emergency',
    name: 'City Disaster Risk Reduction and Management Office (CDRRMO)',
    description:
      'City emergency operations center, ambulance dispatch, flood rescue, and calamity response.',
    hotline: '0965 314 8399',
    tel: '09653148399',
    altNumber: '(048) 717-8000',
    location:
      'City Hall Complex, Barangay Irawan / San Pedro Operations Center',
    availableHours: '24/7 All Days',
  },
  {
    id: '911-national',
    category: 'emergency',
    name: 'National Emergency Hotline 911 (Palawan Dispatch)',
    description:
      'Direct emergency telephone routing for medical, fire, police, and search-and-rescue assistance.',
    hotline: '911 / 0927 797 2009',
    tel: '09277972009',
    availableHours: '24/7 All Days',
  },
  {
    id: 'bfp-central',
    category: 'emergency',
    name: 'Bureau of Fire Protection (BFP) Central Fire Station',
    description:
      'Fire suppression, hazardous material spills, vehicle extrication, and building fire safety.',
    hotline: '0964 945 2971',
    tel: '09649452971',
    altNumber: '(048) 434-2111',
    location: 'Valencia St., Barangay Tagumpay, Puerto Princesa City',
    availableHours: '24/7 All Days',
  },
  {
    id: 'pnp-station-1',
    category: 'police',
    name: 'PNP Police Station 1 (Mendoza Park / Downtown)',
    description:
      'Puerto Princesa City Police Office Station 1 — covering downtown commercial area and poblacion.',
    hotline: '0917 311 5746',
    tel: '09173115746',
    altNumber: '(048) 434-5858',
    location: 'Rizal Avenue, Barangay Model (near Mendoza Park)',
    availableHours: '24/7 All Days',
  },
  {
    id: 'pnp-station-2',
    category: 'police',
    name: 'PNP Police Station 2 (Irawan / South Corridor)',
    description:
      'Covers southern and western barangays including Irawan, Sicsican, Santa Monica, and highway checkpoints.',
    hotline: '0998 598 5849',
    tel: '09985985849',
    location: 'South National Highway, Barangay Irawan',
    availableHours: '24/7 All Days',
  },
  {
    id: 'onp-hospital',
    category: 'hospital',
    name: 'Ospital ng Palawan (ONP)',
    description:
      'Primary Level 3 DOH tertiary government referral hospital in Palawan; emergency trauma center.',
    hotline: '0927 133 8635',
    tel: '09271338635',
    altNumber: '(048) 434-2144',
    location: '220 Malvar Street, Barangay Tagumpay',
    availableHours: '24/7 Emergency Room',
  },
  {
    id: 'adventist-hospital',
    category: 'hospital',
    name: 'Adventist Hospital Palawan',
    description:
      'Private tertiary hospital with 24-hour emergency room, intensive care, and laboratory services.',
    hotline: '(048) 433-2156',
    tel: '0484332156',
    location: 'Junction 2, San Pedro, Puerto Princesa City',
    availableHours: '24/7 Emergency Room',
  },
  {
    id: 'city-health-office',
    category: 'hospital',
    name: 'City Health Office (CHO)',
    description:
      'Free outpatient consults, animal bite treatment center (anti-rabies), immunizations, and sanitary cards.',
    hotline: '(048) 717-8000',
    tel: '0487178000',
    location: 'City Government Center, Barangay Irawan',
    availableHours: 'Monday – Friday, 8:00 AM – 5:00 PM',
  },
  {
    id: 'paleco-electric',
    category: 'utility',
    name: 'PALECO (Palawan Electric Cooperative)',
    description:
      'Power outages, blown transformers, fallen electric lines, and emergency disconnection.',
    hotline: '0917 553 2836',
    tel: '09175532836',
    altNumber: '(048) 433-9144',
    location: 'KM 3.5, North National Highway, Barangay Tiniguiban',
    availableHours: '24/7 Emergency Outage Line',
  },
  {
    id: 'ppcwd-water',
    category: 'utility',
    name: 'Puerto Princesa City Water District (PPCWD)',
    description:
      'Major water pipe leaks, low pressure reports, emergency water tanker requests, and meter concerns.',
    hotline: '0917 310 8865',
    tel: '09173108865',
    altNumber: '(048) 433-2342',
    location: 'PPCWD Building, Rizal Avenue',
    availableHours: '24/7 Emergency Leak Dispatch',
  },
  {
    id: 'coast-guard-palawan',
    category: 'environment',
    name: 'Philippine Coast Guard — District Palawan',
    description:
      'Maritime search and rescue, storm gale warnings, sea vessel safety, and coastal emergencies.',
    hotline: '0929 676 0775',
    tel: '09296760775',
    altNumber: '(048) 433-2975',
    location: 'Port Area, Barangay Bagong Pag-asa',
    availableHours: '24/7 All Days',
  },
  {
    id: 'pcsd-wildlife',
    category: 'environment',
    name: 'Palawan Council for Sustainable Development (PCSD)',
    description:
      'Wildlife rescue, environmental protection alerts, illegal logging or fishing reports.',
    hotline: '0935 116 2336',
    tel: '09351162336',
    location: 'Sports Complex Road, Barangay Santa Monica',
    availableHours: 'Monday – Friday, 8:00 AM – 5:00 PM (Emergency on-call)',
  },
];
