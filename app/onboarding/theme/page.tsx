"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";
import { getStrings, readLang } from "../../i18n";

function dotState(i: number, screen = 5) {
  return i < screen ? "done" : i === screen ? "active" : "pending";
}

const THEMES = [
  { id: "hopeful",  icon: "🌸", bg: "#6B1E35" },
  { id: "sunrise",  icon: "☀️", bg: "#7A4410" },
  { id: "peaceful", icon: "🌿", bg: "#1A5438" },
  { id: "calm",     icon: "🌊", bg: "#1A3F62" },
  { id: "free",     icon: "🦋", bg: "#35245C" },
  { id: "bloom",    icon: "🌺", bg: "#7A2510" },
  { id: "bright",   icon: "🌻", bg: "#5C4A00" },
  { id: "soft",     icon: "🕊️", bg: "#3A3A3A" },
  { id: "joy",      icon: "🌈", bg: "#5E3508" },
] as const;

type ThemeId = typeof THEMES[number]["id"];

const SCREEN: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  overflow: "hidden", padding: "16px",
};
const CONTENT: React.CSSProperties = {
  width: "100%", maxWidth: 480, position: "relative", zIndex: 1,
};

export default function ThemePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<ThemeId>("hopeful");
  const [t, setT] = useState(() => getStrings("en-US"));

  useEffect(() => {
    setT(getStrings(readLang()));
    const saved = localStorage.getItem("companion_theme") as ThemeId | null;
    if (saved && THEMES.find(th => th.id === saved)) setSelected(saved);
  }, []);

  const pick = (id: ThemeId) => {
    setSelected(id);
    document.documentElement.setAttribute("data-theme", id);
  };

  const handleFinish = () => {
    localStorage.setItem("companion_theme", selected);
    router.push("/onboarding/instructions");
  };

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div style={CONTENT}>
        <div className={styles.stepDots}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={clsx(styles.dot, styles[dotState(i)])} />
          ))}
        </div>
        <p className={styles.eyebrow}>{t.theme_step}</p>
        <h1>{t.theme_title}</h1>
        <p className={styles.subtitle}>{t.theme_sub}</p>

        <div className={styles.themeGrid}>
          {THEMES.map((th, idx) => {
            const name = t.theme_names[idx];
            return (
              <button
                key={th.id}
                className={clsx(styles.themeSwatch, selected === th.id && styles.themeSwatchActive)}
                onClick={() => pick(th.id)}
              >
                <div className={styles.themeSwatchBg} style={{ background: th.bg }}>
                  <span className={styles.themeSwatchIcon}>{th.icon}</span>
                </div>
                <span className={styles.themeSwatchLabel}>{name?.label ?? th.id}</span>
                <span className={styles.themeSwatchDesc}>{name?.desc ?? ""}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnBack} onClick={() => router.back()}>{t.back}</button>
          <button className={styles.btnNext} onClick={handleFinish}>{t.theme_btn}</button>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
