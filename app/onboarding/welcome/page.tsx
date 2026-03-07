"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LANG_TILES, S1_STRINGS, getS1, type LangCode6 } from "../translations";
import CrisisButton from "../../components/CrisisButton";

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.09)",
  borderRadius: 20,
  padding: "28px 28px",
};

const miniCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: 14,
  padding: "16px 18px",
  flex: 1,
};

export default function WelcomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<LangCode6>("en-US");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [skipFlag, setSkipFlag] = useState(false);

  const t = getS1(lang);

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

  const text = (s: string) => ({
    fontFamily: "'DM Sans', sans-serif",
    color: "rgba(216,208,192,0.72)",
    fontSize: 14,
    lineHeight: 1.65,
  } as React.CSSProperties);

  const kicker = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#c4956a",
    marginBottom: 6,
    opacity: 0.85,
  };

  const h3style = {
    fontFamily: "'Lora', serif",
    fontSize: 17,
    fontWeight: 500,
    color: "var(--text)",
    marginBottom: 10,
    lineHeight: 1.35,
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      overflowY: "auto", overflowX: "hidden",
      background: "var(--bg)",
      WebkitOverflowScrolling: "touch" as any,
    }} className="s1-root">
      {/* Ambient orbs */}
      <div aria-hidden style={{
        position: "fixed", top: -100, left: -100, width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--orb1, rgba(74,124,111,0.18)) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div aria-hidden style={{
        position: "fixed", bottom: -80, right: -80, width: 400, height: 400,
        borderRadius: "50%",
        background: "radial-gradient(circle, var(--orb2, rgba(180,140,90,0.12)) 0%, transparent 70%)",
        filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />

      <style>{`
        .lang-tile { transition: all 0.15s ease; }
        .lang-tile:hover { background: rgba(74,124,111,0.15) !important; }
        .mini-note { transition: all 0.15s ease; }
        .cont-btn { transition: all 0.2s ease; }
        .cont-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(196,149,106,0.45) !important; }
        .cont-btn:active:not(:disabled) { transform: translateY(0); }
        @media (max-width: 900px) {
          .screen1-grid { flex-direction: column !important; }
          .screen1-left { width: 100% !important; }
          .screen1-right { width: 100% !important; }
        }
        @media (max-width: 640px) {
          .s1-desktop-only { display: none !important; }
          .s1-lang-grid { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 6px !important; }
          .s1-lang-btn { padding: 9px 10px !important; font-size: 13px !important; }
          .s1-privacy { padding: 10px 12px !important; }
          .s1-right-card { padding: 18px 20px !important; }
          .s1-logo { font-size: 26px !important; margin-bottom: 8px !important; }
          .s1-title { font-size: 20px !important; margin-bottom: 6px !important; }
          .s1-tagline { font-size: 14px !important; margin-bottom: 16px !important; }
          .s1-check-wrap { margin-bottom: 12px !important; }
          .s1-check-item { padding: 10px 12px !important; }
          .s1-skip-flag { margin-bottom: 12px !important; }
          .s1-cont-btn { padding: 13px 28px !important; font-size: 14px !important; }
          .s1-lang-card { padding: 14px 16px !important; }
          .s1-progress-header { margin-bottom: 12px !important; }
          .s1-outer-grid { gap: 10px !important; }
        }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1300, margin: "0 auto", padding: "24px 20px 60px" }}>

        {/* Progress header */}
        <div className="s1-progress-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={kicker}>{t.page_label}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(216,208,192,0.5)" }}>{t.page_sub}</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ width: 28, height: 4, borderRadius: 2, background: "#c4956a" }} />
            <div style={{ width: 10, height: 4, borderRadius: 2, background: "rgba(216,208,192,0.15)" }} />
            <div style={{ width: 10, height: 4, borderRadius: 2, background: "rgba(216,208,192,0.15)" }} />
          </div>
        </div>

        {/* Two-column grid */}
        <div className="screen1-grid s1-outer-grid" style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

          {/* ── LEFT: Language + Privacy note ── */}
          <div className="screen1-left" style={{ width: 300, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Language card */}
            <div style={card} className="s1-lang-card">
              <div style={kicker}>{t.page_sub.split("+")[0].trim()}</div>
              <h2 style={{ ...h3style, marginBottom: 6 }}>{t.lang_title}</h2>
              <p style={{ ...text(""), marginBottom: 20, fontSize: 13 }}>{t.lang_sub}</p>

              <div className="s1-lang-grid" style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {LANG_TILES.map((l) => (
                  <button
                    key={l.code}
                    className="lang-tile s1-lang-btn"
                    onClick={() => handleLang(l.code)}
                    style={{
                      background: lang === l.code ? "rgba(74,124,111,0.2)" : "rgba(255,255,255,0.03)",
                      border: `1px solid ${lang === l.code ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: 12,
                      padding: "13px 16px",
                      color: lang === l.code ? "#8ecfbe" : "rgba(216,208,192,0.7)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 14, fontWeight: lang === l.code ? 600 : 400,
                      cursor: "pointer", textAlign: "left",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <span style={{ fontSize: 12 }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy note — visually distinct card */}
            <div className="s1-privacy" style={{
              background: "rgba(74,124,111,0.07)",
              border: "1px solid rgba(74,124,111,0.2)",
              borderRadius: 16,
              padding: "18px 20px",
            }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(216,208,192,0.72)", lineHeight: 1.65, margin: 0 }}>
                🔒 {t.privacy_note}
              </p>
            </div>
          </div>

          {/* ── RIGHT: Welcome content ── */}
          <div className="screen1-right" style={{ flex: 1, minWidth: 0 }}>
            <div className="s1-right-card" style={{ ...card, padding: "36px 40px" }}>

              {/* Logo + title */}
              <div className="s1-logo" style={{ fontSize: 36, marginBottom: 16 }}>🌱</div>
              <h1 className="s1-title" style={{
                fontFamily: "'Lora', serif", fontSize: "clamp(24px, 4vw, 34px)",
                fontWeight: 500, color: "var(--text)", margin: "0 0 10px",
                lineHeight: 1.2, letterSpacing: "-0.01em",
              }}>
                FirstYear Companion
              </h1>
              <p className="s1-tagline" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, color: "rgba(216,208,192,0.6)", margin: "0 0 32px", fontWeight: 300 }}>
                {t.tagline}
              </p>

              {/* Info cards row — hidden on mobile */}
              <div className="s1-desktop-only" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                <div style={{ ...card, padding: "20px 22px" }}>
                  <h3 style={h3style}>{t.what_title}</h3>
                  <p style={{ ...text(""), margin: 0 }}>{t.what_body}</p>
                </div>
                <div style={{ ...card, padding: "20px 22px" }}>
                  <h3 style={h3style}>{t.nova_title}</h3>
                  <p style={{ ...text(""), margin: 0 }}>{t.nova_body}</p>
                </div>
              </div>

              {/* Mini notes row — hidden on mobile */}
              <div className="s1-desktop-only" style={{ display: "flex", gap: 12, marginBottom: 24 }}>
                <div className="mini-note" style={miniCard}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 6 }}>{t.mini_privacy_title}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.55)", lineHeight: 1.55 }}>{t.mini_privacy_body}</div>
                </div>
                <div className="mini-note" style={miniCard}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 6 }}>{t.mini_beta_title}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.55)", lineHeight: 1.55 }}>{t.mini_beta_body}</div>
                </div>
                <div className="mini-note" style={miniCard}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 6 }}>{t.mini_built_title}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.55)", lineHeight: 1.55 }}>{t.mini_built_body}</div>
                </div>
              </div>

              {/* Beta notice — hidden on mobile */}
              <div className="s1-desktop-only" style={{
                background: "rgba(196,149,106,0.08)",
                border: "1px solid rgba(196,149,106,0.2)",
                borderRadius: 12, padding: "14px 18px", marginBottom: 28,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                fontSize: 13, color: "rgba(196,149,106,0.82)", lineHeight: 1.55,
              }}>
                {t.beta_notice}
              </div>

              {/* Required checkboxes */}
              <div className="s1-check-wrap" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                <label className="s1-check-item" style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  background: check1 ? "rgba(74,124,111,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${check1 ? "rgba(74,124,111,0.35)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 12, padding: "14px 16px",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}>
                  <input
                    type="checkbox"
                    checked={check1}
                    onChange={e => setCheck1(e.target.checked)}
                    style={{ marginTop: 2, accentColor: "#c4956a", flexShrink: 0, width: 16, height: 16, cursor: "pointer" }}
                  />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(216,208,192,0.8)", lineHeight: 1.55 }}>
                    ☐ {t.check1}
                  </span>
                </label>

                <label className="s1-check-item" style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  background: check2 ? "rgba(74,124,111,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${check2 ? "rgba(74,124,111,0.35)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 12, padding: "14px 16px",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}>
                  <input
                    type="checkbox"
                    checked={check2}
                    onChange={e => setCheck2(e.target.checked)}
                    style={{ marginTop: 2, accentColor: "#c4956a", flexShrink: 0, width: 16, height: 16, cursor: "pointer" }}
                  />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(216,208,192,0.8)", lineHeight: 1.55 }}>
                    ☐ {t.check2}
                  </span>
                </label>
              </div>

              {/* Optional: skip flag (3rd checkbox, before Continue) */}
              <label className="s1-skip-flag" style={{
                display: "flex", alignItems: "center", gap: 10,
                cursor: "pointer", marginBottom: 20,
              }}>
                <input
                  type="checkbox"
                  checked={skipFlag}
                  onChange={e => setSkipFlag(e.target.checked)}
                  style={{ accentColor: "#c4956a", width: 14, height: 14, cursor: "pointer" }}
                />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.35)" }}>
                  {t.skip_label}
                </span>
              </label>

              {/* Footer row: Continue button */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 20 }}>
                <button
                  className="cont-btn s1-cont-btn"
                  onClick={handleContinue}
                  disabled={!canContinue}
                  style={{
                    background: canContinue
                      ? "linear-gradient(135deg, #c4956a 0%, #a87a52 100%)"
                      : "rgba(196,149,106,0.2)",
                    border: "none",
                    borderRadius: 14, padding: "16px 40px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 500,
                    color: canContinue ? "#fff" : "rgba(196,149,106,0.4)",
                    cursor: canContinue ? "pointer" : "not-allowed",
                    boxShadow: canContinue ? "0 4px 20px rgba(196,149,106,0.3)" : "none",
                    letterSpacing: "0.01em",
                  }}
                >
                  {t.continue_btn} →
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
