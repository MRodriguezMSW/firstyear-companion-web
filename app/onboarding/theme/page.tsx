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
  { id: "hopeful",  icon: "🌸", bg: "#FFF0F5" },
  { id: "sunrise",  icon: "☀️", bg: "#FFF8EE" },
  { id: "peaceful", icon: "🌿", bg: "#F0FAF4" },
  { id: "calm",     icon: "🌊", bg: "#EFF8FF" },
  { id: "free",     icon: "🦋", bg: "#F5F0FF" },
  { id: "bloom",    icon: "🌺", bg: "#FFF4F0" },
  { id: "bright",   icon: "🌻", bg: "#FFFDE7" },
  { id: "soft",     icon: "🕊️", bg: "#F5F5F5" },
  { id: "joy",      icon: "🌈", bg: "#FFF9F0" },
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
