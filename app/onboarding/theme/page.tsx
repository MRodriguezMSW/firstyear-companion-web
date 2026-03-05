"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "../styles/Onboarding.module.css";

function dotState(i: number, screen = 5) {
  return i < screen ? "done" : i === screen ? "active" : "pending";
}

const THEMES = [
  { id: "forest",   label: "Forest",   icon: "🌲", bg: "#0e1f1b", desc: "Teal & amber" },
  { id: "ocean",    label: "Ocean",    icon: "🌊", bg: "#0a1a2e", desc: "Blue & seafoam" },
  { id: "dusk",     label: "Dusk",     icon: "🌅", bg: "#1e1018", desc: "Rose & gold" },
  { id: "midnight", label: "Midnight", icon: "🌙", bg: "#0d0e1f", desc: "Lavender & silver" },
  { id: "ember",    label: "Ember",    icon: "🍂", bg: "#1a100a", desc: "Burnt orange & brown" },
  { id: "bloom",    label: "Bloom",    icon: "🌸", bg: "#1a1015", desc: "Blush & cream" },
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
  const [selected, setSelected] = useState<ThemeId>("forest");

  useEffect(() => {
    const saved = localStorage.getItem("companion_theme") as ThemeId | null;
    if (saved) setSelected(saved);
  }, []);

  const pick = (id: ThemeId) => {
    setSelected(id);
    document.documentElement.setAttribute("data-theme", id);
  };

  const handleFinish = () => {
    localStorage.setItem("companion_theme", selected);
    router.push("/chat");
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
        <p className={styles.eyebrow}>Step 5 of 5</p>
        <h1>Choose your space</h1>
        <p className={styles.subtitle}>
          Pick the background that feels most comfortable. You can always change it later.
        </p>

        <div className={styles.themeGrid}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              className={clsx(styles.themeSwatch, selected === t.id && styles.themeSwatchActive)}
              onClick={() => pick(t.id)}
            >
              <div className={styles.themeSwatchBg} style={{ background: t.bg }}>
                <span className={styles.themeSwatchIcon}>{t.icon}</span>
              </div>
              <span className={styles.themeSwatchLabel}>{t.label}</span>
              <span className={styles.themeSwatchDesc}>{t.desc}</span>
            </button>
          ))}
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnBack} onClick={() => router.back()}>Back</button>
          <button className={styles.btnNext} onClick={handleFinish}>Start your conversation</button>
        </div>
      </div>
    </div>
  );
}
