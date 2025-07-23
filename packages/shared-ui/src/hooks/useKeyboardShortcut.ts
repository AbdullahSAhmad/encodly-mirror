import { useEffect, useCallback } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: (event: KeyboardEvent) => void;
}

export const useKeyboardShortcut = (shortcuts: KeyboardShortcut[] = []) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!shortcuts || !Array.isArray(shortcuts) || shortcuts.length === 0) {
      return;
    }
    
    shortcuts.forEach((shortcut) => {
      if (!shortcut || typeof shortcut.callback !== 'function') {
        return;
      }

      const isCtrlOrCmd = shortcut.ctrlKey || shortcut.metaKey;
      const isCtrlPressed = event.ctrlKey || event.metaKey;
      const isShiftPressed = event.shiftKey;
      const isAltPressed = event.altKey;

      const ctrlMatch = (!isCtrlOrCmd || isCtrlPressed);
      const shiftMatch = (!shortcut.shiftKey || isShiftPressed);
      const altMatch = (!shortcut.altKey || isAltPressed);
      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

      if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
        event.preventDefault();
        shortcut.callback(event);
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};