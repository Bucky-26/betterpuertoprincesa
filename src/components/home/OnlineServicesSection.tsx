import * as LucideIcons from 'lucide-react';
import { ExternalLink, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Section from '../ui/Section';
import { Heading } from '../ui/Heading';
import { onlineServices, CITY_DIRECTORY_URL } from '../../data/onlineServices';

// Routes people to the city's own online systems by task. Nothing here is
// hosted by us: the value is knowing which system does what, and which
// division to call when it doesn't work.
export default function OnlineServicesSection() {
  const { t } = useTranslation('common');

  return (
    <Section className="pt-0 md:pt-0">
      <div className="rounded-2xl bg-primary-50 p-6 md:p-10">
        <Heading level={2}>{t('onlineServices.title')}</Heading>
        <p className="max-w-prose text-lg text-gray-700">
          {t('onlineServices.subtitle')}
        </p>

        <ul className="mt-8 grid gap-3 md:grid-cols-2">
          {onlineServices.map(item => {
            const Icon = LucideIcons[item.icon as keyof typeof LucideIcons] as
              | React.ComponentType<{ className?: string }>
              | undefined;
            return (
              <li
                key={item.key}
                className="flex flex-col rounded-xl border border-primary-100 bg-white"
              >
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-1 items-start gap-4 rounded-xl p-4 transition-colors hover:bg-balayong-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700">
                    {Icon && <Icon className="h-5 w-5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-start gap-2 font-bold text-gray-900 group-hover:text-primary-700">
                      {t(`onlineServices.items.${item.key}.title`)}
                      <ExternalLink
                        className="mt-1 h-3.5 w-3.5 shrink-0 text-gray-400"
                        aria-label={t('news.opensOriginal')}
                      />
                    </span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-gray-600">
                      {t(`onlineServices.items.${item.key}.body`)}
                    </span>
                    <span className="mt-1 block text-xs text-gray-500">
                      {item.site}
                    </span>
                  </span>
                </a>
                {item.helpLine && (
                  <a
                    href={`tel:${item.helpLine.replace(/\D/g, '')}`}
                    className="flex items-center gap-2 border-t border-primary-100 px-4 py-2 text-sm text-gray-700 hover:text-primary-700"
                  >
                    <Phone
                      className="h-3.5 w-3.5 text-balayong-600"
                      aria-hidden="true"
                    />
                    {t('onlineServices.help')}{' '}
                    <span className="font-bold tabular-nums">
                      {item.helpLine}
                    </span>
                  </a>
                )}
              </li>
            );
          })}
        </ul>

        <p className="mt-6 text-sm text-gray-700">
          {t('onlineServices.otherOffices')}{' '}
          <a
            href={CITY_DIRECTORY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-primary-700 underline decoration-primary-200 decoration-2 underline-offset-4 hover:decoration-primary-600"
          >
            {t('onlineServices.directoryLink')}
          </a>
        </p>
      </div>
    </Section>
  );
}
