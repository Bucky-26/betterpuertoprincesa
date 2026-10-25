// City transactions that can be done online, grouped by what a resident
// wants to do. Every link goes to a system the City Government runs
// itself (we don't host or mirror any of it); the help line is the
// specific division that handles the task, from the city's published
// contact directory:
// https://puertoprincesa.ph/city-government-contacts/
// Services on Filipizen, as listed on the city's partner page:
// https://www.filipizen.com/partners/palawan_puertoprincesa
export interface OnlineService {
  key: string; // translation key under onlineServices.items
  icon: string; // lucide-react icon name
  url: string;
  site: string; // domain shown to the user
  helpLine?: string;
}

const FILIPIZEN = 'https://www.filipizen.com/partners/palawan_puertoprincesa';

export const onlineServices: OnlineService[] = [
  {
    key: 'business',
    icon: 'Store',
    url: FILIPIZEN,
    site: 'filipizen.com',
    helpLine: '(048) 717-8008',
  },
  {
    key: 'realty',
    icon: 'House',
    url: FILIPIZEN,
    site: 'filipizen.com',
    helpLine: '(048) 717-8027',
  },
  {
    key: 'building',
    icon: 'HardHat',
    url: FILIPIZEN,
    site: 'filipizen.com',
    helpLine: '(048) 717-8087',
  },
  {
    key: 'market',
    icon: 'ShoppingBasket',
    url: FILIPIZEN,
    site: 'filipizen.com',
  },
  {
    key: 'ordinances',
    icon: 'ScrollText',
    url: 'https://puertoprincesa.ph/legislative-tracking-system/',
    site: 'puertoprincesa.ph',
    helpLine: '(048) 717-8004',
  },
  {
    key: 'bids',
    icon: 'Gavel',
    url: 'https://bacoffice.puertoprincesa.ph/',
    site: 'bacoffice.puertoprincesa.ph',
    helpLine: '(048) 717-8050',
  },
  {
    key: 'abroad',
    icon: 'Plane',
    url: 'https://puertoprincesa.balinkbayan.gov.ph/',
    site: 'balinkbayan.gov.ph',
  },
];

export const CITY_DIRECTORY_URL =
  'https://puertoprincesa.ph/city-government-contacts/';
