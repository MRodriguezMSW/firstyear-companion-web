"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { intensityLabel } from "../data";
import styles from "../styles/Onboarding.module.css";

const EMOTIONS = ["Anxious", "Sad", "Overwhelmed", "Numb", "Angry", "Lonely", "Tired", "Hopeful", "Okay"];

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
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
          <p className={styles.eyebrow}>Step 3 of 5</p>
          <h1 style={{ fontSize: 18, marginBottom: 4 }}>How are you feeling right now?</h1>
          <p className={styles.subtitle} style={{ marginBottom: 12 }}>This helps me meet you where you are. Skip anything.</p>

          <div ref={sliderRef} className={styles.sliderWrap} style={{ touchAction: "none" }}>
            <div className={styles.sliderHeader}>
              <span className={styles.sliderLabel}>Emotional intensity</span>
              <span className={styles.sliderValue}>{intensityLabel(intensity)} · {intensity}/10</span>
            </div>
            <input
              type="range" min={0} max={10} value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              style={{ touchAction: "none" }}
            />
            <div className={styles.sliderHints}>
              <span>0 · Calm</span>
              <span>10 · Feels unbearable</span>
            </div>
          </div>

          <div className={styles.sectionLabel} style={{ marginBottom: 6 }}>What's present for you?</div>
          <div className={styles.emotionGrid} style={{ gap: 6 }}>
            {EMOTIONS.map((e, i) => (
              <button
                key={e}
                className={clsx(styles.emotionChip, emotions.includes(e) && styles.selected, i === 8 && styles.full)}
                onClick={() => toggle(e)}
              >
                {e}
              </button>
            ))}
          </div>

          <label style={{ marginBottom: 4 }}>Anything you want to share right now?</label>
          <textarea
            placeholder="You can write a sentence or two..."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            style={{ minHeight: 60, marginBottom: 4 }}
          />
          <p className={styles.textareaHint}>Avoid names, phone numbers, or anything identifying.</p>

          <div className={styles.btnRow}>
            <button className={styles.btnBack} onClick={() => router.back()}>Back</button>
            <button className={styles.btnNext} onClick={handleNext}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}
