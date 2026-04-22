import { useEffect, useState } from 'react';

import {
  ENHANCED_LUCK_DURATION_IN_MILLISECONDS,
  ENHANCED_LUCK_PRICE,
  fetchPrizeCatalog,
  purchaseSlotMachinePrize,
  SOUNDTRACK_PRICE,
  type PrizeCatalogEntry
} from '../services/prize-client.js';
import { fetchSlotMachineState } from '../services/slot-machine-client.js';
import styles from './PrizePage.module.css';

interface PrizePageProps {
  currentBalance: number | null;
  onBack: () => void;
  onPrizePurchased: (nextBalance: number) => void;
}

/**
 * Displays the in-memory prize shop for temporary boosts and cosmetic unlocks.
 *
 * @param {PrizePageProps} props - Prize page props.
 * @returns {JSX.Element} Prize shop UI.
 */
export function PrizePage({
  currentBalance,
  onBack,
  onPrizePurchased
}: PrizePageProps) {
  const [catalog, setCatalog] = useState<PrizeCatalogEntry[]>([]);
  const [availableBalance, setAvailableBalance] = useState(currentBalance ?? 0);
  const [feedbackMessage, setFeedbackMessage] = useState(
    'Buy a short luck boost or unlock extra pirate soundtracks with guest balance.'
  );
  const [isPurchasingPrize, setIsPurchasingPrize] = useState(false);
  const [ownedPrizeIds, setOwnedPrizeIds] = useState<Set<PrizeCatalogEntry['id']>>(new Set());

  useEffect(() => {
    void loadVault();
  }, []);

  async function loadVault() {
    const [nextCatalog, slotMachineState] = await Promise.all([
      fetchPrizeCatalog(),
      fetchSlotMachineState()
    ]);

    setCatalog(nextCatalog);
    setAvailableBalance(slotMachineState.stats.totalBalance);
    setOwnedPrizeIds(
      new Set<PrizeCatalogEntry['id']>([
        ...slotMachineState.prizes.ownedSoundtrackIds,
        ...(slotMachineState.prizes.enhancedLuckExpiresAt ? (['enhanced-luck'] as const) : [])
      ])
    );
  }

  async function handlePurchase(prizeId: PrizeCatalogEntry['id']) {
    setIsPurchasingPrize(true);

    try {
      const nextState = await purchaseSlotMachinePrize(prizeId);
      onPrizePurchased(nextState.stats.totalBalance);
      setAvailableBalance(nextState.stats.totalBalance);
      setOwnedPrizeIds(
        new Set<PrizeCatalogEntry['id']>([
          ...nextState.prizes.ownedSoundtrackIds,
          ...(nextState.prizes.enhancedLuckExpiresAt ? (['enhanced-luck'] as const) : [])
        ])
      );
      setFeedbackMessage(
        prizeId === 'enhanced-luck'
          ? 'Enhanced luck is active for the next hour.'
          : 'Soundtrack unlocked. You can switch to it from the machine audio controls.'
      );
    } catch (error) {
      setFeedbackMessage(resolveErrorMessage(error, 'The prize could not be purchased.'));
    } finally {
      setIsPurchasingPrize(false);
    }
  }

  return (
    <main className={styles.pageShell}>
      <section className={styles.heroPanel}>
        <div>
          <p className={styles.eyebrow}>Prize vault</p>
          <h1 className={styles.title}>Upgrade your floor perks</h1>
          <p className={styles.supportCopy}>
            Guests can spend their balance here. Enhanced luck costs {ENHANCED_LUCK_PRICE} and
            lasts {ENHANCED_LUCK_DURATION_IN_MILLISECONDS / (60 * 1000)} minutes. Each soundtrack
            costs {SOUNDTRACK_PRICE}, and you can switch between the default deck theme and any
            unlocked tracks from the machine audio controls.
          </p>
        </div>
        <div className={styles.heroRail}>
          <div className={styles.balanceCard}>
            <span className={styles.balanceLabel}>Available balance</span>
            <strong className={styles.balanceValue}>{availableBalance}</strong>
          </div>
          <button className={styles.backButton} onClick={onBack} type="button">
            Return to machine
          </button>
        </div>
      </section>

      <section className={styles.catalogGrid}>
        {catalog.map((catalogEntry) => {
          const canAffordPrize = availableBalance >= catalogEntry.price;
          const alreadyOwned = ownedPrizeIds.has(catalogEntry.id);

          return (
            <article className={styles.prizeCard} key={catalogEntry.id}>
              <div className={styles.prizeArt}>{catalogEntry.icon}</div>
              <div className={styles.prizeCopy}>
                <p className={styles.prizeEyebrow}>{catalogEntry.category}</p>
                <h2 className={styles.prizeTitle}>{catalogEntry.name}</h2>
                <p className={styles.prizeDescription}>{catalogEntry.description}</p>
              </div>
              <div className={styles.prizeFooter}>
                <strong className={styles.prizePrice}>{catalogEntry.price}</strong>
                <button
                  className={styles.buyButton}
                  disabled={!canAffordPrize || isPurchasingPrize || alreadyOwned}
                  onClick={() => void handlePurchase(catalogEntry.id)}
                  type="button"
                >
                  {alreadyOwned
                    ? 'Owned'
                    : isPurchasingPrize
                      ? 'Buying...'
                      : canAffordPrize
                        ? 'Buy prize'
                        : 'Need more balance'}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <section className={styles.infoPanel}>
        <p className={styles.feedbackBanner}>{feedbackMessage}</p>
      </section>
    </main>
  );
}

function resolveErrorMessage(error: unknown, fallbackMessage: string) {
  return error instanceof Error ? error.message : fallbackMessage;
}
