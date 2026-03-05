"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { intensityLabel } from "../data";
import styles from "../styles/Onboarding.module.css";

const EMOTIONS = ["Anxious", "Sad", "Overwhelmed", "Numb", "Angry", "Lonely", "Tired", "Hopeful", "Okay"];

function dotState(i: number, screen = 3) {
  return i < screen ? "done" : i === screen ? "active" : "pending";
}

export default function CheckInPage() {
  const router = useRouter();
  const [intensity, setIntensity] = useState(5);
  const [emotions, setEmotions] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");

  const toggle = (e: string) =>
    setEmotions((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]);

  const handleNext = () => {
    localStorage.setItem("companion_intensity", String(intensity));
    localStorage.setItem("companion_emotions", JSON.stringify(emotions));
    if (freeText.trim()) localStorage.setItem("companion_note", freeText.trim());
    router.push("/onboarding/avatar");
  };

  return (
    <div className={styles.fycRoot}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div className={styles.card}>
        <div className={styles.stepDots}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={clsx(styles.dot, styles[dotState(i)])} />
          ))}
        </div>
        <p className={styles.eyebrow}>Step 3 of 4</p>
        <h1>How are you feeling right now?</h1>
        <p className={styles.subtitle}>This helps me meet you where you are. Skip anything.</p>

        <div className={styles.sliderWrap}>
          <div className={styles.sliderHeader}>
            <span className={styles.sliderLabel}>Emotional intensity</span>
            <span className={styles.sliderValue}>{intensityLabel(intensity)} · {intensity}/10</span>
          </div>
          <input
            type="range" min={0} max={10} value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
          <div className={styles.sliderHints}>
            <span>0 · Calm</span>
            <span>10 · Feels unbearable</span>
          </div>
        </div>

        <div className={styles.sectionLabel} style={{ marginBottom: 10 }}>What's present for you?</div>
        <div className={styles.emotionGrid}>
          {EMOTIONS.map((e, i) => (
            <button
              key={e}
              className={clsx(
                styles.emotionChip,
                emotions.includes(e) && styles.selected,
                i === 8 && styles.full
              )}
              onClick={() => toggle(e)}
            >
              {e}
            </button>
          ))}
        </div>

        <label>Anything you want to share right now?</label>
        <textarea
          placeholder="You can write a sentence or two..."
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
        />
        <p className={styles.textareaHint}>Avoid names, phone numbers, or anything identifying.</p>

        <div className={styles.btnRow}>
          <button className={styles.btnBack} onClick={() => router.back()}>Back</button>
          <button className={styles.btnNext} onClick={handleNext}>Continue</button>
        </div>
      </div>
    </div>
  );
}
