import { useEffect, useCallback } from 'react';

export type AxisIndex = 0 | 1 | 2 | 3 | 4;

interface UseKeyboardNavigationOptions {
  /**
   * Handler for horizontal axis changes (left/right or A/D keys)
   * Left/A decreases index, Right/D increases index
   */
  onHorizontalChange?: (newIndex: AxisIndex) => void;

  /**
   * Handler for vertical axis changes (up/down or W/S keys)
   * Up/W decreases index, Down/S increases index
   */
  onVerticalChange?: (newIndex: AxisIndex) => void;

  /**
   * Handler for Enter or Spacebar key press
   * Typically used to trigger submit/continue buttons
   */
  onSubmit?: () => void;

  /**
   * Current horizontal axis index (0-4)
   */
  horizontalIndex?: AxisIndex;

  /**
   * Current vertical axis index (0-4)
   */
  verticalIndex?: AxisIndex;

  /**
   * Whether keyboard input should be disabled
   */
  disabled?: boolean;

  /**
   * Whether to enable submit keys (Enter/Spacebar)
   * Default: true
   */
  enableSubmitKeys?: boolean;
}

/**
 * Custom hook for handling keyboard navigation in axis selection and submit actions
 *
 * Supports:
 * - Arrow keys or WASD for axis movement
 * - Enter or Spacebar for submit/continue actions
 * - Automatic prevention of default browser behavior
 * - Disabling when focused in text input fields
 */
export function useKeyboardNavigation({
  onHorizontalChange,
  onVerticalChange,
  onSubmit,
  horizontalIndex = 2,
  verticalIndex = 2,
  disabled = false,
  enableSubmitKeys = true,
}: UseKeyboardNavigationOptions) {

  const clampAxisIndex = useCallback((value: number): AxisIndex => {
    return Math.max(0, Math.min(4, value)) as AxisIndex;
  }, []);

  const isInTextField = useCallback((): boolean => {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    const tagName = activeElement.tagName.toLowerCase();
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      (activeElement as HTMLElement).isContentEditable
    );
  }, []);

  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't interfere with text input fields
      if (isInTextField()) return;

      const key = event.key.toLowerCase();
      let handled = false;

      // Handle horizontal axis (left/right or a/d)
      if (onHorizontalChange && (key === 'arrowleft' || key === 'a')) {
        event.preventDefault();
        const newIndex = clampAxisIndex(horizontalIndex - 1);
        onHorizontalChange(newIndex);
        handled = true;
      } else if (onHorizontalChange && (key === 'arrowright' || key === 'd')) {
        event.preventDefault();
        const newIndex = clampAxisIndex(horizontalIndex + 1);
        onHorizontalChange(newIndex);
        handled = true;
      }

      // Handle vertical axis (up/down or w/s)
      if (onVerticalChange && (key === 'arrowup' || key === 'w')) {
        event.preventDefault();
        const newIndex = clampAxisIndex(verticalIndex - 1);
        onVerticalChange(newIndex);
        handled = true;
      } else if (onVerticalChange && (key === 'arrowdown' || key === 's')) {
        event.preventDefault();
        const newIndex = clampAxisIndex(verticalIndex + 1);
        onVerticalChange(newIndex);
        handled = true;
      }

      // Handle submit keys (Enter or Spacebar)
      if (enableSubmitKeys && onSubmit && (key === 'enter' || key === ' ')) {
        // Only handle if we're not already on a button
        const activeElement = document.activeElement;
        const isButton = activeElement?.tagName.toLowerCase() === 'button';

        if (!isButton) {
          event.preventDefault();
          onSubmit();
          handled = true;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    disabled,
    horizontalIndex,
    verticalIndex,
    onHorizontalChange,
    onVerticalChange,
    onSubmit,
    enableSubmitKeys,
    clampAxisIndex,
    isInTextField,
  ]);
}
