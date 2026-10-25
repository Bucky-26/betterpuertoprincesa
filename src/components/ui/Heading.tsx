import React from 'react';
import { cn } from '../../lib/utils';

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

// h1–h3 are set in Young Serif (see index.css); h4–h6 stay in the body
// face, bold, so small headings inside lists and cards don't compete.
const headingStyles = {
  1: 'text-4xl md:text-5xl leading-[1.1] mb-4 text-gray-900',
  2: 'text-3xl md:text-[2.5rem] leading-[1.15] mb-3 text-gray-900',
  3: 'text-2xl md:text-[1.75rem] leading-snug mb-3 text-gray-900',
  4: 'text-lg font-bold leading-snug mb-2 text-gray-900',
  5: 'text-base font-bold leading-snug mb-2 text-gray-900',
  6: 'text-sm font-bold leading-snug mb-2 text-gray-700',
};

export function Heading({ level = 1, children, className }: HeadingProps) {
  return React.createElement(
    `h${level}`,
    { className: cn(headingStyles[level], className) },
    children
  );
}
