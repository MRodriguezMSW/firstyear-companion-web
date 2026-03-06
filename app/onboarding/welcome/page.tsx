"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";
import { getStrings, readLang } from "../../i18n";

const SCREEN: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  overflow: "hidden", padding: "16px", paddingTop: "56px",
};
const CONTENT: React.CSSProperties = {
  width: "100%", maxWidth: 480, position: "relative", zIndex: 1,
};

export default function WelcomePage() {
  const router = useRouter();
  const [t, setT] = useState(() => getStrings("en-US"));

  useEffect(() => {
    setT(getStrings(readLang()));
  }, []);

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div className={styles.betaBanner}>{t.beta}</div>

      <div style={CONTENT}>
        <div className={styles.onboardingCard}>
          <div className={styles.welcomeIcon}>🌱</div>
          <p className={styles.eyebrow}>FirstYear Companion</p>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(245,237,224,.85)", margin: "14px 0 24px" }}>
            {t.welcome_body}
          </p>
          <button
            className={`${styles.btnNext} ${styles.btnNextFull}`}
            onClick={() => router.push("/onboarding/consent")}
          >
            {t.welcome_btn}
          </button>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
