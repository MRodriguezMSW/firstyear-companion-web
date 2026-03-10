"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LANG_TILES, S1_STRINGS, getS1, type LangCode6 } from "../translations";
import CrisisButton from "../../components/CrisisButton";

export default function WelcomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<LangCode6>("en-US");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [skipFlag, setSkipFlag] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const t = getS1(lang);
  const currentLangLabel = LANG_TILES.find(l => l.code === lang)?.label ?? "English";


  useEffect(() => {
    const saved = localStorage.getItem("companion_language");
    const validCodes = Object.keys(S1_STRINGS);
    if (saved && validCodes.includes(saved)) setLang(saved as LangCode6);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setLangDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLang = (code: LangCode6) => {
    setLang(code);
    localStorage.setItem("companion_language", code);
    setLangDropOpen(false);
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
      minHeight: "100vh", display: "flex", flexDirection: "column",
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
        .wlc-cont { transition: all 0.2s ease; }
        .wlc-cont:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(196,149,106,0.45) !important; }
        .wlc-cont:active:not(:disabled) { transform: translateY(0); }
        .wlc-lang-opt:hover { background: rgba(74,124,111,0.15) !important; }
      `}</style>

      {/* Scrollable content area */}
      <div style={{
        flex: 1,
        position: "relative", zIndex: 1,
        WebkitOverflowScrolling: "touch",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "16px 16px 16px", flex: 1, display: "flex", flexDirection: "column", width: "100%", minHeight: 0 }}>

          {/* Full-width card — flex: 1 so it fills the viewport with no dark gap below */}
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: "16px 24px", flex: 1, display: "flex", flexDirection: "column", gap: 8, height: "auto", minHeight: "100vh" }}>

            {/* Top row: logo/title + language dropdown */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
              <div>
                <div style={{ fontSize: 32, lineHeight: 1, marginBottom: 6 }}>🌱</div>
                <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 500, color: "var(--text)", margin: 0, lineHeight: 1.15 }}>
                  FirstYear Companion
                </h1>
              </div>

              {/* Language dropdown pill */}
              <div ref={dropRef} style={{ position: "relative", flexShrink: 0, marginLeft: 12 }}>
                <button
                  onClick={() => setLangDropOpen(v => !v)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 20, padding: "6px 12px",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500,
                    color: "rgba(216,208,192,0.8)", cursor: "pointer", whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  🌐 {currentLangLabel} {langDropOpen ? "▴" : "▾"}
                </button>
                {langDropOpen && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", right: 0,
                    background: "rgba(26,46,30,0.97)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 12, padding: "6px", zIndex: 100,
                    minWidth: 160, boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                  }}>
                    {LANG_TILES.map(l => (
                      <button
                        key={l.code}
                        className="wlc-lang-opt"
                        onClick={() => handleLang(l.code)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          width: "100%", background: lang === l.code ? "rgba(74,124,111,0.2)" : "transparent",
                          border: "none", borderRadius: 8, padding: "8px 10px",
                          fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                          color: lang === l.code ? "#8ecfbe" : "rgba(216,208,192,0.8)",
                          cursor: "pointer", textAlign: "left",
                          fontWeight: lang === l.code ? 600 : 400,
                          transition: "all 0.12s ease",
                        }}
                      >
                        <span>{l.label}</span>
                        {lang === l.code && <span style={{ fontSize: 11 }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "rgba(216,208,192,0.6)", margin: "8px 0 14px", fontWeight: 300, lineHeight: 1.4 }}>
              {t.tagline}
            </p>

            {/* Info cards — auto height, no flex:1 on cards to prevent phantom empty space */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>{t.what_title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(216,208,192,0.65)", lineHeight: 1.6 }}>{t.what_body}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>{t.nova_title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(216,208,192,0.65)", lineHeight: 1.6 }}>{t.nova_body}</div>
              </div>
            </div>

            {/* Checkboxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
              <label style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: check1 ? "rgba(74,124,111,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${check1 ? "rgba(74,124,111,0.35)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10, padding: "8px 12px",
                cursor: "pointer", transition: "all 0.2s ease",
              }}>
                <input type="checkbox" checked={check1} onChange={e => setCheck1(e.target.checked)}
                  style={{ marginTop: 2, accentColor: "#c4956a", flexShrink: 0, width: 15, height: 15, cursor: "pointer" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(216,208,192,0.8)", lineHeight: 1.5 }}>
                  {t.check1}
                </span>
              </label>

              <label style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: check2 ? "rgba(74,124,111,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${check2 ? "rgba(74,124,111,0.35)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10, padding: "8px 12px",
                cursor: "pointer", transition: "all 0.2s ease",
              }}>
                <input type="checkbox" checked={check2} onChange={e => setCheck2(e.target.checked)}
                  style={{ marginTop: 2, accentColor: "#c4956a", flexShrink: 0, width: 15, height: 15, cursor: "pointer" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(216,208,192,0.8)", lineHeight: 1.5 }}>
                  {t.check2}
                </span>
              </label>

              <label style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: skipFlag ? "rgba(74,124,111,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${skipFlag ? "rgba(74,124,111,0.35)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10, padding: "8px 12px",
                cursor: "pointer", transition: "all 0.2s ease",
              }}>
                <input type="checkbox" checked={skipFlag} onChange={e => setSkipFlag(e.target.checked)}
                  style={{ marginTop: 2, accentColor: "#c4956a", flexShrink: 0, width: 15, height: 15, cursor: "pointer" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(216,208,192,0.65)", lineHeight: 1.5 }}>
                  {t.skip_label}
                </span>
              </label>
            </div>

            {/* Privacy note — below checkboxes */}
            <div style={{ background: "rgba(74,124,111,0.07)", border: "1px solid rgba(74,124,111,0.2)", borderRadius: 10, padding: "6px 12px", marginBottom: 8 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.72)", lineHeight: 1.5, margin: 0 }}>
                🔒 {t.privacy_note}
              </p>
            </div>

            {/* Beta notice — below privacy note */}
            <div style={{ background: "rgba(196,149,106,0.08)", border: "1px solid rgba(196,149,106,0.2)", borderRadius: 10, padding: "6px 12px", marginBottom: 14, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(216,208,192,0.82)", lineHeight: 1.5 }}>
              {t.beta_notice}
            </div>

            {/* Continue button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
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

      <CrisisButton />
    </div>
  );
}
