import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Code,
  Languages,
  Layers,
  Megaphone,
  Palette,
  PenLine,
  X,
} from 'lucide-react';
import { footerNavigation } from '../../data/navigation';
import BalayongBranch from '../ui/BalayongBranch';

// Call for volunteers, shown once per browser shortly after the first page
// load (same behavior as betteraborlan.org's popup). Dismissing it, by any
// route, stores a flag so it never comes back.
const STORAGE_KEY = 'bpp-vol-popup-v1';
const SHOW_DELAY_MS = 800;

const ROLES = [
  { icon: Code, key: 'dev' },
  { icon: Layers, key: 'uiux' },
  { icon: Palette, key: 'graphic' },
  { icon: PenLine, key: 'content' },
  { icon: Megaphone, key: 'marketing' },
  { icon: Languages, key: 'translation' },
] as const;

const CONTACT_URL =
  footerNavigation.socialLinks.find(l => l.label === 'Facebook')?.href ??
  'https://github.com/hmcldryl/betterpuertoprincesa';

export default function VolunteerPopup() {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Storage blocked (private mode): the popup just shows again next time.
    }
    setOpen(false);
    document.body.style.overflow = '';
    previousFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // Fall through and show it.
    }
    const reducedMotion = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const timer = setTimeout(
      () => {
        previousFocus.current = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
        setOpen(true);
      },
      reducedMotion ? 0 : SHOW_DELAY_MS
    );
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        dismiss();
        return;
      }
      // Keep Tab focus inside the dialog.
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-primary-900/50 p-4 motion-safe:animate-fade-in sm:items-center"
      onClick={e => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vol-popup-title"
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_24px_48px_-16px_rgb(8_35_58/0.45)] motion-safe:animate-slide-in"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label={t('volunteer.close')}
          className="absolute top-3 right-3 z-10 rounded-full p-2 text-gray-700 hover:bg-white/60"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative overflow-hidden bg-balayong-100 px-6 pt-8 pb-6">
          <BalayongBranch className="pointer-events-none absolute -top-8 -right-16 w-56" />
          <img
            src="/logos/logo.svg"
            alt="Better Puerto Princesa"
            className="relative h-14 w-auto"
            draggable={false}
          />
          <h2
            id="vol-popup-title"
            className="relative mt-5 pr-14 font-display text-3xl leading-tight text-gray-900"
          >
            {t('volunteer.title')}
          </h2>
          <p className="relative mt-2 text-gray-700">
            {t('volunteer.subtitle')}
          </p>
        </div>

        <div className="px-6 pt-5 pb-6">
          <p className="text-gray-700">{t('volunteer.lead')}</p>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {ROLES.map(({ icon: Icon, key }) => (
              <li
                key={key}
                className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800"
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-balayong-600"
                  aria-hidden="true"
                />
                {t(`volunteer.roles.${key}`)}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setTimeout(dismiss, 150)}
              className="flex-1 rounded-full bg-primary-700 px-5 py-3 text-center font-bold text-white transition-colors hover:bg-primary-800"
            >
              {t('volunteer.cta')}
            </a>
            <button
              type="button"
              onClick={dismiss}
              className="flex-1 rounded-full px-5 py-3 font-bold text-gray-700 hover:bg-gray-100"
            >
              {t('volunteer.later')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
