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
  overflow: "hidden", padding: "16px",
};
const CONTENT: React.CSSProperties = {
  width: "100%", maxWidth: 480, position: "relative", zIndex: 1,
};

export default function ConsentPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [t, setT] = useState(() => getStrings("en-US"));

  useEffect(() => {
    setT(getStrings(readLang()));
  }, []);

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div style={CONTENT}>
        <div className={styles.onboardingCard}>
          <p className={styles.eyebrow}>{t.consent_eyebrow}</p>
          <h1>{t.consent_title}</h1>

          <ul className={styles.consentList}>
            {t.consent_bullets.map((item) => (
              <li key={item} className={styles.consentItem}>
                <span className={styles.consentBullet}>•</span>
                {item}
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 20 }}>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              style={{ flexShrink: 0, width: 18, height: 18, marginTop: 2, accentColor: "#c4956a" }}
            />
            <span
              style={{ fontSize: 14, lineHeight: 1.6, color: checked ? "#f5ede0" : "rgba(245,237,224,0.65)", cursor: "pointer" }}
              onClick={() => setChecked((v) => !v)}
            >
              {t.consent_checkbox}
            </span>
          </div>

          <div className={styles.btnRow}>
            <button className={styles.btnBack} onClick={() => router.back()}>{t.back}</button>
            <button className={styles.btnNext} disabled={!checked} onClick={() => router.push("/onboarding/identity")}>
              {t.continue_}
            </button>
          </div>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
