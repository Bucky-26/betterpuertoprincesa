import React from 'react';
import { footerNavigation } from '../../data/navigation';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SocialIcon } from '../ui/SocialIcon';

const isExternal = (href: string) => /^https?:\/\//.test(href);
const REPO_URL = 'https://github.com/hmcldryl/betterpuertoprincesa';

const FooterLink: React.FC<{
  href: string;
  className?: string;
  children: React.ReactNode;
}> = ({ href, className, children }) =>
  isExternal(href) ? (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ) : (
    <Link to={href} className={className}>
      {children}
    </Link>
  );

const Footer: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-4 pt-14 pb-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <img
              src="/logos/logo-white.svg"
              alt="Better Puerto Princesa"
              className="mb-4 h-16 w-auto"
            />
            <p className="mb-5 max-w-xs text-primary-100">
              {t('footer.tagline')}
            </p>
            <div className="flex gap-2.5">
              {footerNavigation.socialLinks
                .filter(link => link.href)
                .map(link => (
                  <a
                    key={link.label}
                    href={link.href as string}
                    className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/10 text-primary-100 transition-colors hover:bg-balayong-300 hover:text-gray-900"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <SocialIcon
                      name={link.label}
                      className="h-[18px] w-[18px]"
                    />
                  </a>
                ))}
              <a
                href="https://bettergov.ph"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="BetterGov.ph"
                className="ml-1 flex h-10 items-center opacity-90 transition-opacity hover:opacity-100"
              >
                <img
                  src="/logos/bettergov-white.svg"
                  alt=""
                  className="h-12 w-12"
                />
              </a>
            </div>
          </div>

          {footerNavigation.mainSections.map(section => (
            <div key={section.title}>
              <h3 className="mb-4 font-display text-xl">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map(link => (
                  <li key={link.label}>
                    <FooterLink
                      href={link.href}
                      className="text-primary-100 underline-offset-4 hover:text-balayong-200 hover:underline"
                    >
                      {link.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-primary-700 pt-6 text-sm text-primary-200 md:flex-row md:items-center md:justify-between">
          <p>{t('footer.copyright')}</p>
          <a
            href={REPO_URL}
            className="text-primary-100 underline underline-offset-4 hover:text-balayong-200"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('footer.suggestFix')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
