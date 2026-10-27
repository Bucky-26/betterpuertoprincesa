import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  X,
  ArrowRight,
  CornerDownLeft,
  Store,
  Phone,
  Calculator,
  FileText,
  Landmark,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchIndex, type SearchItem } from '../../data/searchIndex';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Service: 'bg-primary-100 text-primary-800 border-primary-200',
  Market: 'bg-balayong-100 text-balayong-800 border-balayong-200',
  Hotline: 'bg-red-100 text-red-800 border-red-200',
  Tool: 'bg-amber-100 text-amber-800 border-amber-200',
  Transparency: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Government: 'bg-purple-100 text-purple-800 border-purple-200',
  Landmark: 'bg-blue-100 text-blue-800 border-blue-200',
};

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Service: FileText,
  Market: Store,
  Hotline: Phone,
  Tool: Calculator,
  Transparency: ShieldAlert,
  Government: Landmark,
  Landmark: Sparkles,
};

export default function SearchModal({
  isOpen,
  onClose,
  initialQuery = '',
}: SearchModalProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialQuery]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return searchIndex.filter(item => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.description.toLowerCase().includes(q);
      const keywordMatch = item.keywords.some(k => k.toLowerCase().includes(q));
      return titleMatch || descMatch || keywordMatch;
    });
  }, [query, selectedCategory]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  const handleSelect = (item: SearchItem) => {
    onClose();
    if (item.url.startsWith('http')) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.url);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev =>
        prev < filteredItems.length - 1 ? prev + 1 : prev
      );
      scrollActiveIntoView();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      scrollActiveIntoView();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  const scrollActiveIntoView = () => {
    setTimeout(() => {
      const activeEl = listRef.current?.querySelector('[aria-selected="true"]');
      activeEl?.scrollIntoView({ block: 'nearest' });
    }, 10);
  };

  if (!isOpen) return null;

  const categories = [
    'All',
    'Market',
    'Service',
    'Hotline',
    'Tool',
    'Transparency',
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Puerto Princesa Civic Portal"
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-gray-950/60 backdrop-blur-sm animate-fade-in"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 flex flex-col max-h-[82vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/70">
          <Search
            className="h-5 w-5 text-gray-400 shrink-0"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search permits, markets, tricycle fare, hotlines, budget..."
            className="w-full bg-transparent px-3 py-1.5 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto px-4 py-2.5 border-b border-gray-100 bg-white text-xs scrollbar-none">
          <span className="text-gray-400 font-medium shrink-0 mr-1">
            Filter:
          </span>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 font-semibold transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-primary-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat === 'All' ? 'All Results' : `${cat}s`}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-2 flex-1">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-8 w-8 mx-auto text-gray-300 mb-2" />
              <p className="font-semibold text-gray-800">
                No matching services or information
              </p>
              <p className="text-sm mt-1 text-gray-500">
                Try searching for words like &quot;palengke&quot;,
                &quot;fare&quot;, &quot;business permit&quot;, or
                &quot;hotlines&quot;.
              </p>
            </div>
          ) : (
            <ul ref={listRef} role="listbox" className="space-y-1">
              {filteredItems.map((item, idx) => {
                const IconComponent = CATEGORY_ICONS[item.category] || FileText;
                const isSelected = idx === selectedIndex;
                return (
                  <li
                    key={item.id}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex items-start gap-3 rounded-xl p-3 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-balayong-50/80 border border-balayong-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                        CATEGORY_COLORS[item.category] ||
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 group-hover:text-primary-700 text-sm truncate">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                            CATEGORY_COLORS[item.category] ||
                            'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="shrink-0 self-center text-gray-400 group-hover:text-primary-600 transition-colors">
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-primary-700 bg-white px-2 py-1 rounded-md border border-primary-200 shadow-2xs">
                          Open <CornerDownLeft className="h-3 w-3" />
                        </span>
                      ) : (
                        <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2.5 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white border border-gray-300 rounded px-1.5 py-0.5 text-[10px] mr-1">
                ↑
              </kbd>
              <kbd className="font-mono bg-white border border-gray-300 rounded px-1.5 py-0.5 text-[10px] mr-1">
                ↓
              </kbd>
              to navigate
            </span>
            <span>
              <kbd className="font-mono bg-white border border-gray-300 rounded px-1.5 py-0.5 text-[10px] mr-1">
                ↵
              </kbd>
              to select
            </span>
          </div>
          <span>Puerto Princesa Civic Directory</span>
        </div>
      </div>
    </div>
  );
}
