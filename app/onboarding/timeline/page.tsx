"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { daysSince, diagnosisContext } from "../data";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();

const DX_RANGES = [
  ["Within the last 3 months", "New diagnosis · early adjustment"],
  ["3–12 months ago",           "Still within the first year"    ],
  ["1–3 years ago",             "Building stability and routine" ],
  ["More than 3 years ago",     "Longer-term management"         ],
  ["Prefer not to say",         ""                               ],
] as const;

const YN = ["Yes", "No"] as const;

function dotState(i: number, screen = 2) {
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

export default function TimelinePage() {
  const router = useRouter();
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [timeline, setTimeline] = useState("");
  const [onMeds, setOnMeds] = useState("");
  const [hasProvider, setHasProvider] = useState("");
  const [narrowScreen, setNarrowScreen] = useState(false);
  const [ddMonth, setDdMonth] = useState("");
  const [ddDay,   setDdDay]   = useState("");
  const [ddYear,  setDdYear]  = useState("");

  // Modal state
  const [medsModal, setMedsModal]         = useState(false);
  const [providerModal, setProviderModal] = useState(false);
  const [medsAnswered, setMedsAnswered]   = useState(false);

  const days  = daysSince(diagnosisDate);
  const dxCtx = diagnosisContext(days);

  useEffect(() => {
    const check = () => setNarrowScreen(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (ddMonth && ddDay && ddYear) {
      const m = String(MONTHS.indexOf(ddMonth) + 1).padStart(2, "0");
      const d = ddDay.padStart(2, "0");
      setDiagnosisDate(`${ddYear}-${m}-${d}`);
      setTimeline("");
    }
  }, [ddMonth, ddDay, ddYear]);

  const daysInMonth = ddMonth && ddYear
    ? new Date(parseInt(ddYear), MONTHS.indexOf(ddMonth) + 1, 0).getDate()
    : 31;

  const saveAndProceed = () => {
    if (diagnosisDate) localStorage.setItem("companion_diagnosisDate", diagnosisDate);
    if (timeline)      localStorage.setItem("companion_timeline", timeline);
    if (onMeds)        localStorage.setItem("companion_onMeds", onMeds);
    if (hasProvider)   localStorage.setItem("companion_hasProvider", hasProvider);
    localStorage.setItem("companion_needsProvider",  String(hasProvider === "No"));
    localStorage.setItem("companion_wantsMedsIntro", String(onMeds === "No" && medsAnswered));
    router.push("/onboarding/checkin");
  };

  const handleMedsNo = () => {
    setOnMeds("No");
    setMedsModal(true);
  };

  const handleProviderNo = () => {
    setHasProvider("No");
    setProviderModal(true);
  };

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      {/* Meds No modal */}
      {medsModal && (
        <div className={styles.warmModalOverlay}>
          <div className={styles.warmModal}>
            <p className={styles.warmModalText}>
              That is okay — starting medications is a big decision and there is no rush. When you are ready I will walk you through everything at your pace. No pressure, just support.
            </p>
            <button
              className={styles.warmModalBtn}
              onClick={() => { setMedsAnswered(true); setMedsModal(false); }}
            >
              Got it, let's continue
            </button>
          </div>
        </div>
      )}

      {/* Provider No modal */}
      {providerModal && (
        <div className={styles.warmModalOverlay}>
          <div className={styles.warmModal}>
            <p className={styles.warmModalText}>
              You do not have to figure this out alone. When we get to the chat just say the word and we will find someone safe, private, and friendly near you. You have already taken a brave step just by being here.
            </p>
            <button
              className={styles.warmModalBtn}
              onClick={() => setProviderModal(false)}
            >
              I'm ready, let's go
            </button>
          </div>
        </div>
      )}

      <div style={SCROLL}>
        <div style={CONTENT}>
          <div className={styles.stepDots}>
            {[1, 2, 3, 4, 5].map((i) => (
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
          {narrowScreen ? (
            <div className={styles.dateDropdownRow}>
              <select className={styles.dateDropdown} value={ddMonth} onChange={e => setDdMonth(e.target.value)}>
                <option value="">Month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m.slice(0,3)}</option>)}
              </select>
              <select className={styles.dateDropdown} value={ddDay} onChange={e => setDdDay(e.target.value)}>
                <option value="">Day</option>
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => (
                  <option key={d} value={String(d)}>{d}</option>
                ))}
              </select>
              <select className={styles.dateDropdown} value={ddYear} onChange={e => setDdYear(e.target.value)}>
                <option value="">Year</option>
                {Array.from({ length: 10 }, (_, i) => currentYear - i).map(y => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
            </div>
          ) : (
            <input
              type="date"
              className={styles.dateInput}
              max={new Date().toISOString().split("T")[0]}
              value={diagnosisDate}
              onChange={(e) => { setDiagnosisDate(e.target.value); setTimeline(""); }}
            />
          )}
          {dxCtx && (
            <div className={styles.diagnosisContext}>
              <div className={styles.diagnosisContextLabel} style={{ color: dxCtx.color }}>{dxCtx.label}</div>
              <div style={{ color: "rgba(245,237,224,0.5)", fontSize: 12 }}>{dxCtx.note}</div>
            </div>
          )}

          <div className={styles.dateInputWrap} style={{ marginTop: 8, paddingTop: 8 }}>
            <p className={styles.dateInvite} style={{ marginBottom: 8 }}>Don't remember the exact date? Pick a range instead.</p>
            <div className={styles.dxGrid}>
              {DX_RANGES.slice(0, 4).map(([lbl, sub]) => (
                <button
                  key={lbl}
                  className={clsx(styles.dxCell, timeline === lbl && styles.selected)}
                  onClick={() => { setTimeline(lbl); setDiagnosisDate(""); }}
                >
                  <span className={styles.dxCellLabel}>{lbl}</span>
                  {sub && <span className={styles.chipSub}>{sub}</span>}
                </button>
              ))}
            </div>
            <button
              className={clsx(styles.dxPreferNot, timeline === "Prefer not to say" && styles.selected)}
              onClick={() => { setTimeline("Prefer not to say"); setDiagnosisDate(""); }}
            >
              Prefer not to say
            </button>
          </div>

          <div className={styles.sectionLabel} style={{ marginBottom: 8 }}>Are you currently on HIV medication?</div>
          <div className={styles.yesnoRow} style={{ marginBottom: 16 }}>
            <button
              className={clsx(styles.ynChip, onMeds === "Yes" && styles.selected)}
              onClick={() => setOnMeds("Yes")}
            >
              Yes
            </button>
            <button
              className={clsx(styles.ynChip, onMeds === "No" && styles.selected)}
              onClick={handleMedsNo}
            >
              No
            </button>
          </div>

          <div className={styles.sectionLabel} style={{ marginBottom: 8 }}>Do you have an HIV provider right now?</div>
          <div className={styles.yesnoRow} style={{ marginBottom: 16 }}>
            <button
              className={clsx(styles.ynChip, hasProvider === "Yes" && styles.selected)}
              onClick={() => setHasProvider("Yes")}
            >
              Yes
            </button>
            <button
              className={clsx(styles.ynChip, hasProvider === "No" && styles.selected)}
              onClick={handleProviderNo}
            >
              No
            </button>
          </div>

          <div className={styles.btnRow}>
            <button className={styles.btnBack} onClick={() => router.back()}>Back</button>
            <button className={styles.btnNext} onClick={saveAndProceed}>Continue</button>
          </div>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
