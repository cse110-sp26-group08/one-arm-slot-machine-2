import type { CSSProperties } from 'react';

import styles from '../../pages/HomePage.module.css';
import type { SlotMachineState } from '../../services/slot-machine-client.js';
import { resolveNearMissPositionKeys, type SlotMachineAnimationState } from './animation-state.js';
import { ReelCell } from './ReelCell.js';
import type { SlotMachineTheme } from './slot-theme.js';

interface SlotMachineGridProps {
  animationState: SlotMachineAnimationState;
  displayedGrid: SlotMachineState['grid'];
  isSpinning: boolean;
  settlingColumnIndexes: number[];
  spinningColumnStrips: SlotMachineState['grid'][number][];
  slotMachineState: SlotMachineState;
  theme: SlotMachineTheme;
}

/**
 * Renders the 3x3 slot-machine reel grid.
 *
 * @param {SlotMachineGridProps} props - Grid props.
 * @returns {JSX.Element} Slot-machine grid UI.
 */
export function SlotMachineGrid({
  animationState,
  displayedGrid,
  isSpinning,
  settlingColumnIndexes,
  spinningColumnStrips,
  slotMachineState,
  theme
}: SlotMachineGridProps) {
  const winningPositions = new Set(
    slotMachineState.winningLines.flatMap((winningLine) =>
      winningLine.path
        .slice(0, winningLine.matchingCount)
        .map((rowIndex, columnIndex) => `${rowIndex}-${columnIndex}`)
    )
  );
  const nearMissPositions =
    animationState === 'near-miss'
      ? new Set(resolveNearMissPositionKeys(displayedGrid))
      : new Set<string>();
  const isBigWinAnimation = animationState === 'big-win' || animationState === 'jackpot';

  return (
    <section
      className={[
        styles.machineFrame,
        animationState === 'idle' ? styles.machineFrameIdle : '',
        animationState === 'big-win' ? styles.machineFrameBigWin : '',
        animationState === 'jackpot' ? styles.machineFrameJackpot : ''
      ].join(' ')}
    >
      <div className={styles.machineTopper}>
        {theme.jackpotLabels.map((jackpotLabel) => (
          <div className={styles.jackpotMeter} key={jackpotLabel.name}>
            <span className={styles.jackpotName}>{jackpotLabel.name}</span>
            <span className={styles.jackpotAmount}>{jackpotLabel.amount}</span>
          </div>
        ))}
      </div>
      <div className={styles.machineHeading}>
        <div>
          <p className={styles.eyebrow}>{theme.accentLabel}</p>
          <h1 className={styles.machineTitle}>{theme.machineName}</h1>
        </div>
        <div
          className={[
            styles.payoutBadge,
            animationState === 'idle' ? styles.payoutBadgeIdle : '',
            slotMachineState.outcome === 'win' ? styles.payoutBadgeWin : ''
          ].join(' ')}
        >
          {slotMachineState.outcome === 'win'
            ? `Win ${slotMachineState.lastPayout}`
            : slotMachineState.outcome === 'near-miss'
              ? 'Near miss'
              : `Last payout: ${slotMachineState.lastPayout}`}
        </div>
      </div>
      <div className={[styles.reelCabinet, animationState === 'idle' ? styles.reelCabinetIdle : ''].join(' ')}>
        <div className={styles.reelCabinetLights} aria-hidden="true">
          {Array.from({ length: 10 }, (_, index) => (
            <span
              className={styles.reelCabinetLight}
              key={`cabinet-light-${index}`}
              style={{ animationDelay: `${index * 180}ms` } satisfies CSSProperties}
            />
          ))}
        </div>
        {isBigWinAnimation ? (
          <div className={styles.coinBurst} aria-hidden="true">
            {Array.from({ length: animationState === 'jackpot' ? 18 : 10 }, (_, index) => (
              <span
                className={styles.coinBurstPiece}
                key={`coin-${index}`}
                style={
                  {
                    animationDelay: `${index * 80}ms`,
                    left: `${8 + ((index * 9) % 80)}%`
                  } satisfies CSSProperties
                }
              />
            ))}
          </div>
        ) : null}
        {animationState === 'jackpot' ? (
          <div className={styles.cannonBlastLayer} aria-hidden="true">
            <span className={styles.cannonBlast} />
            <span className={styles.cannonBlast} />
          </div>
        ) : null}
        <div className={styles.reelMatrix}>
          {Array.from({ length: displayedGrid[0]?.length ?? 0 }, (_, columnIndex) => {
            const isColumnSettling = settlingColumnIndexes.includes(columnIndex);
            const shouldScrollColumn = isSpinning && !isColumnSettling;
            const visibleColumn = displayedGrid.map((row) => row[columnIndex]);
            const stripSymbols = spinningColumnStrips[columnIndex] ?? visibleColumn;

            return (
              <div className={styles.reelColumn} key={`column-${columnIndex}`}>
                {shouldScrollColumn ? (
                  <div
                    className={styles.reelStrip}
                    style={{ animationDelay: `${columnIndex * 120}ms` } satisfies CSSProperties}
                  >
                    {[...stripSymbols, ...stripSymbols].map((symbol, symbolIndex) => (
                      <ReelCell
                        className={styles.reelStripCell}
                        isNearMiss={false}
                        isSettling={false}
                        isSpinning={false}
                        isWinning={false}
                        key={`strip-${columnIndex}-${symbol}-${symbolIndex}`}
                        spinDelayMilliseconds={0}
                        symbol={symbol}
                        theme={theme}
                      />
                    ))}
                  </div>
                ) : (
                  visibleColumn.map((symbol, rowIndex) => (
                    <ReelCell
                      className={styles.reelStaticCell}
                      isNearMiss={!isSpinning && nearMissPositions.has(`${rowIndex}-${columnIndex}`)}
                      isSettling={isColumnSettling}
                      isSpinning={false}
                      isWinning={!isSpinning && winningPositions.has(`${rowIndex}-${columnIndex}`)}
                      key={`${rowIndex}-${columnIndex}-${symbol}`}
                      spinDelayMilliseconds={columnIndex * 160}
                      symbol={symbol}
                      theme={theme}
                    />
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.machineMeta}>
        <div className={styles.metaBlock}>
          <span className={styles.metaLabel}>Treasure lines</span>
          <span className={styles.metaValue}>Five paylines cross the deck from left to right.</span>
        </div>
        <div className={styles.metaBlock}>
          <span className={styles.metaLabel}>Captain&apos;s rules</span>
          <span className={styles.metaValue}>
            Three matches cash out. The wild compass stands in for any icon.
          </span>
        </div>
        <div className={styles.metaBlock}>
          <span className={styles.metaLabel}>Sea state</span>
          <span className={styles.metaValue}>
            {isSpinning
              ? 'The reels pitch and settle one mast at a time.'
              : animationState === 'near-miss'
                ? 'The crew nearly struck gold. The first matches still glow on the deck.'
                : 'Lantern glow holds the wheel at the center of the deck.'}
          </span>
        </div>
      </div>
    </section>
  );
}
