"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LANG_TILES, S1_STRINGS, getS1, type LangCode6 } from "../translations";
import CrisisButton from "../../components/CrisisButton";

const THEMES = [
  { id: "calm-sea",       name: "Calm Sea",       swatches: ["#6A89A7","#BDDDFC","#88BDF2","#384959"] },
  { id: "quiet-grove",    name: "Quiet Grove",    swatches: ["#636B2F","#BAC095","#D4DE95","#3D4127"] },
  { id: "lavender-night", name: "Lavender Night", swatches: ["#272757","#8686AC","#505081","#0F0E47"] },
  { id: "meadow-mist",    name: "Meadow Mist",    swatches: ["#2E6F40","#CFFFDC","#68BA7F","#253D2C"] },
  { id: "charcoal-sky",   name: "Charcoal Sky",   swatches: ["#4A4A4A","#CBCBCB","#FFFFE3","#6D8196"] },
  { id: "warm-clay",      name: "Warm Clay",      swatches: ["#A2574F","#E68057","#BF7587","#993A8B"] },
  { id: "rose-dusk",      name: "Rose Dusk",      swatches: ["#DCA1A1","#996666","#8E4585","#4A4A4A"] },
  { id: "desert-bloom",   name: "Desert Bloom",   swatches: ["#E35336","#FFD3AC","#9988A1","#8A2B0E"] },
  { id: "harvest",        name: "Harvest",        swatches: ["#BE5103","#FFCE1B","#069494","#B7410E"] },
  { id: "soft-candy",     name: "Soft Candy",     swatches: ["#B298E7","#B8E3E9","#F5B8D5","#F9BEDD"] },
  { id: "hot-sunset",     name: "Hot Sunset",     swatches: ["#FD3DB5","#FFB8DC","#FB6A2C","#8C1946"] },
  { id: "citrus-pop",     name: "Citrus Pop",     swatches: ["#FF8243","#FFC0CB","#FCE883","#069494"] },
  { id: "ocean-deep",     name: "Ocean Deep",     swatches: ["#0047AB","#000080","#82C8E5","#6D8196"] },
  { id: "emerald-pride",  name: "Emerald Pride",  swatches: ["#50C878","#0F52BA","#9966CC","#CFB53B"] },
  { id: "linen-moss",     name: "Linen & Moss",   swatches: ["#EDE8D0","#6E632E","#DBD1ED","#ABBEED"] },
  { id: "periwinkle",     name: "Periwinkle",     swatches: ["#CCCCFF","#A3A3CC","#5C5C99","#292966"] },
  { id: "blue-violet",    name: "Blue Violet",    swatches: ["#B5C7EB","#9EF0FF","#A4A5F5","#8E70CF"] },
  { id: "teal-earth",     name: "Teal Earth",     swatches: ["#81D8D0","#D99E82","#D7D982","#AE82D9"] },
  { id: "garden-fresh",   name: "Garden Fresh",   swatches: ["#93C572","#89CFF0","#F5F5DC","#82C8E5"] },
  { id: "sage-stone",     name: "Sage & Stone",   swatches: ["#B2AC88","#898989","#F2F0EF","#4B6E48"] },
  { id: "deep-teal",      name: "Deep Teal",      swatches: ["#B8E3E9","#93B1B5","#4F7C82","#0B2E33"] },
];

