import React from 'react';
import { cn } from '@/lib/utils';

interface KeyboardKeyProps {
  /**
   * The key to display (e.g., "ENTER", "P", "←", "→", "↑", "↓", "W", "A", "S", "D")
   */
  keyLabel: string;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Size variant
   * @default "default"
   */
  size?: 'small' | 'default' | 'large';
}

/**
 * Renders a styled keyboard key visual to indicate keyboard shortcuts
 * Can be used inline with text or standalone
 */
export function KeyboardKey({ keyLabel, className = '', size = 'default' }: KeyboardKeyProps) {
  const sizeClasses = {
    small: 'px-1 py-0.5 text-[0.65rem] min-w-[1.25rem]',
    default: 'px-1.5 py-0.5 text-xs min-w-[1.5rem]',
    large: 'px-2 py-1 text-sm min-w-[2rem]',
  };

  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center font-semibold',
        'bg-gray-100 dark:bg-gray-800',
        'border border-gray-300 dark:border-gray-700',
        'rounded shadow-sm',
        sizeClasses[size],
        className
      )}
    >
      {keyLabel}
    </kbd>
  );
}
