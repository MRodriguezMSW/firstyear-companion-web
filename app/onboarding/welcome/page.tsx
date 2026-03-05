"use client";

import { useRouter } from "next/navigation";
import styles from "../styles/Onboarding.module.css";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className={styles.fycRoot}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div className={styles.card}>
        <div className={styles.welcomeIcon}>🌱</div>
        <p className={styles.eyebrow}>FirstYear Companion</p>
        <h1 className={styles.welcomeH1}>You are not alone.</h1>
        <p className={styles.welcomeBody}>
          This is a calm, confidential space to reflect, ask questions, and move at your own
          pace — during your first year after an HIV diagnosis.
        </p>

        <div className={styles.trustPills} style={{ justifyContent: "center" }}>
          <div className={styles.trustPill}><span>🔒</span> Confidential</div>
          <div className={styles.trustPill}><span>💛</span> Judgment-free</div>
          <div className={styles.trustPill}><span>⏸️</span> Skip anything</div>
        </div>

        <button
          className={`${styles.btnNext} ${styles.btnNextFull}`}
          onClick={() => router.push("/onboarding/consent")}
        >
          Get started
        </button>
        <p className={styles.skipHint}>Takes about 2 minutes</p>
      </div>
    </div>
  );
}
