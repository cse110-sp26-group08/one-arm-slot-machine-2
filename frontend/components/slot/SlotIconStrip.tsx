import { useEffect, useRef, useState } from 'react';

import styles from '../../pages/App.module.css';
import {
  createIdleAnimationDelay,
  IDLE_ANIMATION_DURATION_MS,
  selectNextIdleSymbolIndex
} from './slot-icon-idle.js';

interface SlotIconStripProps {
  icons: string[];
}

/**
 * Displays slot icons that occasionally play an idle animation at randomized intervals.
 *
 * @param {SlotIconStripProps} props - Slot icon strip props.
 * @returns {JSX.Element | null} Animated slot icon strip when icons are provided.
 */
export function SlotIconStrip({ icons }: SlotIconStripProps) {
  const [activeIconIndex, setActiveIconIndex] = useState(-1);
  const scheduleTimeoutRef = useRef<number | null>(null);
  const clearTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function clearTimers() {
      if (scheduleTimeoutRef.current !== null) {
        window.clearTimeout(scheduleTimeoutRef.current);
      }

      if (clearTimeoutRef.current !== null) {
        window.clearTimeout(clearTimeoutRef.current);
      }
    }

    function scheduleNextIdleAnimation(currentIndex: number) {
      const nextDelay = createIdleAnimationDelay();

      scheduleTimeoutRef.current = window.setTimeout(() => {
        const nextIndex = selectNextIdleSymbolIndex(icons.length, currentIndex);
        setActiveIconIndex(nextIndex);

        clearTimeoutRef.current = window.setTimeout(() => {
          setActiveIconIndex(-1);
          scheduleNextIdleAnimation(nextIndex);
        }, IDLE_ANIMATION_DURATION_MS);
      }, nextDelay);
    }

    clearTimers();

    if (icons.length > 0) {
      scheduleNextIdleAnimation(-1);
    } else {
      setActiveIconIndex(-1);
    }

    return () => {
      clearTimers();
    };
  }, [icons]);

  if (icons.length === 0) {
    return null;
  }

  return (
    <div className={styles.marqueeStrip} aria-label="Slot symbols">
      {icons.map((icon, index) => (
        <span
          className={index === activeIconIndex ? `${styles.marqueeItem} ${styles.marqueeItemActive}` : styles.marqueeItem}
          key={`${icon}-${index}`}
        >
          {icon}
        </span>
      ))}
    </div>
  );
}
