import React from 'react';

interface KeyboardHintsProps {
  /**
   * Show hints for axis navigation (arrow keys/WASD)
   */
  showAxisHints?: boolean;

  /**
   * Show hints for submit action (Enter/Spacebar)
   */
  showSubmitHint?: boolean;

  /**
   * Custom submit button label (e.g., "Continue", "Submit")
   * Default: "continue"
   */
  submitLabel?: string;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Visual component that displays keyboard shortcut hints to learners
 */
export function KeyboardHints({
  showAxisHints = false,
  showSubmitHint = false,
  submitLabel = 'continue',
  className = '',
}: KeyboardHintsProps) {
  if (!showAxisHints && !showSubmitHint) {
    return null;
  }

  return (
    <div
      className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        {showAxisHints && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
                ↓
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
                ←
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
                →
              </kbd>
            </span>
            <span className="text-xs">or</span>
            <span className="inline-flex items-center gap-0.5">
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
                W
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
                A
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
                S
              </kbd>
              <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
                D
              </kbd>
            </span>
            <span className="text-xs">to position</span>
          </span>
        )}

        {showAxisHints && showSubmitHint && (
          <span className="text-gray-400 dark:text-gray-600">•</span>
        )}

        {showSubmitHint && (
          <span className="inline-flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
              Enter
            </kbd>
            <span className="text-xs">to {submitLabel}</span>
          </span>
        )}
      </div>
    </div>
  );
}
