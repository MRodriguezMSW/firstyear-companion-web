"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LANG_TILES, S1_STRINGS, getS1, type LangCode6 } from "../translations";
import CrisisButton from "../../components/CrisisButton";

export default function WelcomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<LangCode6>("en-US");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [skipFlag, setSkipFlag] = useState(false);

  const t = getS1(lang);

  useEffect(() => {
    // Lock scroll on html/body for this page only
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("companion_language");
    const validCodes = Object.keys(S1_STRINGS);
    if (saved && validCodes.includes(saved)) setLang(saved as LangCode6);
  }, []);

  const handleLang = (code: LangCode6) => {
    setLang(code);
    localStorage.setItem("companion_language", code);
  };

  const handleContinue = () => {
    if (!check1 || !check2) return;
    if (skipFlag) localStorage.setItem("firstyear_skip_welcome", "true");
    const skipCheckin = localStorage.getItem("firstyear_skip_checkin") === "true";
    router.push(skipCheckin ? "/chat" : "/onboarding/checkin");
  };

  const canContinue = check1 && check2;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      display: "flex", flexDirection: "column",
      overflow: "hidden",
      background: "var(--bg, #1A2E1E)",
    }}>
      {/* Ambient orbs */}
      <div aria-hidden style={{
        position: "absolute", top: -100, left: -100, width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(74,124,111,0.18) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: -80, right: -80, width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,140,90,0.12) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />

      <style>{`
        .wlc-btn { transition: all 0.15s ease; }
        .wlc-btn:hover { background: rgba(74,124,111,0.15) !important; }
        .wlc-cont { transition: all 0.2s ease; }
        .wlc-cont:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(196,149,106,0.45) !important; }
        .wlc-cont:active:not(:disabled) { transform: translateY(0); }
      `}</style>

      {/* Scrollable content area — occupies full fixed space */}
      <div style={{
        flex: 1, overflowY: "auto", overflowX: "hidden",
        position: "relative", zIndex: 1,
        WebkitOverflowScrolling: "touch",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", padding: "16px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Desktop: two-column | Mobile: single column */}
          <div style={{ display: "flex", gap: 16, alignItems: "stretch", flexWrap: "wrap", flex: 1 }}>

            {/* ── LEFT: Language + Privacy ── */}
            <div style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, alignSelf: "stretch" }}>

              {/* Language card */}
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: "16px 16px" }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c4956a", marginBottom: 4, opacity: 0.85 }}>
                  Language
                </div>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 10 }}>{t.lang_title}</div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {LANG_TILES.map((l) => (
                    <button
                      key={l.code}
                      className="wlc-btn"
                      onClick={() => handleLang(l.code)}
                      style={{
                        background: lang === l.code ? "rgba(74,124,111,0.2)" : "rgba(255,255,255,0.03)",
                        border: `1px solid ${lang === l.code ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 10, padding: "9px 10px",
                        color: lang === l.code ? "#8ecfbe" : "rgba(216,208,192,0.7)",
                        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: lang === l.code ? 600 : 400,
                        cursor: "pointer", textAlign: "left" as const,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                      }}
                    >
                      <span>{l.label}</span>
                      {lang === l.code && <span style={{ fontSize: 11 }}>✓</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy note */}
              <div style={{ background: "rgba(74,124,111,0.07)", border: "1px solid rgba(74,124,111,0.2)", borderRadius: 14, padding: "12px 14px" }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.72)", lineHeight: 1.55, margin: 0 }}>
                  🔒 {t.privacy_note}
                </p>
              </div>
            </div>

            {/* ── RIGHT: Welcome + checkboxes ── */}
            <div style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: "24px 28px", flex: 1, display: "flex", flexDirection: "column" }}>

                {/* Logo + title */}
                <div style={{ fontSize: 28, marginBottom: 10 }}>🌱</div>
                <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(20px, 3.5vw, 30px)", fontWeight: 500, color: "var(--text)", margin: "0 0 6px", lineHeight: 1.2 }}>
                  FirstYear Companion
                </h1>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "rgba(216,208,192,0.6)", margin: "0 0 20px", fontWeight: 300 }}>
                  {t.tagline}
                </p>

                {/* Info cards — hidden on narrow screens */}
                <div className="wlc-desktop" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "'Lora', serif", fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>{t.what_title}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.65)", lineHeight: 1.55 }}>{t.what_body}</div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ fontFamily: "'Lora', serif", fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 6 }}>{t.nova_title}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.65)", lineHeight: 1.55 }}>{t.nova_body}</div>
                  </div>
                </div>

                {/* Beta notice */}
                <div className="wlc-desktop" style={{ background: "rgba(196,149,106,0.08)", border: "1px solid rgba(196,149,106,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.82)", lineHeight: 1.5 }}>
                  {t.beta_notice}
                </div>

                {/* ── All 3 checkboxes grouped together ── */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                  {/* Checkbox 1 */}
                  <label style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    background: check1 ? "rgba(74,124,111,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${check1 ? "rgba(74,124,111,0.35)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 10, padding: "11px 13px",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}>
                    <input type="checkbox" checked={check1} onChange={e => setCheck1(e.target.checked)}
                      style={{ marginTop: 2, accentColor: "#c4956a", flexShrink: 0, width: 15, height: 15, cursor: "pointer" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.8)", lineHeight: 1.5 }}>
                      {t.check1}
                    </span>
                  </label>

                  {/* Checkbox 2 */}
                  <label style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    background: check2 ? "rgba(74,124,111,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${check2 ? "rgba(74,124,111,0.35)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 10, padding: "11px 13px",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}>
                    <input type="checkbox" checked={check2} onChange={e => setCheck2(e.target.checked)}
                      style={{ marginTop: 2, accentColor: "#c4956a", flexShrink: 0, width: 15, height: 15, cursor: "pointer" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.8)", lineHeight: 1.5 }}>
                      {t.check2}
                    </span>
                  </label>

                  {/* Checkbox 3 — skip flag */}
                  <label style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    background: skipFlag ? "rgba(74,124,111,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${skipFlag ? "rgba(74,124,111,0.35)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 10, padding: "11px 13px",
                    cursor: "pointer", transition: "all 0.2s ease",
                  }}>
                    <input type="checkbox" checked={skipFlag} onChange={e => setSkipFlag(e.target.checked)}
                      style={{ marginTop: 2, accentColor: "#c4956a", flexShrink: 0, width: 15, height: 15, cursor: "pointer" }} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.65)", lineHeight: 1.5 }}>
                      {t.skip_label}
                    </span>
                  </label>
                </div>

                {/* Continue button */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    className="wlc-cont"
                    onClick={handleContinue}
                    disabled={!canContinue}
                    style={{
                      background: canContinue ? "linear-gradient(135deg, #c4956a 0%, #a87a52 100%)" : "rgba(196,149,106,0.2)",
                      border: "none", borderRadius: 12, padding: "13px 32px",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500,
                      color: canContinue ? "#fff" : "rgba(196,149,106,0.4)",
                      cursor: canContinue ? "pointer" : "not-allowed",
                      boxShadow: canContinue ? "0 4px 20px rgba(196,149,106,0.3)" : "none",
                    }}
                  >
                    {t.continue_btn} →
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
