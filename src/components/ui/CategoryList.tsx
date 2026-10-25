import * as LucideIcons from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { getCategoryPages } from '../../data/yamlLoader';

const MAX_EXAMPLES = 3;

export interface CategoryItem {
  category: string;
  slug: string;
  description: string;
  icon: string;
}

// Real pages from the category's content index. Categories without one
// (most government ones) show no examples rather than placeholder names.
function examplesFor(item: CategoryItem) {
  return getCategoryPages(item.slug)
    .slice(0, MAX_EXAMPLES)
    .map(p => p.name);
}

// Directory-style rows: icon, name, description, and a few real examples
// of what's inside, so people can tell a category is the right one before
// opening it. Used for both
// service and government categories so the two read as one directory.
export default function CategoryList({
  items,
  basePath,
  columns = 1,
}: {
  items: CategoryItem[];
  basePath: string;
  columns?: 1 | 2;
}) {
  return (
    <ul
      className={cn(
        'border-t border-gray-200',
        columns === 2 && 'md:grid md:grid-cols-2 md:gap-x-10'
      )}
    >
      {items.map(item => {
        const Icon = LucideIcons[item.icon as keyof typeof LucideIcons] as
          | React.ComponentType<{ className?: string }>
          | undefined;
        const examples = examplesFor(item);
        return (
          <li key={item.slug} className="border-b border-gray-200">
            <Link
              to={`${basePath}/${item.slug}`}
              className="group -mx-3 flex items-start gap-4 rounded-lg px-3 py-4 transition-colors hover:bg-balayong-50"
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-balayong-100 text-balayong-700">
                {Icon && <Icon className="h-5 w-5" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-gray-900 group-hover:text-primary-700">
                  {item.category}
                </span>
                <span className="mt-0.5 block text-sm leading-relaxed text-gray-600">
                  {item.description}
                </span>
                {examples.length > 0 && (
                  <span className="mt-2 block space-y-1">
                    {examples.map(name => (
                      <span
                        key={name}
                        className="flex gap-2 text-sm text-gray-800 before:mt-[0.55em] before:h-1.5 before:w-1.5 before:shrink-0 before:rounded-full before:bg-balayong-400"
                      >
                        {name}
                      </span>
                    ))}
                  </span>
                )}
              </span>
              <ChevronRight
                className="mt-2.5 h-5 w-5 shrink-0 text-gray-400 group-hover:text-primary-600"
                aria-hidden="true"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
