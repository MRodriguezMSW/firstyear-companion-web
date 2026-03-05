"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "../styles/Onboarding.module.css";

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

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div style={CONTENT}>
        <p className={styles.eyebrow}>Before we begin</p>
        <h1>A few important notes</h1>

        <ul className={styles.consentList}>
          {[
            "This app is powered by artificial intelligence.",
            "It is not a licensed therapist.",
            "It does not replace medical or mental health care.",
            "It does not diagnose conditions.",
            "If you are in crisis, contact 988 or emergency services.",
            "You can exit at any time.",
          ].map((item) => (
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
            I understand and would like to continue.
          </span>
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnBack} onClick={() => router.back()}>Back</button>
          <button className={styles.btnNext} disabled={!checked} onClick={() => router.push("/onboarding/identity")}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
