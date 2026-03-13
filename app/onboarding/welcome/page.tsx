"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sprout, Globe, ChevronDown, Bot, Camera,
  CheckCircle2, ArrowRight, Lock,
} from "lucide-react";
import { LANG_TILES, S1_STRINGS, getS1, type LangCode6 } from "../translations";
import CrisisButton from "../../components/CrisisButton";

const AVATARS = [
  { id: "nova",  name: "Nova",  theme: "calm-sea",    accent: "#88BDF2", swatches: ["#384959","#BDDDFC","#88BDF2"] },
  { id: "luna",  name: "Luna",  theme: "periwinkle",  accent: "#CCCCFF", swatches: ["#292966","#CCCCFF","#A3A3CC"] },
  { id: "sage",  name: "Sage",  theme: "quiet-grove", accent: "#BAC095", swatches: ["#3D4127","#D4DE95","#BAC095"] },
  { id: "ember", name: "Ember", theme: "hot-sunset",  accent: "#FB6A2C", swatches: ["#8C1946","#FFB8DC","#FB6A2C"] },
  { id: "rio",   name: "Rio",   theme: "deep-teal",   accent: "#4F7C82", swatches: ["#0B2E33","#B8E3E9","#4F7C82"] },
  { id: "kai",   name: "Kai",   theme: "ocean-deep",  accent: "#82C8E5", swatches: ["#000080","#82C8E5","#0047AB"] },
  { id: "wren",  name: "Wren",  theme: "linen-moss",  accent: "#DBD1ED", swatches: ["#4A4220","#EDE8D0","#DBD1ED"] },
  { id: "lea",   name: "Lea",   theme: "rose-dusk",   accent: "#DCA1A1", swatches: ["#4A2A2A","#DCA1A1","#8E4585"] },
  { id: "milo",  name: "Milo",  theme: "harvest",     accent: "#FFCE1B", swatches: ["#7A3200","#FFCE1B","#069494"] },
  { id: "aria",  name: "Aria",  theme: "blue-violet", accent: "#A4A5F5", swatches: ["#2A2A5A","#B5C7EB","#A4A5F5"] },
  { id: "zeke",  name: "Zeke",  theme: "meadow-mist", accent: "#68BA7F", swatches: ["#253D2C","#CFFFDC","#68BA7F"] },
  { id: "ivy",   name: "Ivy",   theme: "garden-fresh",accent: "#93C572", swatches: ["#2A3A1A","#F5F5DC","#93C572"] },
  { id: "rex",   name: "Rex",   theme: "teal-earth",  accent: "#81D8D0", swatches: ["#2A3A2A","#81D8D0","#AE82D9"] },
  { id: "mia",   name: "Mia",   theme: "warm-clay",   accent: "#E68057", swatches: ["#7A3020","#FFD3AC","#BF7587"] },
  { id: "finn",  name: "Finn",  theme: "charcoal-sky",accent: "#CBCBCB", swatches: ["#4A4A4A","#FFFFE3","#6D8196"] },
];

