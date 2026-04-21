import { useEffect, useState } from 'react';

import type { AuthenticatedUser } from '../services/auth-client.js';
import {
  ENHANCED_LUCK_DURATION_IN_MILLISECONDS,
  ENHANCED_LUCK_PRICE,
  fetchPrizeCatalog,
  purchaseSlotMachinePrize,
  SNOW_THEME_PRICE,
  type PrizeCatalogEntry
} from '../services/prize-client.js';
import styles from './PrizePage.module.css';

interface PrizePageProps {
  currentBalance: number | null;
  currentUser: AuthenticatedUser | null;
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
  currentUser,
  onBack,
  onPrizePurchased
}: PrizePageProps) {
  const [catalog, setCatalog] = useState<PrizeCatalogEntry[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState(
    'Buy a short luck boost or unlock the snow celebration theme with guest balance.'
  );
  const [isPurchasingPrize, setIsPurchasingPrize] = useState(false);

  useEffect(() => {
    void loadCatalog();
  }, []);

  async function loadCatalog() {
    const nextCatalog = await fetchPrizeCatalog();
    setCatalog(nextCatalog);
  }

  async function handlePurchase(prizeId: PrizeCatalogEntry['id']) {
    setIsPurchasingPrize(true);

    try {
      const nextState = await purchaseSlotMachinePrize(prizeId);
      onPrizePurchased(nextState.stats.totalBalance);
      setFeedbackMessage(
        prizeId === 'enhanced-luck'
          ? 'Enhanced luck is active for the next hour.'
          : 'Snow celebration unlocked. The next win will trigger snowfall.'
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
            lasts {ENHANCED_LUCK_DURATION_IN_MILLISECONDS / (60 * 1000)} minutes. Snow theme costs{' '}
            {SNOW_THEME_PRICE}.
          </p>
        </div>
        <div className={styles.heroRail}>
          <div className={styles.balanceCard}>
            <span className={styles.balanceLabel}>Available balance</span>
            <strong className={styles.balanceValue}>{currentBalance ?? 0}</strong>
          </div>
          <button className={styles.backButton} onClick={onBack} type="button">
            Return to machine
          </button>
        </div>
      </section>

      <section className={styles.catalogGrid}>
        {catalog.map((catalogEntry) => {
          const canAffordPrize = (currentBalance ?? 0) >= catalogEntry.price;

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
                  disabled={!canAffordPrize || isPurchasingPrize || !currentUser}
                  onClick={() => void handlePurchase(catalogEntry.id)}
                  type="button"
                >
                  {isPurchasingPrize ? 'Buying...' : canAffordPrize ? 'Buy prize' : 'Need more balance'}
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
