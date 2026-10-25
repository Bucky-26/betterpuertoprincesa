import React, { useState } from 'react';
import { X, Menu, ChevronDown, Phone } from 'lucide-react';
import { mainNavigation } from '../../data/navigation';
import type { LanguageType } from '../../types/index';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../i18n/languages';
import { hotlines } from '../../data/hotlines';
import { Ticker } from '../ui/Ticker';
import { cn } from '../../lib/utils';

const HOTLINE_ITEMS = hotlines.map(h => `${h.label}: ${h.number}`);
const REPO_URL = 'https://github.com/hmcldryl/betterpuertoprincesa';

function LanguageToggle({
  language,
  onChange,
  className = '',
  tone = 'dark',
}: {
  language: string;
  onChange: (lang: LanguageType) => void;
  className?: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <div className={cn('inline-flex gap-1', className)}>
      {Object.entries(LANGUAGES).map(([code, lang]) => {
        const active = language === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code as LanguageType)}
            aria-pressed={active}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-bold transition-colors',
              tone === 'dark'
                ? active
                  ? 'bg-balayong-200 text-gray-900'
                  : 'text-primary-100 hover:bg-primary-700'
                : active
                  ? 'bg-primary-700 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            {lang.nativeName}
          </button>
        );
      })}
    </div>
  );
}

// Notification-style "!" badge for nav items that need attention (e.g.
// Mining Watch); the item itself is also filled balayong pink. Lucide only
// ships "!" inside a circle/triangle, so the bare mark is drawn here with
// Lucide's own stroke geometry.
function ImportantBadge({ corner = false }: { corner?: boolean }) {
  const { t } = useTranslation('common');
  return (
    <span
      className={cn(
        'flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-800 text-white ring-2 ring-white',
        corner ? 'absolute -top-1.5 -right-1.5' : 'ml-2'
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        className="h-3.5 w-3.5"
        aria-hidden="true"
      >
        <path d="M12 5v9" />
        <path d="M12 19h.01" />
      </svg>
      <span className="sr-only">{t('navbar.importantBadge')}</span>
    </span>
  );
}

const HIGHLIGHT_CLASSES =
  'bg-balayong-500 text-white hover:bg-balayong-600 hover:text-white';

const navLabel = (label: string) =>
  `navbar.${label.replace(' ', '').toLowerCase()}`;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { t, i18n } = useTranslation('common');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setActiveMenu(null);
    }
  };

  const closeMenu = () => {
    setIsOpen(false);
    setActiveMenu(null);
  };

  const toggleSubmenu = (label: string) => {
    setActiveMenu(activeMenu === label ? null : label);
  };

  const changeLanguage = (newLanguage: LanguageType) => {
    i18n.changeLanguage(newLanguage);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white">
      {/* Top bar: hotline ticker + meta links + language switcher */}
      <div className="bg-primary-800 text-primary-100">
        <div className="container mx-auto flex h-10 items-center justify-between gap-4 px-4">
          <a
            href="tel:911"
            className="flex min-w-0 items-center gap-2 text-xs font-bold text-white hover:text-balayong-200"
            aria-label="Emergency hotlines"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <Ticker items={HOTLINE_ITEMS} className="truncate" />
          </a>
          <div className="flex shrink-0 items-center gap-5">
            <a
              href={REPO_URL}
              className="hidden text-xs hover:text-white sm:inline"
              target="_blank"
              rel="noreferrer"
            >
              {t('navbar.joinUs')}
            </a>
            <a
              href="https://puertoprincesa.ph"
              className="text-xs hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              {t('navbar.officialSite')}
            </a>
            <LanguageToggle
              className="hidden md:inline-flex"
              language={i18n.resolvedLanguage ?? i18n.language}
              onChange={changeLanguage}
            />
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* -mb-3 cancels the bar's bottom padding so the statue's base
              sits on the bar's bottom edge. */}
          <Link
            to="/"
            className="-mb-3 flex items-end self-end"
            onClick={closeMenu}
          >
            <img
              src="/logos/logo.svg"
              alt="Better Puerto Princesa — home"
              className="block h-16 w-auto md:h-20"
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 lg:flex">
            {mainNavigation.map(item => (
              <div key={item.label} className="group relative">
                <NavLink
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    cn(
                      'relative flex items-center rounded-full px-3.5 py-2 font-bold text-gray-800 transition-colors hover:bg-balayong-50 hover:text-balayong-800',
                      isActive && 'bg-balayong-100 text-balayong-800',
                      item.highlight && HIGHLIGHT_CLASSES,
                      item.highlight &&
                        isActive &&
                        'ring-2 ring-balayong-200 ring-offset-1'
                    )
                  }
                >
                  {t(navLabel(item.label))}
                  {item.highlight && <ImportantBadge corner />}
                  {item.children && (
                    <ChevronDown className="ml-1 h-4 w-4" aria-hidden="true" />
                  )}
                </NavLink>
                {item.children && (
                  <div className="invisible absolute left-0 z-50 pt-2 opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div
                      className="w-64 rounded-xl border border-gray-200 bg-white p-1.5 shadow-[0_8px_24px_-12px_rgb(14_55_85/0.35)]"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {item.children.map(child => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block rounded-lg px-3 py-2 text-sm text-gray-800 hover:bg-balayong-50 hover:text-balayong-800"
                          role="menuitem"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            aria-expanded={isOpen}
            className="inline-flex items-center justify-center rounded-full p-2 text-gray-800 hover:bg-balayong-50 lg:hidden"
          >
            <span className="sr-only">
              {isOpen ? 'Close main menu' : 'Open main menu'}
            </span>
            {isOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          'max-h-[calc(100vh-7rem)] overflow-y-auto border-b border-gray-200 bg-white lg:hidden',
          isOpen ? 'block' : 'hidden'
        )}
      >
        <div className="container mx-auto space-y-1 px-4 py-3">
          {mainNavigation.map(item =>
            item.children ? (
              <div key={item.label}>
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  aria-expanded={activeMenu === item.label}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-bold text-gray-800 hover:bg-balayong-50"
                >
                  {t(navLabel(item.label))}
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 transition-transform',
                      activeMenu === item.label && 'rotate-180'
                    )}
                    aria-hidden="true"
                  />
                </button>
                {activeMenu === item.label && (
                  <div className="ml-3 space-y-0.5 border-l-2 border-balayong-200 py-1 pl-3">
                    {item.children.map(child => (
                      <Link
                        key={child.label}
                        to={child.href}
                        onClick={closeMenu}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-balayong-50"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                to={item.href}
                onClick={closeMenu}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2.5 font-bold text-gray-800 hover:bg-balayong-50',
                  item.highlight && HIGHLIGHT_CLASSES
                )}
              >
                {t(navLabel(item.label))}
                {item.highlight && <ImportantBadge />}
              </Link>
            )
          )}
          <a
            href={REPO_URL}
            onClick={closeMenu}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg px-3 py-2.5 text-primary-700 hover:bg-primary-50"
          >
            {t('navbar.joinUs')}
          </a>
          <div className="border-t border-gray-200 px-3 pt-3">
            <LanguageToggle
              tone="light"
              language={i18n.resolvedLanguage ?? i18n.language}
              onChange={changeLanguage}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