// Theme dot colors for custom photo picker (one per theme, same order as AVATARS)
const CUSTOM_THEME_DOTS = AVATARS.map(av => ({ theme: av.theme, color: av.accent }));

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
  const [langDropOpen, setLangDropOpen]     = useState(false);
  const [avatarDropOpen, setAvatarDropOpen] = useState(false);
  const [companionName, setCompanionName]   = useState("Nova");
  const [avatarError, setAvatarError]       = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("nova");
  const [customAvatarSrc, setCustomAvatarSrc] = useState("");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [selectedTheme, setSelectedTheme]   = useState("calm-sea");
  const langDropRef   = useRef<HTMLDivElement>(null);
  const avatarDropRef = useRef<HTMLDivElement>(null);
  const fileInputRef  = useRef<HTMLInputElement>(null);

  const currentLangLabel = LANG_TILES.find(l => l.code === lang)?.label ?? "English";
  const canContinue      = check1 && check2;

  // ── Translation: re-derived on every render when `lang` changes ──
  const t = getS1(lang);

  useEffect(() => {
    const savedLang = localStorage.getItem("companion_language") || localStorage.getItem("firstyear_language");
    if (savedLang && Object.keys(S1_STRINGS).includes(savedLang))
      setLang(savedLang as LangCode6);
    const savedAvatarId = localStorage.getItem("companion_avatar_id") || "nova";
    setSelectedAvatar(savedAvatarId);
    if (savedAvatarId === "custom") {
      setShowThemePicker(true);
      const savedCustom = localStorage.getItem("companion_custom_avatar");
      if (savedCustom) setCustomAvatarSrc(savedCustom);
    }
    const savedTheme = localStorage.getItem("companion_theme") || "calm-sea";
    setSelectedTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
    setCompanionName(localStorage.getItem("companion_name") || "Nova");
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langDropRef.current   && !langDropRef.current.contains(e.target   as Node)) setLangDropOpen(false);
      if (avatarDropRef.current && !avatarDropRef.current.contains(e.target as Node)) setAvatarDropOpen(false);
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

  const handleAvatarSelect = (av: typeof AVATARS[0]) => {
    setSelectedAvatar(av.id);
    setSelectedTheme(av.theme);
    setCompanionName(av.name);
    setShowThemePicker(false);
    setAvatarError(false);
    setAvatarDropOpen(false);
    localStorage.setItem("companion_avatar_id", av.id);
    localStorage.setItem("companion_name", av.name);
    localStorage.setItem("companion_theme", av.theme);
    document.documentElement.setAttribute("data-theme", av.theme);
  };

  const handleCustomPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setCustomAvatarSrc(src);
      setSelectedAvatar("custom");
      setShowThemePicker(true);
      localStorage.setItem("companion_avatar_id", "custom");
      localStorage.setItem("companion_custom_avatar", src);
    };
    reader.readAsDataURL(file);
  };

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    localStorage.setItem("companion_theme", themeId);
    document.documentElement.setAttribute("data-theme", themeId);
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
          font-family: ${F_BODY}; font-size: 13px; color: #ffffff;
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
        .wlc-drop-opt:hover { background: color-mix(in srgb, var(--accent) 12%, transparent) !important; }

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
          background: var(--accent);
          color: #fff; font-family: ${F_HEADING}; font-weight: 600; font-size: 17px;
          border: 1px solid rgba(255,255,255,0.14); border-radius: 16px;
          padding: 16px 22px;
          box-shadow: 0 8px 28px color-mix(in srgb, var(--accent) 35%, transparent);
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .wlc-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 14px 36px color-mix(in srgb, var(--accent) 50%, transparent);
        }
        .wlc-btn:active:not(:disabled) { transform: translateY(0); }
        .wlc-btn:disabled { opacity: 0.38; cursor: not-allowed; box-shadow: none; }

        /* Feature list */
        .wlc-features { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }

        /* Responsive */
        @media (max-width: 768px) {
          .wlc-card { padding: 20px !important; }
          ..wlc-headline { font-size: 18px !important; }
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

        {/* Deep space base — reacts to theme via var(--bg) */}
        <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "var(--bg)" }} />

        {/* Aurora sweep — uses theme accent colour */}
        <div aria-hidden style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 110% 65% at 25% 65%, color-mix(in srgb, var(--accent) 68%, transparent) 0%, color-mix(in srgb, var(--accent) 42%, transparent) 35%, color-mix(in srgb, var(--accent) 15%, transparent) 62%, transparent 80%)",
          filter:"blur(45px)" }} />

        {/* Upper accent — uses theme subtext colour */}
        <div aria-hidden style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
          background:"radial-gradient(ellipse 70% 45% at 75% 35%, color-mix(in srgb, var(--subtext) 32%, transparent) 0%, transparent 65%)",
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
              background: "var(--text)",
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
            maxWidth: 900,
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
              display: "grid", gridTemplateColumns: "1fr auto 1fr",
              alignItems: "center",
              position: "relative", zIndex: 10, overflow: "visible",
            }}>
              {/* Left — empty spacer */}
              <div />
              {/* Center — logo */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <Sprout size={18} color="#22C55E" strokeWidth={2.2} />
                <span style={{ fontFamily: F_HEADING, fontSize: "1.5rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
                  FirstYear Companion
                </span>
              </div>
              {/* Right — pills */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end", flexShrink: 0, overflow: "visible" }}>

                {/* Language pill */}
                <div ref={langDropRef} className="wlc-drop-anchor">
                  <button className="wlc-pill" onClick={() => { setLangDropOpen(v => !v); setAvatarDropOpen(false); }}>
                    <Globe size={13} strokeWidth={2} />
                    {currentLangLabel}
                    <ChevronDown size={12} strokeWidth={2} style={{ transform: langDropOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                  </button>
                  {langDropOpen && (
                    <div className="wlc-drop" style={{ minWidth: 165 }}>
                      {LANG_TILES.map(l => (
                        <button key={l.code} className="wlc-drop-opt" onClick={() => handleLang(l.code)}
                          style={{ background: lang === l.code ? "color-mix(in srgb, var(--accent) 16%, transparent)" : "transparent", color: lang === l.code ? "var(--accent)" : "#ffffff", fontWeight: lang === l.code ? 600 : 400 }}
                        >
                          <span style={{ flex: 1 }}>{l.label}</span>
                          {lang === l.code && <span style={{ fontSize: 11, color: "var(--accent)" }}>✓</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Avatar / companion pill */}
                <div ref={avatarDropRef} className="wlc-drop-anchor">
                  <button className="wlc-pill" onClick={() => { setAvatarDropOpen(v => !v); setLangDropOpen(false); }}>
                    {selectedAvatar === "custom" && customAvatarSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={customAvatarSrc} alt="" style={{ width: 16, height: 16, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/avatars/${selectedAvatar}.png`} alt="" style={{ width: 16, height: 16, borderRadius: "50%", objectFit: "cover" }} onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    )}
                    {companionName}
                    <ChevronDown size={12} strokeWidth={2} style={{ transform: avatarDropOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
                  </button>
                  {avatarDropOpen && (
                    <div className="wlc-drop" style={{ minWidth: 215, maxHeight: 320, overflowY: "auto" }}>
                      <div style={{ fontFamily: F_BODY, fontSize: 11, fontWeight: 600, color: "rgba(203,213,225,0.45)", letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px 8px" }}>
                        Choose companion
                      </div>
                      {AVATARS.map(av => (
                        <button key={av.id} className="wlc-drop-opt" onClick={() => handleAvatarSelect(av)}
                          style={{ background: selectedAvatar === av.id ? "rgba(255,255,255,0.08)" : "transparent", color: "#ffffff" }}
                        >
                          {/* 3-color swatch strip */}
                          <div style={{ display: "flex", flexShrink: 0, overflow: "hidden", borderRadius: 2 }}>
                            {av.swatches.map((c, j) => <div key={j} style={{ width: 10, height: 16, background: c }} />)}
                          </div>
                          {/* Avatar image */}
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={`/avatars/${av.id}.png`} alt={av.name} style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", flexShrink: 0,
                            boxShadow: selectedAvatar === av.id ? `0 0 0 2px ${av.accent}` : "none" }} />
                          <span style={{ flex: 1, whiteSpace: "nowrap" }}>{av.name}</span>
                          {selectedAvatar === av.id && <span style={{ fontSize: 11, color: av.accent }}>✓</span>}
                        </button>
                      ))}
                      {/* My photo option */}
                      <button className="wlc-drop-opt" onClick={() => fileInputRef.current?.click()}
                        style={{ background: selectedAvatar === "custom" ? "rgba(255,255,255,0.08)" : "transparent", color: "#CBD5E1" }}
                      >
                        <div style={{ width: 30, height: 16, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                          border: "1.5px dashed rgba(255,255,255,0.3)", borderRadius: 4 }}>
                          <Camera size={10} strokeWidth={1.5} />
                        </div>
                        {selectedAvatar === "custom" && customAvatarSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={customAvatarSrc} alt="" style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 22, height: 22, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Camera size={10} strokeWidth={1.5} color="rgba(255,255,255,0.4)" />
                          </div>
                        )}
                        <span style={{ flex: 1, whiteSpace: "nowrap" }}>My photo</span>
                        {selectedAvatar === "custom" && <span style={{ fontSize: 11, color: "#22C55E" }}>✓</span>}
                      </button>
                      {/* Theme dots — only shown when custom photo is selected */}
                      {showThemePicker && selectedAvatar === "custom" && (
                        <div style={{ padding: "8px 10px 4px", borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 4 }}>
                          <div style={{ fontFamily: F_BODY, fontSize: 10, color: "rgba(203,213,225,0.45)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Pick theme</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {CUSTOM_THEME_DOTS.map(td => (
                              <button key={td.theme} onClick={() => handleThemeSelect(td.theme)} title={td.theme.replace(/-/g, " ")}
                                style={{ width: 20, height: 20, borderRadius: "50%", background: td.color, padding: 0, border: selectedTheme === td.theme ? "2px solid #fff" : "2px solid transparent",
                                  boxShadow: selectedTheme === td.theme ? "0 0 0 2px rgba(255,255,255,0.35)" : "none", cursor: "pointer", transition: "all 0.15s" }} />
                            ))}
                          </div>
                        </div>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleCustomPhoto} />
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* ── Hero text ── */}
            <div style={{ textAlign: "center", marginTop: 28, position: "relative", zIndex: 1 }}>
              <p
                className="wlc-headline"
                style={{ fontFamily: F_HEADING, fontSize: "1.25rem", fontWeight: 700, color: "#fff", margin: "0 0 10px" }}
              >
                {t.tagline}
              </p>
              <p style={{ fontFamily: F_BODY, fontSize: 13, color: "#ffffff", margin: "0 0 4px" }}>
                {t.subtitle1}
              </p>
              <p style={{ fontFamily: F_BODY, fontSize: 13, color: "#ffffff", margin: 0 }}>
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
              {/* LEFT — selected avatar (updates when companion is changed via dropdown) */}
              <div>
                {selectedAvatar === "custom" && customAvatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={customAvatarSrc} alt={companionName} width={80} height={80}
                    style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", filter: "drop-shadow(0 4px 16px rgba(34,197,94,0.55))", display: "block" }} />
                ) : !avatarError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/avatars/${selectedAvatar}.png`} alt={companionName}
                    width={80} height={80}
                    style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", filter: "drop-shadow(0 4px 16px rgba(34,197,94,0.55))", display: "block" }}
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #22C55E, #14B8A6)", display: "flex", alignItems: "center", justifyContent: "center", filter: "drop-shadow(0 4px 16px rgba(34,197,94,0.55))" }}>
                    <Bot size={32} color="white" strokeWidth={1.8} />
                  </div>
                )}
              </div>

              {/* RIGHT — content col */}
              <div>
                <div style={{ fontFamily: F_HEADING, fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 4 }}>
                  {t.meetCompanion.replace("{{name}}", companionName)}
                </div>
                <div style={{ fontFamily: F_BODY, fontSize: 14, color: "#ffffff", lineHeight: 1.5 }}>
                  {t.companionSubtitle}
                </div>

                {/* Features card */}
                <div style={{
                  background: "color-mix(in srgb, var(--bg) 55%, transparent)",
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
                      <span style={{ fontFamily: F_BODY, fontSize: 14, color: "#ffffff", lineHeight: 1.45 }}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Before we begin card */}
                <div style={{
                  background: "color-mix(in srgb, var(--bg) 55%, transparent)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 12,
                  padding: 16,
                  marginTop: 12,
                }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: F_BODY, fontSize: 16, fontWeight: 600, color: "#ffffff" }}>
                      {t.beforeWeBegin}
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
                    <span style={{ fontFamily: F_BODY, fontSize: 15, color: "#ffffff", lineHeight: 1.5 }}>
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
                    <span style={{ fontFamily: F_BODY, fontSize: 15, color: "#ffffff", lineHeight: 1.5 }}>
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
              <Lock size={11} color="#ffffff" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontFamily: F_BODY, fontSize: 12, color: "#ffffff", lineHeight: 1.5, textAlign: "center" }}>
                {t.disclaimer}
              </span>
            </div>

        </div>{/* end main card */}

      </div>{/* end scroll container */}

      <CrisisButton />
    </>
  );
}
