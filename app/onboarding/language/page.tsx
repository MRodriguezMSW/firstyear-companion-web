"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LANGUAGE_OPTIONS, type LangCode, getStrings } from "../../i18n";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";

const SCREEN: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  overflow: "hidden", padding: "16px",
};
const CONTENT: React.CSSProperties = {
  width: "100%", maxWidth: 480, position: "relative", zIndex: 1,
};

export default function LanguagePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<LangCode>("en-US");

  const t = getStrings(selected);

  const handleContinue = () => {
    localStorage.setItem("companion_language", selected);
    router.push("/onboarding/welcome");
  };

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div style={CONTENT}>
        <div className={styles.onboardingCard}>
          <div className={styles.welcomeIcon}>🌍</div>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 18, color: "#f5ede0", marginBottom: 8, lineHeight: 1.3 }}>
            {getStrings("en-US").lang_title}
          </h1>
          <p className={styles.subtitle} style={{ marginBottom: 16 }}>{t.lang_sub}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 20 }}>
            {LANGUAGE_OPTIONS.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelected(lang.code as LangCode)}
                style={{
                  background: selected === lang.code ? "rgba(74,124,111,0.2)" : "rgba(255,248,235,0.04)",
                  border: `1px solid ${selected === lang.code ? "rgba(74,124,111,0.6)" : "rgba(255,248,235,0.1)"}`,
                  borderRadius: 12,
                  padding: "11px 10px",
                  color: selected === lang.code ? "#8ecfbe" : "rgba(245,237,224,0.7)",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 12, fontWeight: 500,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "all 0.15s ease",
                  lineHeight: 1.3,
                }}
              >
                <span style={{ fontSize: 17, flexShrink: 0 }}>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>

          <button
            className={`${styles.btnNext} ${styles.btnNextFull}`}
            onClick={handleContinue}
          >
            {t.lang_btn}
          </button>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
