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
    const saved = localStorage.getItem("companion_language") ?? "en-US";
    setLang(saved);
  }, []);

  const t = getS2(lang);

  const toggleMood = (m: string) =>
    setMoods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const handleProviderSelect = (opt: string) => {
    setProvider(opt);
    if (opt === t.yesno[1]) setModal("provider"); // "No"
  };

  const handleMedSelect = (opt: string) => {
    setMedication(opt);
    if (opt === t.yesno[1]) setModal("meds"); // "No"
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

  const kicker: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "#c4956a", marginBottom: 6, opacity: 0.85,
  };

  const label: React.CSSProperties = {
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12, fontWeight: 500,
    color: "rgba(216,208,192,0.55)",
    letterSpacing: "0.06em", textTransform: "uppercase",
    marginBottom: 10,
  };

  const pillBtn = (active: boolean): React.CSSProperties => ({
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.09)"}`,
    borderRadius: 12, padding: "12px 18px",
    fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    color: active ? "#8ecfbe" : "rgba(216,208,192,0.7)",
    cursor: "pointer", textAlign: "left" as const,
    transition: "all 0.15s ease",
  });

  const ynBtn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.09)"}`,
    borderRadius: 10, padding: "11px 8px",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    color: active ? "#8ecfbe" : "rgba(216,208,192,0.65)",
    cursor: "pointer", textAlign: "center" as const,
    transition: "all 0.15s ease",
  });

  const chipBtn = (active: boolean): React.CSSProperties => ({
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.09)"}`,
    borderRadius: 20, padding: "9px 18px",
    fontFamily: "'DM Sans', sans-serif", fontSize: 13,
    color: active ? "#8ecfbe" : "rgba(216,208,192,0.7)",
    cursor: "pointer", whiteSpace: "nowrap" as const,
    transition: "all 0.15s ease",
  });

  return (
    <div className={styles.fycRoot} style={{
      position: "fixed", inset: 0,
      overflowY: "auto", overflowX: "hidden",
      background: "var(--bg)",
    }}>
      <style>{`
        @media (max-width: 640px) {
          .s2-card { padding: 18px 16px !important; }
          .s2-header { margin-bottom: 16px !important; }
          .s2-title { font-size: 20px !important; margin-bottom: 6px !important; }
          .s2-sub { font-size: 13px !important; margin-bottom: 20px !important; }
          .s2-section { margin-bottom: 18px !important; }
          .s2-name-input { padding: 10px 12px !important; height: 36px !important; font-size: 14px !important; box-sizing: border-box; }
          .s2-mood-chip { padding: 6px 12px !important; font-size: 13px !important; }
          .s2-pill { padding: 8px 12px !important; font-size: 13px !important; }
          .s2-yn-btn { padding: 9px 6px !important; font-size: 12px !important; }
          .s2-footer { padding-top: 16px !important; }
          .s2-outer { padding: 16px 14px 40px !important; }
          .s2-progress { margin-bottom: 16px !important; }
        }
      `}</style>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />

      {/* Modal overlay */}
      {modal && (
        <div className={styles.warmModalOverlay} onClick={() => setModal(null)}>
          <div className={styles.warmModal} onClick={e => e.stopPropagation()}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: "var(--text)", marginBottom: 14, lineHeight: 1.4 }}>
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

      <div className="s2-outer" style={{ maxWidth: 780, margin: "0 auto", padding: "24px 20px 60px", position: "relative", zIndex: 1 }}>

        {/* Progress header */}
        <div className="s2-progress" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={kicker}>{t.page_label}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(216,208,192,0.45)" }}>{t.page_sub}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 10, height: 4, borderRadius: 2, background: "rgba(196,149,106,0.4)" }} />
            <div style={{ width: 28, height: 4, borderRadius: 2, background: "#c4956a" }} />
            <div style={{ width: 10, height: 4, borderRadius: 2, background: "rgba(216,208,192,0.15)" }} />
          </div>
        </div>

        {/* Main card */}
        <div className="s2-card" style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 24, padding: "36px 40px",
        }}>
          <div style={kicker}>Optional</div>
          <h2 className="s2-title" style={{
            fontFamily: "'Lora', serif", fontSize: 26, fontWeight: 500,
            color: "var(--text)", margin: "0 0 10px", lineHeight: 1.25,
          }}>{t.title}</h2>
          <p className="s2-sub" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "rgba(216,208,192,0.6)", marginBottom: 36, lineHeight: 1.6 }}>
            {t.sub}
          </p>

          {/* 1. Name */}
          <div className="s2-section" style={{ marginBottom: 32 }}>
            <label style={label}>{t.name_label}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t.name_ph}
              className="s2-name-input"
              style={{
                width: "100%", boxSizing: "border-box",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12, padding: "14px 16px",
                fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                color: "var(--text)", outline: "none",
              }}
            />
          </div>

          {/* 2. Journey */}
          <div className="s2-section" style={{ marginBottom: 32 }}>
            <label style={label}>{t.journey_label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {t.journey_opts.map(opt => (
                <button key={opt} style={pillBtn(journey === opt)} onClick={() => setJourney(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Provider */}
          <div className="s2-section" style={{ marginBottom: 32 }}>
            <label style={label}>{t.provider_label}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {t.yesno.map(opt => (
                <button key={opt} className="s2-yn-btn" style={ynBtn(provider === opt)} onClick={() => handleProviderSelect(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Medication */}
          <div className="s2-section" style={{ marginBottom: 32 }}>
            <label style={label}>{t.meds_label}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {t.yesno.map(opt => (
                <button key={opt} className="s2-yn-btn" style={ynBtn(medication === opt)} onClick={() => handleMedSelect(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Pronouns */}
          <div className="s2-section" style={{ marginBottom: 32 }}>
            <label style={label}>{t.pronouns_label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
              {t.pronouns_opts.map(opt => (
                <button key={opt} className="s2-pill" style={pillBtn(pronouns === opt)} onClick={() => setPronouns(pronouns === opt ? "" : opt)}>
                  {opt}
                </button>
              ))}
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.38)", margin: 0 }}>
              {t.pronouns_note}
            </p>
          </div>

          {/* 6. Mood */}
          <div className="s2-section" style={{ marginBottom: 36 }}>
            <label style={label}>{t.mood_label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {t.mood_opts.map(opt => (
                <button key={opt} className="s2-mood-chip" style={chipBtn(moods.includes(opt))} onClick={() => toggleMood(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="s2-footer" style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 24, display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: 14,
          }}>
            <button
              onClick={() => { router.push("/chat"); }}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12, padding: "13px 24px",
                fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                color: "rgba(216,208,192,0.45)", cursor: "pointer",
              }}
            >
              {t.skip_btn}
            </button>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <button
                onClick={saveAndGo}
                style={{
                  background: "linear-gradient(135deg, #c4956a 0%, #a87a52 100%)",
                  border: "none", borderRadius: 12, padding: "15px 36px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
                  color: "#fff", cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(196,149,106,0.3)",
                }}
              >
                {t.start_btn} →
              </button>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(216,208,192,0.28)" }}>
                {t.skip_hint}
              </span>
            </div>
          </div>

          {/* Optional skip flag */}
          <div style={{ marginTop: 20 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={skipFlag}
                onChange={e => setSkipFlag(e.target.checked)}
                style={{ accentColor: "#c4956a", width: 14, height: 14, cursor: "pointer" }}
              />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.32)" }}>
                {t.skip_label}
              </span>
            </label>
          </div>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
