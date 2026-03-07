"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import { daysSince, diagnosisContext } from "../data";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";
import { getStrings, readLang } from "../../i18n";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentYear = new Date().getFullYear();
const DX_RANGE_SUBS = ["New diagnosis · early adjustment", "Still within the first year", "Building stability and routine", "Longer-term management"];

function dotState(i: number, screen = 2) {
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

export default function TimelinePage() {
  const router = useRouter();
  const [diagnosisDate, setDiagnosisDate] = useState("");
  const [timeline, setTimeline] = useState("");
  const [onMeds, setOnMeds] = useState("");
  const [hasProvider, setHasProvider] = useState("");
  const [ddMonth, setDdMonth] = useState("");
  const [ddDay,   setDdDay]   = useState("");
  const [ddYear,  setDdYear]  = useState("");
  const [medsModal, setMedsModal]         = useState(false);
  const [providerModal, setProviderModal] = useState(false);
  const [medsAnswered, setMedsAnswered]   = useState(false);
  const [t, setT] = useState(() => getStrings("en-US"));
  const [isEn, setIsEn] = useState(true);

  useEffect(() => {
    const lang = readLang();
    setT(getStrings(lang));
    setIsEn(lang.startsWith("en"));
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

  const days  = daysSince(diagnosisDate);
  const dxCtx = diagnosisContext(days);

  const saveAndProceed = () => {
    if (diagnosisDate) localStorage.setItem("companion_diagnosisDate", diagnosisDate);
    if (timeline)      localStorage.setItem("companion_timeline", timeline);
    if (onMeds)        localStorage.setItem("companion_onMeds", onMeds);
    if (hasProvider)   localStorage.setItem("companion_hasProvider", hasProvider);
    localStorage.setItem("companion_needsProvider",  String(hasProvider === "No" || hasProvider === t.no));
    localStorage.setItem("companion_wantsMedsIntro", String((onMeds === "No" || onMeds === t.no) && medsAnswered));
    router.push("/onboarding/checkin");
  };

  const handleMedsNo = () => {
    setOnMeds(t.no);
    setMedsModal(true);
  };

  const handleProviderNo = () => {
    setHasProvider(t.no);
    setProviderModal(true);
  };

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      {medsModal && (
        <div className={styles.warmModalOverlay}>
          <div className={styles.warmModal}>
            <p className={styles.warmModalText}>{t.timeline_meds_modal}</p>
            <button className={styles.warmModalBtn} onClick={() => { setMedsAnswered(true); setMedsModal(false); }}>
              {t.timeline_meds_btn}
            </button>
          </div>
        </div>
      )}

      {providerModal && (
        <div className={styles.warmModalOverlay}>
          <div className={styles.warmModal}>
            <p className={styles.warmModalText}>{t.timeline_provider_modal}</p>
            <button className={styles.warmModalBtn} onClick={() => setProviderModal(false)}>
              {t.timeline_provider_btn}
            </button>
          </div>
        </div>
      )}

      <div style={CONTENT}>
        <div className={styles.stepDots} style={{ marginBottom: 6 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={clsx(styles.dot, styles[dotState(i)])} />
          ))}
        </div>
        <p className={styles.eyebrow}>{t.timeline_step}</p>
        <h1 style={{ fontSize: 17, marginBottom: 3 }}>{t.timeline_title}</h1>
        <p className={styles.subtitle} style={{ fontSize: 12, marginBottom: 6 }}>{t.timeline_sub}</p>

        <div className={styles.sectionLabel} style={{ marginBottom: 3 }}>
          {t.timeline_date_lbl}{" "}
          <span style={{ fontWeight: 300, textTransform: "none", letterSpacing: 0, color: "rgba(245,237,224,.28)" }}>({t.optional})</span>
        </div>
        <p className={styles.dateInvite} style={{ marginBottom: 4 }}>{t.timeline_date_invite}</p>

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
        <button
          onClick={() => {
            const now = new Date();
            setDdMonth(MONTHS[now.getMonth()]);
            setDdDay(String(now.getDate()));
            setDdYear(String(now.getFullYear()));
            setTimeline("");
          }}
          style={{
            marginTop: 6, width: "100%", background: "rgba(196,149,106,.12)",
            border: "1px solid rgba(196,149,106,.3)", borderRadius: 10,
            color: "rgba(245,237,224,.7)", fontSize: 13, padding: "8px 12px",
            cursor: "pointer", letterSpacing: "0.02em",
          }}
        >
          📅 I was diagnosed today
        </button>

        {dxCtx && (
          <div className={styles.diagnosisContext} style={{ marginTop: 4, marginBottom: 4, padding: "7px 12px" }}>
            <div className={styles.diagnosisContextLabel} style={{ color: dxCtx.color }}>{dxCtx.label}</div>
            <div style={{ color: "rgba(245,237,224,0.5)", fontSize: 11 }}>{dxCtx.note}</div>
          </div>
        )}

        <div className={styles.dateInputWrap} style={{ marginTop: 4, paddingTop: 4 }}>
          <p className={styles.dateInvite} style={{ marginBottom: 4 }}>{t.timeline_range_invite}</p>
          <div className={styles.dxGrid} style={{ gap: 4, marginBottom: 2 }}>
            {t.timeline_ranges.map((lbl, idx) => (
              <button
                key={lbl}
                className={clsx(styles.dxCell, timeline === lbl && styles.selected)}
                style={{ padding: "7px 8px" }}
                onClick={() => { setTimeline(lbl); setDiagnosisDate(""); }}
              >
                <span className={styles.dxCellLabel}>{lbl}</span>
                {isEn && <span className={styles.chipSub}>{DX_RANGE_SUBS[idx]}</span>}
              </button>
            ))}
          </div>
          <button
            className={clsx(styles.dxPreferNot, timeline === t.timeline_prefer_not && styles.selected)}
            style={{ padding: "2px 0 4px" }}
            onClick={() => { setTimeline(t.timeline_prefer_not); setDiagnosisDate(""); }}
          >
            {t.timeline_prefer_not}
          </button>
        </div>

        <div className={styles.sectionLabel} style={{ marginBottom: 3 }}>{t.timeline_meds_lbl}</div>
        <div className={styles.yesnoRow} style={{ marginBottom: 8 }}>
          <button className={clsx(styles.ynChip, (onMeds === t.yes || onMeds === "Yes") && styles.selected)} onClick={() => setOnMeds(t.yes)}>{t.yes}</button>
          <button className={clsx(styles.ynChip, (onMeds === t.no || onMeds === "No") && styles.selected)} onClick={handleMedsNo}>{t.no}</button>
        </div>

        <div className={styles.sectionLabel} style={{ marginBottom: 3 }}>{t.timeline_provider_lbl}</div>
        <div className={styles.yesnoRow} style={{ marginBottom: 8 }}>
          <button className={clsx(styles.ynChip, (hasProvider === t.yes || hasProvider === "Yes") && styles.selected)} onClick={() => setHasProvider(t.yes)}>{t.yes}</button>
          <button className={clsx(styles.ynChip, (hasProvider === t.no || hasProvider === "No") && styles.selected)} onClick={handleProviderNo}>{t.no}</button>
        </div>

        <div className={styles.btnRow}>
          <button className={styles.btnBack} onClick={() => router.back()}>{t.back}</button>
          <button className={styles.btnNext} onClick={saveAndProceed}>{t.continue_}</button>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