export default function WelcomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<LangCode6>("en-US");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [skipFlag, setSkipFlag] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);
  const [themeDropOpen, setThemeDropOpen] = useState(false);
  const [theme, setTheme] = useState("calm-sea");
  const langDropRef = useRef<HTMLDivElement>(null);
  const themeDropRef = useRef<HTMLDivElement>(null);

  const t = getS1(lang);
  const currentLangLabel = LANG_TILES.find(l => l.code === lang)?.label ?? "English";
  const currentTheme = THEMES.find(th => th.id === theme) ?? THEMES[0];

  useEffect(() => {
    const saved = localStorage.getItem("companion_language");
    const validCodes = Object.keys(S1_STRINGS);
    if (saved && validCodes.includes(saved)) setLang(saved as LangCode6);
    const savedTheme = localStorage.getItem("companion_theme") || "calm-sea";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langDropRef.current && !langDropRef.current.contains(e.target as Node)) {
        setLangDropOpen(false);
      }
      if (themeDropRef.current && !themeDropRef.current.contains(e.target as Node)) {
        setThemeDropOpen(false);
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

  const handleTheme = (id: string) => {
    setTheme(id);
    localStorage.setItem("companion_theme", id);
    document.documentElement.setAttribute("data-theme", id);
    setThemeDropOpen(false);
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
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      overflow: "hidden",
      background: "var(--bg, #384959)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
        .wlc-theme-opt:hover { background: rgba(255,255,255,0.07) !important; }
        @media (max-width: 767px) {
          .wlc-cont-row { margin-bottom: 80px !important; }
        }
      `}</style>

      {/* Card wrapper — scrolls internally if card taller than viewport */}
      <div style={{
        overflowY: "auto",
        maxHeight: "calc(100vh - 64px)",
        width: "100%",
        maxWidth: 680,
        padding: "0 16px",
        position: "relative", zIndex: 1,
      }}>
      <div style={{ width: "100%" }}>

          {/* Card — height auto, floats in page */}
          <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 18, padding: "16px 24px", display: "flex", flexDirection: "column", height: "auto" }}>

            {/* Top row: logo/title + dropdowns */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 32, lineHeight: 1 }}>🌱</span>
                <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(26px, 5vw, 36px)", fontWeight: 500, color: "var(--text)", margin: 0, lineHeight: 1.15 }}>
                  FirstYear Companion
                </h1>
              </div>

              {/* Theme picker + language dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 12 }}>

                {/* Theme dropdown */}
                <div ref={themeDropRef} style={{ position: "relative", flexShrink: 0 }}>
                  <button
                    onClick={() => { setThemeDropOpen(v => !v); setLangDropOpen(false); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 20, padding: "6px 10px",
                      cursor: "pointer", transition: "all 0.15s ease",
                    }}
                  >
                    {/* 4-swatch preview */}
                    <div style={{ display: "flex", overflow: "hidden", borderRadius: 3 }}>
                      {currentTheme.swatches.map((c, i) => (
                        <div key={i} style={{ width: 10, height: 16, background: c }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: "rgba(216,208,192,0.8)", whiteSpace: "nowrap" }}>
                      {themeDropOpen ? "▴" : "▾"}
                    </span>
                  </button>

                  {themeDropOpen && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 6px)", right: 0,
                      background: "rgba(20,20,30,0.97)", border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12, padding: "6px", zIndex: 200,
                      minWidth: 200, maxHeight: 280, overflowY: "auto",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                    }}>
                      <div style={{
                        fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600,
                        color: "rgba(216,208,192,0.45)", letterSpacing: "0.08em",
                        textTransform: "uppercase", padding: "4px 10px 8px",
                      }}>
                        Select your theme
                      </div>
                      {THEMES.map(th => (
                        <button
                          key={th.id}
                          className="wlc-theme-opt"
                          onClick={() => handleTheme(th.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            width: "100%", background: theme === th.id ? "rgba(255,255,255,0.1)" : "transparent",
                            border: "none", borderRadius: 8, padding: "7px 10px",
                            cursor: "pointer", transition: "background 0.12s ease",
                          }}
                        >
                          {/* 4 color squares — no gap, no border-radius */}
                          <div style={{ display: "flex", flexShrink: 0 }}>
                            {th.swatches.map((c, i) => (
                              <div key={i} style={{ width: 14, height: 18, background: c }} />
                            ))}
                          </div>
                          <span style={{
                            fontFamily: "'DM Sans', sans-serif", fontSize: 12,
                            color: "rgba(216,208,192,0.85)", flex: 1, textAlign: "left",
                            whiteSpace: "nowrap",
                          }}>
                            {th.name}
                          </span>
                          {theme === th.id && (
                            <span style={{ fontSize: 11, color: "rgba(216,208,192,0.6)", flexShrink: 0 }}>✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Language dropdown pill */}
                <div ref={langDropRef} style={{ position: "relative", flexShrink: 0 }}>
                  <button
                    onClick={() => { setLangDropOpen(v => !v); setThemeDropOpen(false); }}
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

              </div>{/* end theme+lang wrapper */}
            </div>

            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "var(--subtext)", margin: "8px 0 16px", fontWeight: 300, lineHeight: 1.4 }}>
              {t.tagline}
            </p>

            {/* Info cards */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>{t.what_title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.6 }}>{t.what_body}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ fontFamily: "'Lora', serif", fontSize: 15, fontWeight: 500, color: "var(--text)", marginBottom: 8 }}>{t.nova_title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.6 }}>{t.nova_body}</div>
              </div>
            </div>

            {/* Checkboxes */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12, marginTop: 0 }}>
              <label style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                background: check1 ? "rgba(74,124,111,0.08)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${check1 ? "rgba(74,124,111,0.35)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 10, padding: "8px 12px",
                cursor: "pointer", transition: "all 0.2s ease",
              }}>
                <input type="checkbox" checked={check1} onChange={e => setCheck1(e.target.checked)}
                  style={{ marginTop: 2, accentColor: "#c4956a", flexShrink: 0, width: 15, height: 15, cursor: "pointer" }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
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
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text)", lineHeight: 1.5 }}>
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
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.5 }}>
                  {t.skip_label}
                </span>
              </label>
            </div>

            {/* Privacy note */}
            <div style={{ background: "rgba(74,124,111,0.07)", border: "1px solid rgba(74,124,111,0.2)", borderRadius: 10, padding: "6px 12px", marginBottom: 8, marginTop: 0 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--subtext)", lineHeight: 1.5, margin: 0 }}>
                🔒 {t.privacy_note}
              </p>
            </div>

            {/* Beta notice */}
            <div style={{ background: "rgba(196,149,106,0.08)", border: "1px solid rgba(196,149,106,0.2)", borderRadius: 10, padding: "6px 12px", marginBottom: 16, fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "var(--subtext)", lineHeight: 1.5 }}>
              {t.beta_notice}
            </div>

            {/* Continue button */}
            <div className="wlc-cont-row" style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
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
      </div>{/* end maxWidth */}
      </div>{/* end scrollable content area */}

      <CrisisButton />
    </div>
  );
}
