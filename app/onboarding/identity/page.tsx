"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";
import { getStrings, readLang } from "../../i18n";

function dotState(i: number, screen = 1) {
  return i < screen ? "done" : i === screen ? "active" : "pending";
}

const SCREEN: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  overflow: "hidden", padding: "16px",
};
const CONTENT: React.CSSProperties = {
  width: "100%", maxWidth: 480, position: "relative", zIndex: 1,
};

export default function IdentityPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pronoun, setPronoun] = useState("");
  const [t, setT] = useState(() => getStrings("en-US"));

  useEffect(() => { setT(getStrings(readLang())); }, []);

  const handleNext = () => {
    if (name.trim()) localStorage.setItem("companion_userName", name.trim());
    if (pronoun) localStorage.setItem("companion_pronouns", pronoun);
    router.push("/onboarding/timeline");
  };

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div style={CONTENT}>
        <div className={styles.stepDots}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={clsx(styles.dot, styles[dotState(i)])} />
          ))}
        </div>
        <p className={styles.eyebrow}>{t.identity_step}</p>
        <h1>{t.identity_title}</h1>
        <p className={styles.subtitle}>{t.identity_sub}</p>

        <label>{t.identity_name_lbl}</label>
        <input
          className={styles.textInput}
          placeholder={t.identity_name_ph}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>{t.identity_pronoun_lbl}</label>
        <div className={styles.chipGrid}>
          {t.identity_pronouns.map((p) => (
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
          <button className={styles.btnBack} onClick={() => router.back()}>{t.back}</button>
          <button className={styles.btnNext} onClick={handleNext}>{t.continue_}</button>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
