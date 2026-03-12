"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sprout, Globe, Palette, ChevronDown, Bot,
  CheckCircle2, Shield, ArrowRight, Lock,
} from "lucide-react";
import { LANG_TILES, S1_STRINGS, type LangCode6 } from "../translations";
import CrisisButton from "../../components/CrisisButton";
import FeedbackButton from "../../components/FeedbackButton";

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

const ACCENT = "#68ba7f";
const MUTED = "rgba(200,220,215,0.55)";
const TEXT = "rgba(230,240,236,0.92)";

const NOVA_FEATURES = [
  "Answer HIV questions",
  "Help you process emotions",
  "Guide you to resources",
  "Stay with you when things feel overwhelming",
];

// Static starfield: deterministic positions to avoid hydration mismatch
const STARS = Array.from({ length: 80 }, (_, i) => ({
  x: ((i * 137.508 + 23) % 100).toFixed(2),
  y: ((i * 97.3 + 11) % 100).toFixed(2),
  r: i % 3 === 0 ? 1.2 : i % 5 === 0 ? 0.9 : 0.6,
  o: (0.3 + (i % 7) * 0.1).toFixed(2),
}));

export default function WelcomePage() {
  const router = useRouter();
  const [lang, setLang] = useState<LangCode6>("en-US");
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [langDropOpen, setLangDropOpen] = useState(false);
  const [themeDropOpen, setThemeDropOpen] = useState(false);
  const [theme, setTheme] = useState("calm-sea");
  const [companionName, setCompanionName] = useState("Nova");
  const langDropRef = useRef<HTMLDivElement>(null);
  const themeDropRef = useRef<HTMLDivElement>(null);

  const currentLangLabel = LANG_TILES.find(l => l.code === lang)?.label ?? "English";
  const currentTheme = THEMES.find(th => th.id === theme) ?? THEMES[0];
  const canContinue = check1 && check2;

  useEffect(() => {
    const savedLang = localStorage.getItem("companion_language");
    const validCodes = Object.keys(S1_STRINGS);
    if (savedLang && validCodes.includes(savedLang)) setLang(savedLang as LangCode6);
    const savedTheme = localStorage.getItem("companion_theme") || "calm-sea";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    const savedName = localStorage.getItem("companion_name") || "Nova";
    setCompanionName(savedName);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langDropRef.current && !langDropRef.current.contains(e.target as Node)) setLangDropOpen(false);
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
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "radial-gradient(ellipse at 30% 50%, #0d2f2a 0%, #0a1a2e 40%, #050d1a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      <style>{`
        .wlc-scrollarea { overflow-y: auto; max-height: 100vh; width: 100%; padding: 32px 16px; box-sizing: border-box; }
        .wlc-card { background: rgba(255,255,255,0.07); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 40px; max-width: 720px; width: 92%; margin: auto; box-sizing: border-box; }
        .wlc-inner { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px 24px; }
        .wlc-pill { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.13); border-radius: 20px; padding: 6px 12px; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; color: rgba(200,220,215,0.85); white-space: nowrap; transition: background 0.15s; }
        .wlc-pill:hover { background: rgba(255,255,255,0.12); }
        .wlc-drop { position: absolute; top: calc(100% + 6px); right: 0; background: rgba(10,18,30,0.97); border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; padding: 6px; z-index: 200; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
        .wlc-drop-opt { display: flex; align-items: center; gap: 8px; width: 100%; border: none; border-radius: 8px; padding: 8px 10px; cursor: pointer; text-align: left; transition: background 0.12s; font-family: 'DM Sans', sans-serif; font-size: 13px; }
        .wlc-drop-opt:hover { background: rgba(104,186,127,0.12) !important; }
        .wlc-chk-label { display: flex; align-items: flex-start; gap: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 10px; padding: 12px 14px; cursor: pointer; transition: all 0.2s; }
        .wlc-chk-label.checked { background: rgba(104,186,127,0.09); border-color: rgba(104,186,127,0.35); }
        .wlc-chk-label:hover { background: rgba(255,255,255,0.07); }
        .wlc-btn { width: 100%; background: linear-gradient(135deg, rgba(104,186,127,0.8), rgba(56,130,100,0.9)); border: none; border-radius: 50px; padding: 16px 32px; font-family: 'DM Sans', sans-serif; font-size: 18px; font-weight: 600; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; box-shadow: 0 4px 24px rgba(104,186,127,0.3); }
        .wlc-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 32px rgba(104,186,127,0.4); }
        .wlc-btn:active:not(:disabled) { transform: translateY(0); }
        .wlc-btn:disabled { background: rgba(104,186,127,0.18); color: rgba(104,186,127,0.35); cursor: not-allowed; box-shadow: none; }
        .wlc-features { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin-top: 16px; }
        @media (max-width: 600px) {
          .wlc-card { padding: 24px 20px; }
          .wlc-title { font-size: 22px !important; }
          .wlc-headline { font-size: 18px !important; }
          .wlc-features { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Starfield SVG */}
      <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        {STARS.map((s, i) => (
          <circle key={i} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="white" opacity={s.o} />
        ))}
      </svg>

      {/* Aurora glow */}
      <div aria-hidden style={{
        position: "absolute", top: "10%", left: "-5%",
        width: 600, height: 500,
        background: "radial-gradient(ellipse, rgba(56,180,120,0.13) 0%, rgba(30,120,100,0.07) 40%, transparent 70%)",
        filter: "blur(60px)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* Scrollable content */}
      <div className="wlc-scrollarea" style={{ position: "relative", zIndex: 1 }}>
        <div className="wlc-card">

          {/* Top row: title + dropdowns */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Sprout size={20} color={ACCENT} strokeWidth={2.2} />
              <span className="wlc-title" style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, color: TEXT, lineHeight: 1.1 }}>
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
                  <div className="wlc-drop" style={{ minWidth: 160 }}>
                    {LANG_TILES.map(l => (
                      <button
                        key={l.code}
                        className="wlc-drop-opt"
                        onClick={() => handleLang(l.code)}
                        style={{ background: lang === l.code ? "rgba(104,186,127,0.18)" : "transparent", color: lang === l.code ? ACCENT : "rgba(210,225,220,0.85)", fontWeight: lang === l.code ? 600 : 400 }}
                      >
                        <span style={{ flex: 1 }}>{l.label}</span>
                        {lang === l.code && <span style={{ fontSize: 11, color: ACCENT }}>✓</span>}
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
                  <div className="wlc-drop" style={{ minWidth: 210, maxHeight: 280, overflowY: "auto" }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: "rgba(200,220,215,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px 8px" }}>
                      Select theme
                    </div>
                    {THEMES.map(th => (
                      <button
                        key={th.id}
                        className="wlc-drop-opt"
                        onClick={() => handleTheme(th.id)}
                        style={{ background: theme === th.id ? "rgba(255,255,255,0.1)" : "transparent", color: "rgba(210,225,220,0.85)" }}
                      >
                        <div style={{ display: "flex", flexShrink: 0, overflow: "hidden", borderRadius: 2 }}>
                          {th.swatches.map((c, i) => <div key={i} style={{ width: 13, height: 16, background: c }} />)}
                        </div>
                        <span style={{ flex: 1, whiteSpace: "nowrap" }}>{th.name}</span>
                        {theme === th.id && <span style={{ fontSize: 11, color: "rgba(200,220,215,0.6)" }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hero text */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <p className="wlc-headline" style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 300, color: TEXT, margin: "0 0 8px" }}>
              You are not alone in this.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: MUTED, margin: "0 0 4px" }}>
              A safe place for people newly diagnosed with HIV.
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: MUTED, margin: 0 }}>
              Ask questions, find resources, or just talk.
            </p>
          </div>

          {/* Meet Nova card */}
          <div className="wlc-inner" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
              {/* Avatar */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg, #1e8c6e 0%, #0f4f3c 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(56,180,120,0.3)",
              }}>
                <Bot size={32} color="rgba(200,240,225,0.9)" strokeWidth={1.8} />
              </div>
              <div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: TEXT, marginBottom: 4 }}>
                  Meet {companionName}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: MUTED, lineHeight: 1.5 }}>
                  Your AI companion for the first year after diagnosis.
                </div>
              </div>
            </div>

            <div className="wlc-features">
              {NOVA_FEATURES.map((feature, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckCircle2 size={16} color={ACCENT} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(210,235,225,0.8)", lineHeight: 1.4 }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Before we begin card */}
          <div className="wlc-inner" style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              <Shield size={14} color={MUTED} strokeWidth={2} />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Before we begin
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label className={`wlc-chk-label${check1 ? " checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={check1}
                  onChange={e => setCheck1(e.target.checked)}
                  style={{ marginTop: 2, accentColor: ACCENT, flexShrink: 0, width: 16, height: 16, cursor: "pointer" }}
                />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: TEXT, lineHeight: 1.5 }}>
                  I understand Nova is an AI companion
                </span>
              </label>

              <label className={`wlc-chk-label${check2 ? " checked" : ""}`}>
                <input
                  type="checkbox"
                  checked={check2}
                  onChange={e => setCheck2(e.target.checked)}
                  style={{ marginTop: 2, accentColor: ACCENT, flexShrink: 0, width: 16, height: 16, cursor: "pointer" }}
                />
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: TEXT, lineHeight: 1.5 }}>
                  I understand this app does not replace medical care
                </span>
              </label>
            </div>
          </div>

          {/* Continue button */}
          <button className="wlc-btn" onClick={handleContinue} disabled={!canContinue}>
            Begin your check-in
            <ArrowRight size={20} strokeWidth={2.2} />
          </button>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 6, marginTop: 16, textAlign: "center" }}>
            <Lock size={12} color={MUTED} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
              Beta version. This tool is still evolving and is not a clinical service. If you are in crisis, call 988 or emergency services.
            </span>
          </div>

        </div>
      </div>

      <FeedbackButton />
      <CrisisButton />
    </div>
  );
}
