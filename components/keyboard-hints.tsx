import React from 'react';
import { KeyboardKey } from './keyboard-key';

type AxisMode = 'horizontal' | 'vertical' | 'both' | 'none';

interface KeyboardHintsProps {
  /**
   * Which axis controls to show
   * - "horizontal": ← → or A D (for agency-fate)
   * - "vertical": ↑ ↓ or W S (for self-intact/dissolved)
   * - "both": All four arrows + WASD (for assessment)
   * - "none": No axis hints
   */
  axisMode?: AxisMode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Visual component that displays keyboard shortcut hints for axis navigation
 * Enter/Spacebar hints are now inline with buttons, not shown here
 */
export function KeyboardHints({
  axisMode = 'none',
  className = '',
}: KeyboardHintsProps) {
  if (axisMode === 'none') {
    return null;
  }

  return (
    <div
      className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        {axisMode === 'horizontal' && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5">
              <KeyboardKey keyLabel="←" />
              <KeyboardKey keyLabel="→" />
            </span>
            <span className="text-xs">or</span>
            <span className="inline-flex items-center gap-0.5">
              <KeyboardKey keyLabel="A" />
              <KeyboardKey keyLabel="D" />
            </span>
          </span>
        )}

        {axisMode === 'vertical' && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5">
              <KeyboardKey keyLabel="↑" />
              <KeyboardKey keyLabel="↓" />
            </span>
            <span className="text-xs">or</span>
            <span className="inline-flex items-center gap-0.5">
              <KeyboardKey keyLabel="W" />
              <KeyboardKey keyLabel="S" />
            </span>
          </span>
        )}

        {axisMode === 'both' && (
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-flex items-center gap-0.5">
              <KeyboardKey keyLabel="↑" />
              <KeyboardKey keyLabel="↓" />
              <KeyboardKey keyLabel="←" />
              <KeyboardKey keyLabel="→" />
            </span>
            <span className="text-xs">or</span>
            <span className="inline-flex items-center gap-0.5">
              <KeyboardKey keyLabel="W" />
              <KeyboardKey keyLabel="A" />
              <KeyboardKey keyLabel="S" />
              <KeyboardKey keyLabel="D" />
            </span>
            <span className="text-xs">to position</span>
          </span>
        )}
      </div>
    </div>
  );
}
