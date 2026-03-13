"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sprout, Globe, Palette, ChevronDown, Bot,
  CheckCircle2, ArrowRight, Lock,
} from "lucide-react";
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

// Deterministic starfield — no Math.random() (avoids hydration mismatch)
// 150 small (1–2 px) + 40 large bright (3 px, glowing)
const STARS = [
  ...Array.from({ length: 180 }, (_, i) => {
    const hx = Math.sin(i * 127.1 + 1.9) * 43758.5453;
    const hy = Math.sin(i * 311.7 + 4.1) * 43758.5453;
    return {
      left: `${((hx - Math.floor(hx)) * 100).toFixed(2)}%`,
      top:  `${((hy - Math.floor(hy)) * 100).toFixed(2)}%`,
      size: i % 3 === 0 ? 2 : 1,
      opacity: ([0.5, 0.7, 0.85, 1.0] as const)[i % 4],
    };
  }),
  ...Array.from({ length: 50 }, (_, i) => {
    const hx = Math.sin((i + 200) * 157.3 + 2.7) * 43758.5453;
    const hy = Math.sin((i + 200) * 233.1 + 6.3) * 43758.5453;
    return {
      left: `${((hx - Math.floor(hx)) * 100).toFixed(2)}%`,
      top:  `${((hy - Math.floor(hy)) * 100).toFixed(2)}%`,
      size: 3,
      opacity: 1.0 as const,
    };
  }),
];

const F_HEADING = "'Plus Jakarta Sans', system-ui, sans-serif";
const F_BODY    = "'Inter', system-ui, sans-serif";

