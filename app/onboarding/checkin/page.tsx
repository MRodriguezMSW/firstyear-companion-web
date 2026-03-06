"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { intensityLabel } from "../data";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";
import { getStrings, readLang } from "../../i18n";

function dotState(i: number, screen = 3) {
  return i < screen ? "done" : i === screen ? "active" : "pending";
}

const SCREEN: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  display: "flex", flexDirection: "column", overflow: "hidden",
};
const SCROLL: React.CSSProperties = {
  flex: 1, overflowY: "auto", overscrollBehavior: "none",
  WebkitOverflowScrolling: "touch" as any,
  padding: "20px 16px 16px",
  display: "flex", flexDirection: "column", alignItems: "center",
};
const CONTENT: React.CSSProperties = {
  width: "100%", maxWidth: 480, position: "relative", zIndex: 1,
};

export default function CheckInPage() {
  const router = useRouter();
  const [intensity, setIntensity] = useState(5);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [t, setT] = useState(() => getStrings("en-US"));
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setT(getStrings(readLang()));
    const el = sliderRef.current;
    if (!el) return;
    const handleTouchMove = (e: TouchEvent) => { e.stopPropagation(); e.preventDefault(); };
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", handleTouchMove);
  }, []);

  const toggle = (e: string) =>
    setEmotions((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);

  const handleNext = () => {
    localStorage.setItem("companion_intensity", String(intensity));
    localStorage.setItem("companion_emotions", JSON.stringify(emotions));
    if (freeText.trim()) localStorage.setItem("companion_note", freeText.trim());
    router.push("/onboarding/avatar");
  };

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div style={SCROLL}>
        <div style={CONTENT}>
          <div className={styles.stepDots}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={clsx(styles.dot, styles[dotState(i)])} />
            ))}
          </div>
          <p className={styles.eyebrow}>{t.checkin_step}</p>
          <h1 style={{ fontSize: 18, marginBottom: 4 }}>{t.checkin_title}</h1>
          <p className={styles.subtitle} style={{ marginBottom: 12 }}>{t.checkin_sub}</p>

          <div ref={sliderRef} className={styles.sliderWrap} style={{ touchAction: "none" }}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>{t.checkin_intensity_lbl}</span>
              <span className={styles.sliderValue}>{intensityLabel(intensity)} · {intensity}/10</span>
            </div>
            <input
              type="range" min={0} max={10} value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              style={{ touchAction: "none" }}
            />
            <div className={styles.sliderHints}>
              <span>{t.checkin_calm}</span>
              <span>{t.checkin_intense}</span>
            </div>
          </div>

          <div className={styles.sectionLabel} style={{ marginBottom: 6 }}>{t.checkin_emotions_lbl}</div>
          <div className={styles.emotionGrid} style={{ gap: 6 }}>
            {t.checkin_emotions.map((e, i) => (
              <button
                key={e}
                className={clsx(styles.emotionChip, emotions.includes(e) && styles.selected, i === t.checkin_emotions.length - 1 && styles.full)}
                onClick={() => toggle(e)}
              >
                {e}
              </button>
            ))}
          </div>

          <label style={{ marginBottom: 4 }}>{t.checkin_freetext_lbl}</label>
          <textarea
            placeholder={t.checkin_freetext_ph}
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            style={{ minHeight: 60, marginBottom: 4 }}
          />
          <p className={styles.textareaHint}>{t.checkin_hint}</p>

          <div className={styles.btnRow}>
            <button className={styles.btnBack} onClick={() => router.back()}>{t.back}</button>
            <button className={styles.btnNext} onClick={handleNext}>{t.continue_}</button>
          </div>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
