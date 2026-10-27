import type { NavigationItem } from '../types';
import { serviceCategories as servicesData } from './yamlLoader';

interface Subcategory {
  name: string;
  slug: string;
}

interface Category {
  category: string;
  slug: string;
  subcategories: Subcategory[];
}

export const mainNavigation: NavigationItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Public Markets in PPC', href: '/markets' },
      { label: 'Tricycle Fare Calculator', href: '/fare-calculator' },
      { label: 'Emergency & Utility Hotlines', href: '/hotlines' },
      { label: 'Minimum Wage & Rights', href: '/minimum-wage' },
      ...(servicesData.categories as Category[]).map(category => ({
        label: category.category,
        href: `/services/${category.slug}`,
      })),
    ],
  },
  { label: 'Markets', href: '/markets' },
  {
    label: 'Government',
    href: '/government/departments',
    children: [
      { label: 'Executive', href: '/government/departments/executive' },
      { label: 'Legislative', href: '/government/departments/legislative' },
    ],
  },
  { label: 'Statistics', href: '/statistics' },
  { label: 'Transparency', href: '/transparency' },
  { label: 'News', href: '/news' },
  { label: 'Mining Watch', href: '/mining-watch', highlight: true },
];

export const footerNavigation = {
  mainSections: [
    {
      title: 'Services',
      links: [
        { label: 'Every service', href: '/services' },
        { label: 'Public Markets in PPC', href: '/markets' },
        { label: 'Tricycle Fare Calculator', href: '/fare-calculator' },
        { label: 'Emergency Hotlines', href: '/hotlines' },
        { label: 'Current Minimum Wage', href: '/minimum-wage' },
        ...(servicesData.categories as Category[])
          .slice(0, 5)
          .map(category => ({
            label: category.category,
            href: `/services/${category.slug}`,
          })),
      ],
    },
    {
      title: 'Puerto Princesa',
      links: [
        {
          label: "Citizen's Charter",
          href: 'https://puertoprincesa.ph/citizens-charter/',
        },
        { label: 'City Government Website', href: 'https://puertoprincesa.ph' },
        { label: 'Population and land', href: '/statistics' },
        { label: 'Where the money goes', href: '/transparency' },
        { label: 'City hall news', href: '/news' },
        { label: 'Mining Watch', href: '/mining-watch' },
      ],
    },
    {
      title: 'Government',
      links: [
        { label: 'Open Data', href: 'https://data.gov.ph' },
        { label: 'Freedom of Information', href: 'https://www.foi.gov.ph' },
        {
          label: 'Contact Center',
          href: 'https://contactcenterngbayan.gov.ph',
        },
        {
          label: 'Official Gazette',
          href: 'https://www.officialgazette.gov.ph',
        },
      ],
    },
  ],
  socialLinks: [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/betterpuertoprincesa',
    },
    {
      label: 'GitHub',
      href: 'https://github.com/hmcldryl/betterpuertoprincesa',
    },
    { label: 'Discord', href: 'https://discord.gg/DzwTq7MjfS' },
  ] as { label: string; href: string | null }[],
};