export default function WelcomePage() {
  const router = useRouter();
  const [lang, setLang]                   = useState<LangCode6>("en-US");
  const [check1, setCheck1]               = useState(false);
  const [check2, setCheck2]               = useState(false);
  const [langDropOpen, setLangDropOpen]   = useState(false);
  const [themeDropOpen, setThemeDropOpen] = useState(false);
  const [theme, setTheme]                 = useState("calm-sea");
  const [companionName, setCompanionName] = useState("Nova");
  const [avatarError, setAvatarError]     = useState(false);
  const langDropRef  = useRef<HTMLDivElement>(null);
  const themeDropRef = useRef<HTMLDivElement>(null);

  const currentLangLabel = LANG_TILES.find(l => l.code === lang)?.label ?? "English";
  const currentTheme     = THEMES.find(th => th.id === theme) ?? THEMES[0];
  const canContinue      = check1 && check2;

  // ── Translation: re-derived on every render when `lang` changes ──
  const t = getS1(lang);

  useEffect(() => {
    const savedLang = localStorage.getItem("companion_language") || localStorage.getItem("firstyear_language");
    if (savedLang && Object.keys(S1_STRINGS).includes(savedLang))
      setLang(savedLang as LangCode6);
    const savedTheme = localStorage.getItem("companion_theme") || "calm-sea";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setCompanionName(localStorage.getItem("companion_name") || "Nova");
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langDropRef.current  && !langDropRef.current.contains(e.target  as Node)) setLangDropOpen(false);
      if (themeDropRef.current && !themeDropRef.current.contains(e.target as Node)) setThemeDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLang = (code: LangCode6) => {
    setLang(code);
    localStorage.setItem("companion_language", code);
    localStorage.setItem("firstyear_language", code);
    setLangDropOpen(false);
  };

  const handleTheme = (id: string) => {
    setTheme(id);
    localStorage.setItem("companion_theme", id);
    document.documentElement.setAttribute("data-theme", id);
    setThemeDropOpen(false);
  };

  const handleContinue = () => {
    if (!canContinue) return;
    router.push("/onboarding/checkin");
  };

  return (
    <>
      {/*
        ── Base page colour on <html> so the transparent scroll wrapper
           doesn't paint over the aurora layers, letting backdrop-filter
           actually see and blur the aurora.
      */}
      <style>{`
        html { background: transparent !important; }

        /* Pills */
        .wlc-pill {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 20px; padding: 6px 12px;
          font-family: ${F_BODY}; font-size: 13px; color: #CBD5E1;
          cursor: pointer; white-space: nowrap; transition: background 0.15s;
        }
        .wlc-pill:hover { background: rgba(255,255,255,0.14); }

        /* Dropdown anchor — must have high z-index to escape card stacking context */
        .wlc-drop-anchor { position: relative; z-index: 1000; }
        .wlc-drop {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: rgba(3, 9, 12, 0.97);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 12px; padding: 6px;
          z-index: 9999;
          box-shadow: 0 16px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(34,197,94,0.07);
        }
        .wlc-drop-opt {
          display: flex; align-items: center; gap: 8px;
          width: 100%; border: none; border-radius: 8px;
          padding: 8px 10px; cursor: pointer; text-align: left;
          font-family: ${F_BODY}; font-size: 13px;
          transition: background 0.12s;
        }
        .wlc-drop-opt:hover { background: rgba(34,197,94,0.12) !important; }

        /* Checkboxes */
        .wlc-chk-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 14px; border-radius: 10px;
          cursor: pointer; transition: background 0.15s;
        }
        .wlc-chk-row:hover { background: rgba(255,255,255,0.04); }
        .wlc-chk-box {
          width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;
          border-radius: 4px; border: 1px solid rgba(255,255,255,0.32);
          background: transparent; display: flex; align-items: center;
          justify-content: center; transition: all 0.15s; cursor: pointer;
        }
        .wlc-chk-box.on { background: #22C55E; border-color: #22C55E; }

        /* CTA button */
        .wlc-btn {
          width: 100%; margin-top: 24px;
          background: linear-gradient(135deg, #22C55E 0%, #10B981 55%, #14B8A6 100%);
          color: #fff; font-family: ${F_HEADING}; font-weight: 600; font-size: 17px;
          border: 1px solid rgba(255,255,255,0.14); border-radius: 16px;
          padding: 16px 22px;
          box-shadow: 0 8px 28px rgba(16,185,129,0.35);
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .wlc-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 14px 36px rgba(16,185,129,0.5);
        }
        .wlc-btn:active:not(:disabled) { transform: translateY(0); }
        .wlc-btn:disabled { opacity: 0.38; cursor: not-allowed; box-shadow: none; }

        /* Feature list */
        .wlc-features { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }

        /* Responsive */
        @media (max-width: 768px) {
          .wlc-card { padding: 20px !important; }
          .wlc-headline { font-size: 26px !important; }
        }
      `}</style>

      {/*
        ── Scroll container: TRANSPARENT background so the aurora layers
           painted inside it are what backdrop-filter actually blurs.
           (If this div had background:#060d14, backdrop-filter would only
           see that solid colour — the aurora would be invisible through glass.)
      */}
      <div style={{
        position: "fixed",
        inset: 0,
        overflowY: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        boxSizing: "border-box",
        background: "transparent",
      }}>

        {/* Deep space base */}
        <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "#0d1f2d" }} />

        {/* Green aurora sweep — bright luminous sage */}
        <div aria-hidden style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 110% 65% at 25% 65%, rgba(100,200,140,0.68) 0%, rgba(60,180,120,0.42) 35%, rgba(34,197,94,0.15) 62%, transparent 80%)",
          filter:"blur(45px)" }} />

        {/* Teal upper accent */}
        <div aria-hidden style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 70% 45% at 75% 35%, rgba(20,184,166,0.32) 0%, transparent 65%)",
          filter:"blur(40px)" }} />

        {/* Vignette — dark edges, light center */}
        <div aria-hidden style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)",
        }} />

        {/* Starfield */}
        <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
          {STARS.map((s, i) => (
            <span key={i} style={{
              position: "absolute",
              left: s.left, top: s.top,
              width: s.size, height: s.size,
              borderRadius: "50%",
              background: "white",
              opacity: s.opacity,
              display: "block",
              boxShadow: s.size >= 3 ? "0 0 5px 2px rgba(255,255,255,0.7)" : "none",
            }} />
          ))}
        </div>

        {/* ── Main card ── */}
        <div
          className="wlc-card"
          style={{
            background: "transparent",
            backdropFilter: "none",
            WebkitBackdropFilter: "none",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 28,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
            padding: 32,
            position: "relative",
            overflow: "visible",
            zIndex: 1,
            maxWidth: 720,
            width: "92%",
            boxSizing: "border-box" as const,
          }}
        >

            {/* Glass highlight sweep — top-left catch-light */}
            <div aria-hidden style={{
              position: "absolute", inset: 0, borderRadius: 28,
              background: "linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.03) 35%, transparent 65%)",
              pointerEvents: "none",
            }} />

            {/* ── Top row ── z-index 10 so dropdowns clear inner cards */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              position: "relative", zIndex: 10, overflow: "visible",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Sprout size={18} color="#22C55E" strokeWidth={2.2} />
                <span style={{ fontFamily: F_HEADING, fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  FirstYear Companion
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, overflow: "visible" }}>
                {/* Language pill */}
                <div ref={langDropRef} className="wlc-drop-anchor">
                  <button className="wlc-pill" onClick={() => { setLangDropOpen(v => !v); setThemeDropOpen(false); }}>
                    <Globe size={13} strokeWidth={2} />
                    {currentLangLabel}
                    <ChevronDown size={12} strokeWidth={2} style={{ transform: langDropOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                  </button>
                  {langDropOpen && (
                    <div className="wlc-drop" style={{ minWidth: 165 }}>
                      {LANG_TILES.map(l => (
                        <button
                          key={l.code}
                          className="wlc-drop-opt"
                          onClick={() => handleLang(l.code)}
                          style={{
                            background:  lang === l.code ? "rgba(34,197,94,0.16)" : "transparent",
                            color:       lang === l.code ? "#22C55E" : "#CBD5E1",
                            fontWeight:  lang === l.code ? 600 : 400,
                          }}
                        >
                          <span style={{ flex: 1 }}>{l.label}</span>
                          {lang === l.code && <span style={{ fontSize: 11, color: "#22C55E" }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Theme pill */}
                <div ref={themeDropRef} className="wlc-drop-anchor">
                  <button className="wlc-pill" onClick={() => { setThemeDropOpen(v => !v); setLangDropOpen(false); }}>
                    <Palette size={13} strokeWidth={2} />
                    {currentTheme.name}
                    <ChevronDown size={12} strokeWidth={2} style={{ transform: themeDropOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                  </button>
                  {themeDropOpen && (
                    <div className="wlc-drop" style={{ minWidth: 215, maxHeight: 290, overflowY: "auto" }}>
                      <div style={{ fontFamily: F_BODY, fontSize: 11, fontWeight: 600, color: "rgba(203,213,225,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px 8px" }}>
                        Select theme
                      </div>
                      {THEMES.map(th => (
                        <button
                          key={th.id}
                          className="wlc-drop-opt"
                          onClick={() => handleTheme(th.id)}
                          style={{
                            background: theme === th.id ? "rgba(255,255,255,0.1)" : "transparent",
                            color: "#CBD5E1",
                          }}
                        >
                          <div style={{ display: "flex", flexShrink: 0, overflow: "hidden", borderRadius: 2 }}>
                            {th.swatches.map((c, j) => <div key={j} style={{ width: 13, height: 16, background: c }} />)}
                          </div>
                          <span style={{ flex: 1, whiteSpace: "nowrap" }}>{th.name}</span>
                          {theme === th.id && <span style={{ fontSize: 11, color: "#CBD5E1" }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Hero text — uses t.tagline so language change is instant ── */}
            <div style={{ textAlign: "center", marginTop: 28, position: "relative", zIndex: 1 }}>
              <p
                className="wlc-headline"
                style={{ fontFamily: F_HEADING, fontSize: 34, fontWeight: 600, color: "#fff", margin: "0 0 10px" }}
              >
                {t.tagline}
              </p>
              <p style={{ fontFamily: F_BODY, fontSize: 16, color: "#CBD5E1", margin: "0 0 4px" }}>
                {t.subtitle1}
              </p>
              <p style={{ fontFamily: F_BODY, fontSize: 16, color: "#CBD5E1", margin: 0 }}>
                {t.subtitle2}
              </p>
            </div>

            {/* ── Two-column meet layout ── */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr",
              gap: 20,
              alignItems: "flex-start",
              marginTop: 24,
              position: "relative",
              zIndex: 1,
            }}>
              {/* LEFT — avatar col */}
              <div>
                {!avatarError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/avatars/nova.png"
                    alt={companionName}
                    width={80}
                    height={80}
                    style={{
                      width: 80, height: 80,
                      borderRadius: "50%",
                      objectFit: "cover",
                      filter: "drop-shadow(0 4px 16px rgba(34,197,94,0.55))",
                      display: "block",
                    }}
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    background: "linear-gradient(135deg, #22C55E, #14B8A6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    filter: "drop-shadow(0 4px 16px rgba(34,197,94,0.55))",
                  }}>
                    <Bot size={32} color="white" strokeWidth={1.8} />
                  </div>
                )}
              </div>

              {/* RIGHT — content col */}
              <div>
                <div style={{ fontFamily: F_HEADING, fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  Meet Nova
                </div>
                <div style={{ fontFamily: F_BODY, fontSize: 14, color: "#94A3B8", lineHeight: 1.5 }}>
                  {t.companionSubtitle}
                </div>

                {/* Features card */}
                <div style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}>
                  {[t.feature1, t.feature2, t.feature3, t.feature4].map((feature, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <CheckCircle2 size={16} color="#22C55E" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontFamily: F_BODY, fontSize: 14, color: "#CBD5E1", lineHeight: 1.45 }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Before we begin card */}
                <div style={{
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 12,
                }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: F_BODY, fontSize: 16, fontWeight: 600, color: "#CBD5E1" }}>
                      Before we begin
                    </span>
                  </div>

                  {/* Checkbox 1 */}
                  <label className="wlc-chk-row" style={{ marginBottom: 4 }}>
                    <div className={`wlc-chk-box${check1 ? " on" : ""}`} onClick={() => setCheck1(v => !v)}>
                      {check1 && (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input type="checkbox" checked={check1} onChange={e => setCheck1(e.target.checked)} style={{ display: "none" }} />
                    <span style={{ fontFamily: F_BODY, fontSize: 15, color: "#F8FAFC", lineHeight: 1.5 }}>
                      {t.check1}
                    </span>
                  </label>

                  {/* Checkbox 2 */}
                  <label className="wlc-chk-row">
                    <div className={`wlc-chk-box${check2 ? " on" : ""}`} onClick={() => setCheck2(v => !v)}>
                      {check2 && (
                        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                          <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input type="checkbox" checked={check2} onChange={e => setCheck2(e.target.checked)} style={{ display: "none" }} />
                    <span style={{ fontFamily: F_BODY, fontSize: 15, color: "#F8FAFC", lineHeight: 1.5 }}>
                      {t.check2}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* ── CTA — t.continue_btn translates with lang ── */}
            <button
              className="wlc-btn"
              onClick={handleContinue}
              disabled={!canContinue}
              style={{ position: "relative", zIndex: 1 }}
            >
              {t.beginCheckin}
              <ArrowRight size={18} strokeWidth={2.2} />
            </button>

            {/* ── Footer ── */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 6, marginTop: 16, position: "relative", zIndex: 1 }}>
              <Lock size={11} color="#94A3B8" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: F_BODY, fontSize: 12, color: "#94A3B8", lineHeight: 1.5, textAlign: "center" }}>
                {t.disclaimer}
              </span>
            </div>

        </div>{/* end main card */}

      </div>{/* end scroll container */}

      <CrisisButton />
    </>
  );
}
