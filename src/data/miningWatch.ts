// Curated for public awareness from independent journalism, NGO reporting,
// and international human-rights organizations — not an official position
// of the City Government of Puerto Princesa. Do not fabricate entries; every
// item must link to a real, dated, independently verifiable source.

export interface MiningNewsItem {
  id: string;
  title: string;
  outlet: string;
  date: string;
  tag: string;
  summary: string;
  url: string;
}

export const miningNews: MiningNewsItem[] = [
  {
    id: 'brookes-point-barricade-dismantled',
    title:
      "Pala'wan Community Resists Mining as Brooke's Point Barricade Gets Dismantled",
    outlet: 'Bulatlat',
    date: '2026-07-29',
    tag: "Indigenous Peoples' Rights",
    summary:
      "Pala'wan Indigenous residents of Sitio Linao maintained a barricade for nearly three months to block heavy equipment from entering their ancestral domain, before it was dismantled on June 29 to let CALMIA Nickel, Inc.'s Infanta Nickel Project proceed. Rights groups say the project moved forward without the community's free, prior, and informed consent.",
    url: 'https://www.bulatlat.com/2026/07/29/palawan-community-resists-mining-as-brookes-point-barricade-gets-dismantled/',
  },
  {
    id: 'critical-minerals-boom-losing-ground',
    title:
      'Extracting Value, Losing Ground: The Critical Minerals Boom in Palawan',
    outlet: 'New Mandala',
    date: '2025-06-13',
    tag: 'Analysis',
    summary:
      'Even with the 2025 moratorium in place, 11 existing mining companies remain grandfathered into operation, continuing to threaten Indigenous ancestral domains and biodiversity hotspots like Mt. Mantalingahan. The authors trace how mining for the global green-energy transition has been linked to roughly a third of all killings of environmental and human-rights defenders in the Philippines.',
    url: 'https://www.newmandala.org/extracting-value-losing-ground-the-critical-minerals-boom-in-palawan/',
  },
  {
    id: 'last-ecological-frontier-nickel-demand',
    title: "Philippines' 'Last Ecological Frontier' Battles Demand for Nickel",
    outlet: 'Context, Thomson Reuters Foundation',
    date: '2025-07-30',
    tag: 'Environment',
    summary:
      "Palawan holds nearly half the Philippines' old-growth forest, 30% of its mangroves, and 40% of its coral reefs. Environmental groups and local bishops value these ecosystems at roughly $5 billion, which they argue is worth more than mining profits. Global nickel demand for EV batteries is expected to rise 65% by 2030, keeping pressure on the province even after its new moratorium.",
    url: 'https://www.context.news/nature/philippines-last-ecological-frontier-battles-demand-for-nickel',
  },
  {
    id: 'foe-japan-chromium-petition',
    title:
      'Civil Society Groups Urge Sumitomo to Suspend Nickel Operations Over Water Pollution',
    outlet: 'Friends of the Earth Japan',
    date: '2025-04-14',
    tag: 'Health',
    summary:
      '86 civil society organizations asked Sumitomo Metal Mining to suspend nickel mining and processing near Rio Tuba. Fifteen years of water monitoring found hexavalent chromium, a chemical that causes cancer, repeatedly above safety limits in the Togpon River during the rainy season. September 2024 had the highest levels yet.',
    url: 'https://foejapan.org/en/issue/20250414/23643/',
  },
  {
    id: 'palawan-50-year-moratorium',
    title: 'Palawan Approves Ban of New Mining Operations for 50 Years',
    outlet: 'GMA News',
    date: '2025-03-07',
    tag: 'Policy',
    summary:
      'The Palawan provincial government signed Ordinance No. 3646, an extendible 50-year moratorium barring barangays and municipalities from endorsing new large- or small-scale mining applications. Existing operations are unaffected, and the Palawan Council for Sustainable Development can still grant clearances that environmental groups warn could become a loophole.',
    url: 'https://www.gmanetwork.com/news/topstories/regions/938505/palawan-approves-ban-of-new-mining-operations-for-50-years/story/',
  },
  {
    id: 'amnesty-nickel-mining-consultation',
    title:
      'Nickel Mining Projects Approved Despite Inadequate Consultation and Serious Risks',
    outlet: 'Amnesty International',
    date: '2025-01-09',
    tag: 'Human Rights',
    summary:
      'Amnesty International documented how nickel mining projects in Zambales and Palawan were approved without adequate consultation of Indigenous Peoples and rural communities, despite evidence of deforestation, heavy-metal contamination, and respiratory illness. Much of the nickel extracted enters electric-vehicle battery supply chains.',
    url: 'https://www.amnesty.org/en/latest/news/2025/01/philippines-nickel-mining-projects-approved-despite-inadequate-consultation-and-serious-risks-to-communities-health-and-environment/',
  },
  {
    id: 'mantalingahan-writ-of-kalikasan',
    title:
      'Indigenous Community Fighting a Mine in Palawan Wins a Milestone Legal Verdict',
    outlet: 'Mongabay',
    date: '2023-09-25',
    tag: "Indigenous Peoples' Rights",
    summary:
      "The Philippine Supreme Court issued a writ of kalikasan, a rare legal remedy for environmental harm. It requires mining companies and government agencies to answer Pala'wan community complaints about operations in the Mount Mantalingahan Protected Landscape. Separately, the National Commission on Indigenous Peoples ordered the miners to stop work until they could prove the community agreed.",
    url: 'https://news.mongabay.com/2023/09/indigenous-community-fighting-a-mine-in-palawan-win-a-milestone-legal-verdict/',
  },
  {
    id: 'puerto-princesa-pqmi-cautionary-tale',
    title:
      'Puerto Princesa Is a Cautionary Tale as Duterte Opens New Mining Areas',
    outlet: 'PCIJ',
    date: '2021-10-27',
    tag: 'History',
    summary:
      'In 2017, residents living near the abandoned Palawan Quicksilver Mines Inc. site, inside Puerto Princesa and closed since 1976, tested positive for mercury poisoning, with symptoms like those of Minamata disease. The article presents the site as a warning as national policy reopens areas to new mining.',
    url: 'https://pcij.org/2021/10/27/puerto-princesa-cautionary-tale-as-duterte-opens-new-mining-areas/',
  },
];
