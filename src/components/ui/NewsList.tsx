import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { NewsItem } from '../../data/news';

// Each story is dated like a page torn from a desk calendar: day large in
// the display serif, month and year beneath. Stories link to their source.
export default function NewsList({ items }: { items: NewsItem[] }) {
  const { t, i18n } = useTranslation('common');
  const dateLocale = i18n.resolvedLanguage === 'fil' ? 'fil-PH' : 'en-US';
  return (
    <ul className="border-t border-gray-200">
      {items.map(item => {
        const date = new Date(item.date);
        return (
          <li key={item.id} className="border-b border-gray-200">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group -mx-3 grid grid-cols-[4rem_1fr] gap-4 rounded-lg px-3 py-5 transition-colors hover:bg-balayong-100/50 sm:grid-cols-[5rem_1fr] sm:gap-6"
            >
              <time
                dateTime={item.date}
                className="flex flex-col items-center rounded-lg bg-balayong-100 py-2 text-balayong-800"
              >
                <span className="font-display text-3xl leading-none tabular-nums">
                  {date.getUTCDate()}
                </span>
                <span className="mt-1 text-xs font-bold">
                  {date.toLocaleDateString(dateLocale, {
                    month: 'short',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                </span>
              </time>
              <span className="min-w-0">
                <span className="text-sm text-gray-600">
                  {t(`news.categories.${item.category}`, {
                    defaultValue: item.category,
                  })}
                </span>
                <span className="mt-0.5 flex items-start gap-2 text-lg font-bold leading-snug text-gray-900 group-hover:text-primary-700">
                  {item.title}
                  <ExternalLink
                    className="mt-1 h-4 w-4 shrink-0 text-gray-400"
                    aria-label={t('news.opensOriginal')}
                  />
                </span>
                <span className="mt-1 block max-w-prose text-gray-600">
                  {t(`news.summaries.${item.id}`, {
                    defaultValue: item.summary,
                  })}
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
