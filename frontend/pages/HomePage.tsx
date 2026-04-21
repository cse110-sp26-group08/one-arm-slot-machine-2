import { useEffect, useState } from 'react';

import { SlotMachineGrid } from '../components/home/SlotMachineGrid.js';
import { SlotMachineStats } from '../components/home/SlotMachineStats.js';
import { classicGoldTheme } from '../components/home/slot-theme.js';
import { fetchSlotMachineState, spinSlotMachine, type SlotMachineState } from '../services/slot-machine-client.js';
import type { AuthenticatedUser } from '../services/auth-client.js';
import styles from './HomePage.module.css';

interface HomePageProps {
  onLogout: () => void;
  user: AuthenticatedUser;
}

/**
 * Home page containing the connected slot-machine experience.
 *
 * @param {HomePageProps} props - Home page props.
 * @returns {JSX.Element} Home page UI.
 */
export function HomePage({ onLogout, user }: HomePageProps) {
  const [slotMachineState, setSlotMachineState] = useState<SlotMachineState | null>(null);

  useEffect(() => {
    void hydrateSlotMachineState();
  }, []);

  async function hydrateSlotMachineState() {
    const currentState = await fetchSlotMachineState();
    setSlotMachineState(currentState);
  }

  async function handleSpin() {
    const nextState = await spinSlotMachine();
    setSlotMachineState(nextState);
  }

  if (!slotMachineState) {
    return (
      <main className={styles.pageShell}>
        <section className={styles.machineFrame}>
          <p className={styles.eyebrow}>Preparing machine</p>
          <h1 className={styles.machineTitle}>Loading the reels for {user.displayName}.</h1>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.pageShell}>
      <SlotMachineGrid slotMachineState={slotMachineState} theme={classicGoldTheme} />
      <SlotMachineStats
        onLogout={onLogout}
        onSpin={handleSpin}
        slotMachineState={slotMachineState}
        userDisplayName={user.displayName}
      />
    </main>
  );
}
