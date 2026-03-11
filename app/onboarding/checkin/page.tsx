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
  const [companionName, setCompanionName] = useState("Nova");
  const [customCompanionName, setCustomCompanionName] = useState("");

  const COMPANION_NAMES = ["Nova", "Luna", "Sage", "Mia", "Lea", "Aria", "Ember", "Wren", "Ivy", "Rio"];
  const isCustom = companionName === "__custom__";

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
    if (name.trim())  localStorage.setItem("user_name", name.trim());
    const finalCompanionName = isCustom
      ? (customCompanionName.trim() || "Nova")
      : companionName;
    localStorage.setItem("companion_name", finalCompanionName);
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
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "color-mix(in srgb, var(--text) 55%, transparent)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 6,
  };

  const pill = (active: boolean): React.CSSProperties => ({
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.3)"}`,
    borderRadius: 10,
    padding: "6px 12px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    color: active ? "#8ecfbe" : "var(--text)",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap" as const,
  });

  const yn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.3)"}`,
    borderRadius: 8,
    padding: "8px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: active ? "#8ecfbe" : "var(--text)",
    cursor: "pointer",
    textAlign: "center" as const,
    transition: "all 0.15s ease",
  });

  const chip = (active: boolean): React.CSSProperties => ({
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.3)"}`,
    borderRadius: 16,
    padding: "6px 10px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    color: active ? "#8ecfbe" : "var(--text)",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    transition: "all 0.15s ease",
  });

  return (
    <>
      <style>{`
        @media (max-width: 479px) {
          .checkin-card {
            width: 100% !important;
            border-radius: 0 !important;
            padding: 20px 16px !important;
            overflow-y: auto !important;
          }
        }
      `}</style>

      {/* Page wrapper — fixed, centered, no scroll */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        background: "var(--bg, #1A2E1E)",
        color: "var(--text)",
        overflow: "hidden",
        padding: "24px 0",
      }}>

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

        {/* Card */}
        <div
          className="checkin-card"
          style={{
            width: "90%",
            maxWidth: 760,
            minHeight: "calc(100vh - 48px)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 18,
            padding: "24px 24px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 12,
            boxSizing: "border-box",
          }}
        >

          {/* Title */}
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: "var(--text)", margin: "0 0 3px" }}>
              {t.title}
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "var(--subtext)", margin: 0, lineHeight: 1.4 }}>
              {t.sub}
            </p>
          </div>

          {/* Name */}
          <div>
            <label style={lbl}>{t.name_label}</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder={t.name_ph}
              style={{
                width: "100%",
                boxSizing: "border-box",
                height: 36,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "0 12px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "var(--text)",
                outline: "none",
              }}
            />
          </div>

          {/* Companion Name */}
          <div>
            <label style={lbl}>WHAT WOULD YOU LIKE TO CALL YOUR COMPANION?</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {COMPANION_NAMES.map(opt => (
                <button key={opt} style={pill(companionName === opt)} onClick={() => setCompanionName(opt)}>{opt}</button>
              ))}
              <button style={pill(isCustom)} onClick={() => setCompanionName("__custom__")}>Let me name my own</button>
            </div>
            {isCustom && (
              <input
                type="text"
                value={customCompanionName}
                onChange={e => setCustomCompanionName(e.target.value)}
                placeholder="Give your companion a name"
                style={{
                  marginTop: 8,
                  width: "100%",
                  boxSizing: "border-box",
                  height: 36,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  padding: "0 12px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "var(--text)",
                  outline: "none",
                }}
              />
            )}
          </div>

          {/* Journey */}
          <div>
            <label style={lbl}>{t.journey_label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {t.journey_opts.map(opt => (
                <button key={opt} style={pill(journey === opt)} onClick={() => setJourney(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Provider */}
          <div>
            <label style={lbl}>{t.provider_label}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {t.yesno.slice(0, 2).map(opt => (
                <button key={opt} style={yn(provider === opt)} onClick={() => handleProviderSelect(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Medication */}
          <div>
            <label style={lbl}>{t.meds_label}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {t.yesno.slice(0, 2).map(opt => (
                <button key={opt} style={yn(medication === opt)} onClick={() => handleMedSelect(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Pronouns */}
          <div>
            <label style={lbl}>{t.pronouns_label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {t.pronouns_opts.map(opt => (
                <button key={opt} style={pill(pronouns === opt)} onClick={() => setPronouns(pronouns === opt ? "" : opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <label style={lbl}>{t.mood_label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {t.mood_opts.map(opt => (
                <button key={opt} style={chip(moods.includes(opt))} onClick={() => toggleMood(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Bottom row — inside card, no marginTop auto */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input
                type="checkbox" checked={skipFlag} onChange={e => setSkipFlag(e.target.checked)}
                style={{ accentColor: "#c4956a", width: 13, height: 13, cursor: "pointer" }}
              />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text)" }}>
                {t.skip_label}
              </span>
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => router.push("/chat")}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: "7px 14px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "var(--text)",
                  cursor: "pointer",
                }}
              >
                {t.skip_btn}
              </button>
              <button
                onClick={saveAndGo}
                style={{
                  background: "linear-gradient(135deg, #c4956a 0%, #a87a52 100%)",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 14px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(196,149,106,0.3)",
                }}
              >
                {t.start_btn} →
              </button>
            </div>
          </div>

        </div>
      </div>

      <CrisisButton />
    </>
  );
}
