"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import styles from "../styles/Onboarding.module.css";

const PRONOUNS = ["She/her", "He/him", "They/them", "Use my name only", "Prefer not to say"];

function dotState(i: number, screen = 1) {
  return i < screen ? "done" : i === screen ? "active" : "pending";
}

export default function IdentityPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pronoun, setPronoun] = useState("");

  const handleNext = () => {
    if (name.trim()) localStorage.setItem("companion_userName", name.trim());
    if (pronoun) localStorage.setItem("companion_pronouns", pronoun);
    router.push("/onboarding/timeline");
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
        <p className={styles.eyebrow}>Step 1 of 4</p>
        <h1>How would you like me to address you?</h1>
        <p className={styles.subtitle}>Everything here is optional. Use whatever feels right.</p>

        <label>Name or nickname</label>
        <input
          className={styles.textInput}
          placeholder="What should I call you?"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Pronouns</label>
        <div className={styles.chipGrid}>
          {PRONOUNS.map((p) => (
            <button
              key={p}
              className={clsx(styles.chip, pronoun === p && styles.selected)}
              onClick={() => setPronoun(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnBack} onClick={() => router.back()}>Back</button>
          <button className={styles.btnNext} onClick={handleNext}>Continue</button>
        </div>
      </div>
    </div>
  );
}
