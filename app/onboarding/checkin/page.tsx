"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getS2 } from "../translations";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";

export default function CheckInPage() {
  const router = useRouter();
  const [lang, setLang] = useState("en-US");
  const [name, setName] = useState("");
  const [journey, setJourney] = useState("");
  const [provider, setProvider] = useState("");
  const [medication, setMedication] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [moods, setMoods] = useState<string[]>([]);
  const [skipFlag, setSkipFlag] = useState(false);
  const [modal, setModal] = useState<"provider" | "meds" | null>(null);

  useEffect(() => {
    // Lock scroll on html/body for this page
    const prevHtml = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("companion_language") ?? "en-US";
    setLang(saved);
  }, []);

  const t = getS2(lang);

  const toggleMood = (m: string) =>
    setMoods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const handleProviderSelect = (opt: string) => {
    setProvider(opt);
    if (opt === t.yesno[1]) setModal("provider");
  };

  const handleMedSelect = (opt: string) => {
    setMedication(opt);
    if (opt === t.yesno[1]) setModal("meds");
  };

  const saveAndGo = () => {
    if (name.trim())  localStorage.setItem("companion_name", name.trim());
    if (journey)      localStorage.setItem("companion_journey", journey);
    if (provider)     localStorage.setItem("companion_provider", provider);
    if (medication)   localStorage.setItem("companion_medication", medication);
    if (pronouns)     localStorage.setItem("companion_pronouns", pronouns);
    localStorage.setItem("companion_moods", JSON.stringify(moods));
    if (skipFlag)     localStorage.setItem("firstyear_skip_checkin", "true");
    localStorage.setItem("onboarding_complete", "true");
    router.push("/chat");
  };

  const lbl: React.CSSProperties = {
    display: "block", fontFamily: "'DM Sans', sans-serif",
    fontSize: 10, fontWeight: 600, color: "rgba(216,208,192,0.5)",
    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6,
  };

  const pill = (active: boolean): React.CSSProperties => ({
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.09)"}`,
    borderRadius: 10, padding: "7px 12px",
    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
    color: active ? "#8ecfbe" : "rgba(216,208,192,0.7)",
    cursor: "pointer", transition: "all 0.15s ease", whiteSpace: "nowrap" as const,
  });

  const yn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.09)"}`,
    borderRadius: 8, padding: "8px 6px",
    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
    color: active ? "#8ecfbe" : "rgba(216,208,192,0.65)",
    cursor: "pointer", textAlign: "center" as const, transition: "all 0.15s ease",
  });

  const chip = (active: boolean): React.CSSProperties => ({
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.09)"}`,
    borderRadius: 16, padding: "5px 11px",
    fontFamily: "'DM Sans', sans-serif", fontSize: 12,
    color: active ? "#8ecfbe" : "rgba(216,208,192,0.7)",
    cursor: "pointer", whiteSpace: "nowrap" as const, transition: "all 0.15s ease",
  });

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      display: "flex", flexDirection: "column",
      overflow: "hidden", background: "var(--bg, #1A2E1E)",
    }}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />

      {/* Modal overlay */}
      {modal && (
        <div className={styles.warmModalOverlay} onClick={() => setModal(null)}>
          <div className={styles.warmModal} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: "var(--text)", marginBottom: 14 }}>
              {modal === "provider" ? "💙" : "🌱"}
            </div>
            <p className={styles.warmModalText}>
              {modal === "provider" ? t.provider_modal : t.meds_modal}
            </p>
            <button className={styles.warmModalBtn} onClick={() => setModal(null)}>
              {modal === "provider" ? t.provider_modal_btn : t.meds_modal_btn}
            </button>
          </div>
        </div>
      )}

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "12px 14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Main card */}
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "16px 18px", flex: 1, display: "flex", flexDirection: "column" }}>

            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 500, color: "var(--text)", margin: "0 0 4px" }}>{t.title}</h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.55)", marginBottom: 16, lineHeight: 1.5 }}>
              {t.sub}
            </p>

            {/* 1. Name */}
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>{t.name_label}</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder={t.name_ph}
                style={{
                  width: "100%", boxSizing: "border-box", height: 36,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 8, padding: "0 12px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text)", outline: "none",
                }}
              />
            </div>

            {/* 2. Journey */}
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>{t.journey_label}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {t.journey_opts.map(opt => (
                  <button key={opt} style={pill(journey === opt)} onClick={() => setJourney(opt)}>{opt}</button>
                ))}
              </div>
            </div>

            {/* 3. Provider */}
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>{t.provider_label}</label>
              <div style={{ display: "flex", gap: 6 }}>
                {t.yesno.slice(0, 2).map(opt => (
                  <button key={opt} style={yn(provider === opt)} onClick={() => handleProviderSelect(opt)}>{opt}</button>
                ))}
              </div>
            </div>

            {/* 4. Medication */}
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>{t.meds_label}</label>
              <div style={{ display: "flex", gap: 6 }}>
                {t.yesno.slice(0, 2).map(opt => (
                  <button key={opt} style={yn(medication === opt)} onClick={() => handleMedSelect(opt)}>{opt}</button>
                ))}
              </div>
            </div>

            {/* 5. Pronouns */}
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>{t.pronouns_label}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {t.pronouns_opts.map(opt => (
                  <button key={opt} style={pill(pronouns === opt)} onClick={() => setPronouns(pronouns === opt ? "" : opt)}>{opt}</button>
                ))}
              </div>
            </div>

            {/* 6. Mood */}
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>{t.mood_label}</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {t.mood_opts.map(opt => (
                  <button key={opt} style={chip(moods.includes(opt))} onClick={() => toggleMood(opt)}>{opt}</button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 14, marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <input type="checkbox" checked={skipFlag} onChange={e => setSkipFlag(e.target.checked)}
                  style={{ accentColor: "#c4956a", width: 13, height: 13, cursor: "pointer" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(216,208,192,0.32)" }}>{t.skip_label}</span>
              </label>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => router.push("/chat")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.45)", cursor: "pointer" }}>
                  {t.skip_btn}
                </button>
                <button onClick={saveAndGo} style={{ background: "linear-gradient(135deg, #c4956a 0%, #a87a52 100%)", border: "none", borderRadius: 8, padding: "9px 24px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#fff", cursor: "pointer", boxShadow: "0 4px 16px rgba(196,149,106,0.3)" }}>
                  {t.start_btn} →
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
