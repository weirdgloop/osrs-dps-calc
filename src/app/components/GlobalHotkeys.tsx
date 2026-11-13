import React, { useEffect } from 'react';
import { useLoadouts } from '@/state/LoadoutStore';

const GlobalHotkeys: React.FC = () => {
  const loadouts = useLoadouts();

  useEffect(() => {
    const globalKeyDownHandler = (e: KeyboardEvent) => {
      // We only handle events that occur outside <input>, <textarea>, etc
      if (e.target !== document.body) return;

      // Ignore if any modifier keys are held (to not interfere with browser/system shortcuts)
      if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) return;

      switch (e.key) {
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6': {
          // Handle quickly switching between loadouts (max 6)
          const loadout = loadouts.loadouts[parseInt(e.key) - 1];
          if (loadout !== undefined) {
            loadouts.select(loadout.uuid);
          }
          break;
        }
        default:
          return;
      }

      // If we get here, we've handled the event, so prevent it bubbling
      e.preventDefault();
    };

    document.addEventListener('keydown', globalKeyDownHandler);
    return () => {
      document.removeEventListener('keydown', globalKeyDownHandler);
    };
  }, [loadouts]);

  return null;
};

export default GlobalHotkeys;
