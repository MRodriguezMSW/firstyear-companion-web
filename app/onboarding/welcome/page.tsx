"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sprout, Globe, Palette, ChevronDown, Bot,
  CheckCircle2, Shield, ArrowRight, Lock,
} from "lucide-react";
import { LANG_TILES, S1_STRINGS, type LangCode6 } from "../translations";
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

const NOVA_FEATURES = [
  "Answer HIV questions",
  "Help you process emotions",
  "Guide you to resources",
  "Stay with you when things feel overwhelming",
];

// Deterministic starfield — avoids hydration mismatch
const STARS = Array.from({ length: 80 }, (_, i) => ({
  left: `${((i * 137.508 + 17) % 100).toFixed(2)}%`,
  top:  `${((i * 97.3   + 43) % 100).toFixed(2)}%`,
  size: i % 5 === 0 ? 2 : 1,
  opacity: +(0.4 + (i % 5) * 0.08).toFixed(2),
}));

const F_HEADING = "'Plus Jakarta Sans', sans-serif";
const F_BODY    = "'Inter', sans-serif";

export default function WelcomePage() {
  const router = useRouter();
  const [lang, setLang]               = useState<LangCode6>("en-US");
  const [check1, setCheck1]           = useState(false);
  const [check2, setCheck2]           = useState(false);
  const [langDropOpen, setLangDropOpen]   = useState(false);
  const [themeDropOpen, setThemeDropOpen] = useState(false);
  const [theme, setTheme]             = useState("calm-sea");
  const [companionName, setCompanionName] = useState("Nova");
  const langDropRef  = useRef<HTMLDivElement>(null);
  const themeDropRef = useRef<HTMLDivElement>(null);

  const currentLangLabel = LANG_TILES.find(l => l.code === lang)?.label ?? "English";
  const currentTheme     = THEMES.find(th => th.id === theme) ?? THEMES[0];
  const canContinue      = check1 && check2;

  useEffect(() => {
    const savedLang = localStorage.getItem("companion_language");
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
    const skipCheckin = localStorage.getItem("firstyear_skip_checkin") === "true";
    router.push(skipCheckin ? "/chat" : "/onboarding/checkin");
  };

  return (
    <>
      <style>{`
        .wlc-outer {
          min-height: 100vh;
          background:
            radial-gradient(circle at 20% 20%, rgba(34,211,238,0.18) 0%, transparent 32%),
            radial-gradient(circle at 80% 18%, rgba(16,185,129,0.16) 0%, transparent 30%),
            radial-gradient(circle at 50% 75%, rgba(59,130,246,0.12) 0%, transparent 38%),
            linear-gradient(180deg, #0B1020 0%, #0F172A 45%, #111827 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 32px 16px;
          box-sizing: border-box;
          position: relative;
        }
        .wlc-pill {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 20px; padding: 6px 12px;
          font-family: ${F_BODY}; font-size: 13px; color: #CBD5E1;
          cursor: pointer; white-space: nowrap; transition: background 0.15s;
        }
        .wlc-pill:hover { background: rgba(255,255,255,0.13); }
        .wlc-drop {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: rgba(10,16,32,0.97);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 12px; padding: 6px; z-index: 300;
          box-shadow: 0 8px 24px rgba(0,0,0,0.55);
        }
        .wlc-drop-opt {
          display: flex; align-items: center; gap: 8px;
          width: 100%; border: none; border-radius: 8px;
          padding: 8px 10px; cursor: pointer; text-align: left;
          font-family: ${F_BODY}; font-size: 13px;
          transition: background 0.12s;
        }
        .wlc-drop-opt:hover { background: rgba(34,197,94,0.12) !important; }
        .wlc-inner {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 20px 24px;
        }
        .wlc-chk-row {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 12px 14px; border-radius: 10px;
          cursor: pointer; transition: background 0.15s;
        }
        .wlc-chk-row:hover { background: rgba(255,255,255,0.04); }
        .wlc-chk-box {
          width: 18px; height: 18px; flex-shrink: 0; margin-top: 2px;
          border-radius: 4px; border: 1.5px solid rgba(255,255,255,0.3);
          background: transparent; display: flex; align-items: center;
          justify-content: center; transition: all 0.15s; cursor: pointer;
        }
        .wlc-chk-box.on { background: #22C55E; border-color: #22C55E; }
        .wlc-btn {
          width: 100%; margin-top: 24px;
          background: linear-gradient(135deg, #22C55E 0%, #10B981 55%, #14B8A6 100%);
          color: #F8FAFC; font-family: ${F_HEADING}; font-weight: 600; font-size: 17px;
          border: 1px solid rgba(255,255,255,0.12); border-radius: 16px;
          padding: 16px 22px;
          box-shadow: 0 8px 24px rgba(16,185,129,0.28);
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .wlc-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(16,185,129,0.42);
        }
        .wlc-btn:active:not(:disabled) { transform: translateY(0); }
        .wlc-btn:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
        .wlc-features { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; margin-top: 16px; }
        @media (max-width: 600px) {
          .wlc-outer { padding: 20px 12px; }
          .wlc-headline { font-size: 26px !important; }
          .wlc-features { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Starfield */}
      <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {STARS.map((s, i) => (
          <div key={i} style={{
            position: "absolute",
            left: s.left, top: s.top,
            width: s.size, height: s.size,
            borderRadius: "50%",
            background: "white",
            opacity: s.opacity,
          }} />
        ))}
      </div>

      <div className="wlc-outer">
        {/* Main card */}
        <div style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: 28,
          boxShadow: "0 10px 30px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)",
          padding: 32,
          maxWidth: 720,
          width: "92%",
          position: "relative",
          zIndex: 1,
          boxSizing: "border-box" as const,
        }}>

          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sprout size={18} color="#22C55E" strokeWidth={2.2} />
              <span style={{ fontFamily: F_HEADING, fontSize: 26, fontWeight: 700, color: "#F8FAFC", lineHeight: 1 }}>
                FirstYear Companion
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              {/* Language pill */}
              <div ref={langDropRef} style={{ position: "relative" }}>
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
                          background: lang === l.code ? "rgba(34,197,94,0.16)" : "transparent",
                          color: lang === l.code ? "#22C55E" : "#CBD5E1",
                          fontWeight: lang === l.code ? 600 : 400,
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
              <div ref={themeDropRef} style={{ position: "relative" }}>
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
                          {th.swatches.map((c, i) => <div key={i} style={{ width: 13, height: 16, background: c }} />)}
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

          {/* Hero text */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <p className="wlc-headline" style={{ fontFamily: F_HEADING, fontSize: 32, fontWeight: 600, color: "#F8FAFC", margin: "0 0 8px" }}>
              You are not alone in this.
            </p>
            <p style={{ fontFamily: F_BODY, fontSize: 16, color: "#CBD5E1", margin: "0 0 4px" }}>
              A safe place for people newly diagnosed with HIV.
            </p>
            <p style={{ fontFamily: F_BODY, fontSize: 16, color: "#CBD5E1", margin: 0 }}>
              Ask questions, find resources, or just talk.
            </p>
          </div>

          {/* Meet Nova card */}
          <div className="wlc-inner" style={{ marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #22C55E, #14B8A6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 18px rgba(34,197,94,0.3)",
              }}>
                <Bot size={28} color="white" strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontFamily: F_HEADING, fontSize: 18, fontWeight: 600, color: "#F8FAFC", marginBottom: 4 }}>
                  Meet {companionName}
                </div>
                <div style={{ fontFamily: F_BODY, fontSize: 13, color: "#94A3B8", lineHeight: 1.5 }}>
                  Your AI companion for the first year after diagnosis.
                </div>
              </div>
            </div>

            <div className="wlc-features">
              {NOVA_FEATURES.map((feature, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckCircle2 size={16} color="#22C55E" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: F_BODY, fontSize: 14, color: "#CBD5E1", lineHeight: 1.45 }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Before we begin card */}
          <div className="wlc-inner" style={{ marginTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Shield size={14} color="#94A3B8" strokeWidth={2} />
              <span style={{ fontFamily: F_BODY, fontSize: 11, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Before we begin
              </span>
            </div>

            {/* Checkbox 1 */}
            <label className="wlc-chk-row" style={{ marginBottom: 4 }}>
              <div
                className={`wlc-chk-box${check1 ? " on" : ""}`}
                onClick={() => setCheck1(v => !v)}
              >
                {check1 && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <input type="checkbox" checked={check1} onChange={e => setCheck1(e.target.checked)} style={{ display: "none" }} />
              <span style={{ fontFamily: F_BODY, fontSize: 15, color: "#F8FAFC", lineHeight: 1.5 }}>
                I understand Nova is an AI companion
              </span>
            </label>

            {/* Checkbox 2 */}
            <label className="wlc-chk-row">
              <div
                className={`wlc-chk-box${check2 ? " on" : ""}`}
                onClick={() => setCheck2(v => !v)}
              >
                {check2 && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <input type="checkbox" checked={check2} onChange={e => setCheck2(e.target.checked)} style={{ display: "none" }} />
              <span style={{ fontFamily: F_BODY, fontSize: 15, color: "#F8FAFC", lineHeight: 1.5 }}>
                I understand this app does not replace medical care
              </span>
            </label>
          </div>

          {/* Continue button */}
          <button className="wlc-btn" onClick={handleContinue} disabled={!canContinue}>
            Begin your check-in
            <ArrowRight size={18} strokeWidth={2.2} />
          </button>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 6, marginTop: 16 }}>
            <Lock size={11} color="#94A3B8" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: F_BODY, fontSize: 12, color: "#94A3B8", lineHeight: 1.5, textAlign: "center" }}>
              Beta version. This tool is still evolving and is not a clinical service. If you are in crisis, call 988 or emergency services.
            </span>
          </div>

        </div>
      </div>

      <CrisisButton />
    </>
  );
}
