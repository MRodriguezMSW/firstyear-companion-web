"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { daysSince, diagnosisContext } from "../data";
import styles from "../styles/Onboarding.module.css";

const DX_RANGES = [
  ["Within the last 3 months", "New diagnosis · early adjustment"],
  ["3–12 months ago",           "Still within the first year"    ],
  ["1–3 years ago",             "Building stability and routine" ],
  ["More than 3 years ago",     "Longer-term management"         ],
  ["Prefer not to say",         ""                               ],
] as const;

const YN = ["Yes", "No", "Not sure"] as const;

function dotState(i: number, screen = 2) {
  return i < screen ? "done" : i === screen ? "active" : "pending";
}

export default function TimelinePage() {
  const router = useRouter();
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [timeline, setTimeline] = useState("");
  const [onMeds, setOnMeds] = useState("");
  const [hasProvider, setHasProvider] = useState("");

  const days  = daysSince(diagnosisDate);
  const dxCtx = diagnosisContext(days);
  const showBanner = onMeds === "No" || hasProvider === "No";

  const handleNext = () => {
    if (diagnosisDate) localStorage.setItem("companion_diagnosisDate", diagnosisDate);
    if (timeline) localStorage.setItem("companion_timeline", timeline);
    if (onMeds) localStorage.setItem("companion_onMeds", onMeds);
    if (hasProvider) localStorage.setItem("companion_hasProvider", hasProvider);
    localStorage.setItem("companion_needsProvider", String(showBanner));
    router.push("/onboarding/checkin");
  };

  return (
    <div className={styles.fycRoot}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div className={styles.card} style={{ padding: "20px 24px" }}>
        <div className={styles.stepDots}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={clsx(styles.dot, styles[dotState(i)])} />
          ))}
        </div>
        <p className={styles.eyebrow}>Step 2 of 4</p>
        <h1>A quick check-in</h1>
        <p className={styles.subtitle}>This helps me tailor my support to where you are, but is optional.</p>

        <div className={styles.sectionLabel} style={{ marginBottom: 8 }}>
          When were you diagnosed?{" "}
          <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: 0, color: "rgba(245,237,224,.28)" }}>(Optional)</span>
        </div>
        <p className={styles.dateInvite} style={{ marginBottom: 8 }}>
          If you remember the date, enter it here — it helps me understand exactly where you are.
        </p>
        <input
          type="date"
          className={styles.dateInput}
          max={new Date().toISOString().split("T")[0]}
          value={diagnosisDate}
          onChange={(e) => { setDiagnosisDate(e.target.value); setTimeline(""); }}
        />
        {dxCtx && (
          <div className={styles.diagnosisContext}>
            <div className={styles.diagnosisContextLabel} style={{ color: dxCtx.color }}>{dxCtx.label}</div>
            <div style={{ color: "rgba(245,237,224,0.5)", fontSize: 12 }}>{dxCtx.note}</div>
          </div>
        )}

        <div className={styles.dateInputWrap} style={{ marginTop: 8, paddingTop: 8 }}>
          <p className={styles.dateInvite} style={{ marginBottom: 8 }}>Don't remember the exact date? Pick a range instead.</p>
          <div className={styles.chipGrid} style={{ gap: 5, marginBottom: 8 }}>
            {DX_RANGES.map(([lbl, sub]) => (
              <button
                key={lbl}
                className={clsx(styles.chip, styles.chipSm, timeline === lbl && styles.selected)}
                onClick={() => { setTimeline(lbl); setDiagnosisDate(""); }}
              >
                {lbl}
                {sub && <span className={styles.chipSub}>{sub}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.sectionLabel} style={{ marginBottom: 8 }}>Are you currently on HIV medication?</div>
        <div className={styles.yesnoRow} style={{ marginBottom: 8 }}>
          {YN.map((v) => (
            <button
              key={v}
              className={clsx(styles.ynChip, onMeds === v && styles.selected)}
              onClick={() => setOnMeds(v)}
            >
              {v}
            </button>
          ))}
        </div>

        <div className={styles.sectionLabel} style={{ marginBottom: 8 }}>Do you have an HIV provider right now?</div>
        <div className={styles.yesnoRow} style={{ marginBottom: 8 }}>
          {YN.map((v) => (
            <button
              key={v}
              className={clsx(styles.ynChip, hasProvider === v && styles.selected)}
              onClick={() => setHasProvider(v)}
            >
              {v}
            </button>
          ))}
        </div>

        {showBanner && (
          <div className={styles.providerBanner}>
            <strong>Finding care is a big step — we can help.</strong>
            After this, I can help you find an HIV provider or clinic near you. You're not on your own with this.
          </div>
        )}

        <div className={styles.btnRow}>
          <button className={styles.btnBack} onClick={() => router.back()}>Back</button>
          <button className={styles.btnNext} onClick={handleNext}>Continue</button>
        </div>
      </div>
    </div>
  );
}
