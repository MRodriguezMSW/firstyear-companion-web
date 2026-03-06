"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";

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
  const [lang, setLang] = useState<"en" | "es">("en");

  useEffect(() => {
    const saved = localStorage.getItem("companion_language");
    if (saved === "es") setLang("es");
  }, []);

  const setLanguage = (l: "en" | "es") => {
    setLang(l);
    localStorage.setItem("companion_language", l);
  };

  const t = lang === "es" ? {
    eyebrow: "FirstYear Companion",
    body: "Me alegra mucho que estés aquí. Seré tu compañero de bolsillo — para orientación, apoyo y respuestas reales cuando las necesites. No estás solo/a. Estoy aquí contigo.",
    btn: "Comenzar",
  } : {
    eyebrow: "FirstYear Companion",
    body: "I'm really glad you're here. I'll be your pocket buddy — for guidance, support, and real answers whenever you need it. You are not alone. I'm here with you.",
    btn: "Get started",
  };

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div className={styles.betaBanner}>
        Beta &mdash; This app is not a substitute for professional medical care or advice.
      </div>

      <div className={styles.langToggleWrap}>
        <button className={`${styles.langBtn} ${lang === "en" ? styles.langBtnActive : ""}`} onClick={() => setLanguage("en")}>EN</button>
        <span className={styles.langDivider}>|</span>
        <button className={`${styles.langBtn} ${lang === "es" ? styles.langBtnActive : ""}`} onClick={() => setLanguage("es")}>ES</button>
      </div>

      <div style={CONTENT}>
        <div className={styles.onboardingCard}>
          <div className={styles.welcomeIcon}>🌱</div>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: "rgba(245,237,224,.85)", margin: "14px 0 24px" }}>
            {t.body}
          </p>
          <button
            className={`${styles.btnNext} ${styles.btnNextFull}`}
            onClick={() => router.push("/onboarding/consent")}
          >
            {t.btn}
          </button>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
