"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bot } from "lucide-react";
import CrisisButton from "../../components/CrisisButton";

// ── Deterministic starfield (matches welcome page exactly) ──
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

const MESSAGES = [
  { text: "You took a brave step just by being here.", emoji: "🌱" },
  { text: "Whatever you're feeling right now is completely valid.", emoji: "💙" },
  { text: "You are more than your diagnosis.", emoji: "✨" },
  { text: "Healing looks different for everyone — there's no wrong way.", emoji: "🌿" },
  { text: "You deserve support, care, and people in your corner.", emoji: "🤝" },
  { text: "One step at a time. That's all this is.", emoji: "👣" },
  { text: "You are not defined by this moment.", emoji: "🌅" },
  { text: "Reaching out takes courage. You have it.", emoji: "💪" },
];

const ANIMATIONS = [
  "float 4s ease-in-out infinite",
  "sway 3s ease-in-out infinite",
  "breathe 3.5s ease-in-out infinite",
  "bounce 2.5s ease-in-out infinite",
  "wobble 3s ease-in-out infinite",
  "spin-drift 4s ease-in-out infinite",
  "heartbeat 2s ease-in-out infinite",
  "orbit 5s linear infinite",
];

const JOURNEY_OPTS = ["Diagnosed today", "Within the last 3 months", "More than a year ago"];
const PROVIDER_OPTS = ["Yes", "No", "Not sure"];
const PRONOUN_OPTS  = ["She/Her", "He/Him", "They/Them", "Ze/Zir", "Prefer not to say"];
const MOOD_OPTS     = ["Scared", "Overwhelmed", "Numb", "Confused", "Sad", "Okay", "Prefer not to say"];

const F_HEADING = "'Plus Jakarta Sans', system-ui, sans-serif";
const F_BODY    = "'Inter', system-ui, sans-serif";

export default function CheckInPage() {
  const router = useRouter();

  // ── Companion (read-only from welcome page) ──
  const [companionName, setCompanionName]     = useState("Nova");
  const [selectedAvatar, setSelectedAvatar]   = useState("nova");
  const [customAvatarSrc, setCustomAvatarSrc] = useState("");
  const [avatarError, setAvatarError]         = useState(false);

  // ── Form state ──
  const [name, setName]       = useState("");
  const [journey, setJourney] = useState("");
  const [provider, setProvider] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [moods, setMoods]     = useState<string[]>([]);

  // ── Rotating reassurance ──
  const [msgIdx, setMsgIdx] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  // ── Avatar animation (random on mount) ──
  const [avatarAnimation] = useState(
    () => ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)]
  );

  useEffect(() => {
    // Load theme + companion from welcome page selections
    const savedTheme = localStorage.getItem("companion_theme") || "calm-sea";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const savedAvatarId = localStorage.getItem("companion_avatar_id") || "nova";
    setSelectedAvatar(savedAvatarId);
    if (savedAvatarId === "custom") {
      const savedCustom = localStorage.getItem("companion_custom_avatar");
      if (savedCustom) setCustomAvatarSrc(savedCustom);
    }
    const savedName = localStorage.getItem("companion_name") || "Nova";
    setCompanionName(savedName);

    // Restore any previously saved form values
    const savedUserName = localStorage.getItem("user_name") || "";
    setName(savedUserName);
    setJourney(localStorage.getItem("companion_journey") || "");
    setProvider(localStorage.getItem("companion_provider") || "");
    setPronouns(localStorage.getItem("companion_pronouns") || "");
    const savedMoods = localStorage.getItem("companion_moods");
    if (savedMoods) {
      try { setMoods(JSON.parse(savedMoods)); } catch { /* ignore */ }
    }
  }, []);

  // Cycle reassurance messages every 5 s with fade
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setMsgIdx(i => (i + 1) % MESSAGES.length);
        setFadeIn(true);
      }, 400);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  // ── Persist on every change ──
  const saveJourney = (val: string) => {
    setJourney(val);
    localStorage.setItem("companion_journey", val);
    localStorage.setItem("acute_support_mode", val === "Diagnosed today" ? "true" : "false");
  };
  const saveProvider = (val: string) => {
    setProvider(val);
    localStorage.setItem("companion_provider", val);
  };
  const savePronouns = (val: string) => {
    const next = pronouns === val ? "" : val;
    setPronouns(next);
    localStorage.setItem("companion_pronouns", next);
  };
  const toggleMood = (m: string) => {
    setMoods(prev => {
      const next = prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m];
      localStorage.setItem("companion_moods", JSON.stringify(next));
      return next;
    });
  };

  const handleStart = () => {
    if (name.trim()) localStorage.setItem("user_name", name.trim());
    localStorage.setItem("onboarding_complete", "true");
    router.push("/chat");
  };
  const handleSkip = () => {
    localStorage.setItem("onboarding_complete", "true");
    router.push("/chat");
  };

  // ── Chip style helpers ──
  const chipStyle = (active: boolean): React.CSSProperties => ({
    background: active
      ? "color-mix(in srgb, var(--accent) 20%, transparent)"
      : "rgba(255,255,255,0.06)",
    border: `1px solid ${active ? "var(--accent)" : "rgba(255,255,255,0.18)"}`,
    borderRadius: 20,
    padding: "7px 14px",
    fontFamily: F_BODY,
    fontSize: 13,
    color: active ? "var(--accent)" : "#ffffff",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    transition: "all 0.15s",
    fontWeight: active ? 600 : 400,
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: F_BODY,
    fontSize: 11,
    fontWeight: 600,
    color: "rgba(255,255,255,0.45)",
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  return (
    <>
      <style>{`
        html { background: transparent !important; }

        .ci-input {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 10px;
          padding: 10px 14px;
          font-family: ${F_BODY}; font-size: 14px; color: #ffffff;
          outline: none; transition: border-color 0.15s;
        }
        .ci-input::placeholder { color: rgba(255,255,255,0.35); }
        .ci-input:focus { border-color: var(--accent); }

        .ci-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.10);
          margin: 16px 0;
        }

        @media (max-width: 700px) {
          .ci-two-panel { flex-direction: column !important; }
          .ci-left-panel { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.10) !important; padding-bottom: 24px !important; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0px); animation-timing-function: ease-in; }
          50% { transform: translateY(-12px); animation-timing-function: ease-out; }
        }
        @keyframes wobble {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-4deg) scale(1.05); }
          75% { transform: rotate(4deg) scale(1.05); }
        }
        @keyframes spin-drift {
          0%, 100% { transform: translateY(0px) rotate(-2deg); }
          50% { transform: translateY(-6px) rotate(2deg); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.12); }
          30% { transform: scale(1); }
          45% { transform: scale(1.07); }
          60% { transform: scale(1); }
        }
        @keyframes orbit {
          0% { transform: translateX(0px) translateY(0px); }
          25% { transform: translateX(6px) translateY(-6px); }
          50% { transform: translateX(0px) translateY(-10px); }
          75% { transform: translateX(-6px) translateY(-6px); }
          100% { transform: translateX(0px) translateY(0px); }
        }
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 4px 24px color-mix(in srgb, var(--accent) 45%, transparent)); }
          50% { filter: drop-shadow(0 8px 36px color-mix(in srgb, var(--accent) 90%, transparent)); }
        }
      `}</style>

      {/* ── Fixed scroll wrapper (matches welcome page) ── */}
      <div style={{
        position: "fixed", inset: 0,
        overflowY: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        boxSizing: "border-box",
        background: "transparent",
      }}>

        {/* Deep space base */}
        <div aria-hidden style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "var(--bg)" }} />

        {/* Aurora sweep */}
        <div aria-hidden style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 110% 65% at 25% 65%, color-mix(in srgb, var(--accent) 68%, transparent) 0%, color-mix(in srgb, var(--accent) 42%, transparent) 35%, color-mix(in srgb, var(--accent) 15%, transparent) 62%, transparent 80%)",
          filter: "blur(45px)",
        }} />

        {/* Upper accent */}
        <div aria-hidden style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 45% at 75% 35%, color-mix(in srgb, var(--subtext) 32%, transparent) 0%, transparent 65%)",
          filter: "blur(40px)",
        }} />

        {/* Vignette */}
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
        <div style={{
          position: "relative",
          zIndex: 1,
          width: "92%",
          maxWidth: 900,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 28,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
          overflow: "visible",
          boxSizing: "border-box" as const,
          marginBottom: 32,
        }}>

          {/* Glass highlight */}
          <div aria-hidden style={{
            position: "absolute", inset: 0, borderRadius: 28,
            background: "linear-gradient(135deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.03) 35%, transparent 65%)",
            pointerEvents: "none",
          }} />

          {/* ── Back button ── */}
          <div style={{ position: "relative", zIndex: 1, padding: "20px 28px 0" }}>
            <button onClick={() => router.push("/onboarding/welcome")}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", color: "#ffffff", cursor: "pointer", fontSize: 14, opacity: 0.75, padding: 0, fontFamily: F_BODY }}>
              <ArrowLeft size={16} strokeWidth={2} />
              Back
            </button>
          </div>

          {/* ── Two-panel layout ── */}
          <div className="ci-two-panel" style={{ display: "flex", minHeight: 560 }}>

            {/* ═══ LEFT PANEL ═══ */}
            <div className="ci-left-panel" style={{
              width: 240,
              flexShrink: 0,
              padding: 28,
              borderRight: "1px solid rgba(255,255,255,0.10)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}>

              {/* Avatar */}
              <div style={{ marginBottom: 14, background: "transparent", border: "none", boxShadow: "none" }}>
                {selectedAvatar === "custom" && customAvatarSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={customAvatarSrc} alt={companionName}
                    style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover",
                      background: "transparent", display: "block",
                      animation: `${avatarAnimation}, glow-pulse 4s ease-in-out infinite` }} />
                ) : !avatarError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/avatars/${selectedAvatar}.png`} alt={companionName}
                    style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover",
                      background: "transparent", display: "block",
                      animation: `${avatarAnimation}, glow-pulse 4s ease-in-out infinite` }}
                    onError={() => setAvatarError(true)} />
                ) : (
                  <div style={{ width: 140, height: 140, borderRadius: "50%",
                    background: "linear-gradient(135deg, #22C55E, #14B8A6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    animation: `${avatarAnimation}, glow-pulse 4s ease-in-out infinite` }}>
                    <Bot size={36} color="white" strokeWidth={1.8} />
                  </div>
                )}
              </div>

              {/* Companion name + greeting */}
              <div style={{ fontFamily: F_HEADING, fontSize: 17, fontWeight: 700, color: "#ffffff", marginBottom: 4, textAlign: "center" }}>
                {companionName}
              </div>
              <div style={{ fontFamily: F_BODY, fontSize: 13, color: "rgba(255,255,255,0.6)", textAlign: "center", lineHeight: 1.5, marginBottom: 16 }}>
                Hi! Let&apos;s start with a few questions.
              </div>

              <hr className="ci-divider" style={{ width: "100%", border: "none", borderTop: "1px solid rgba(255,255,255,0.10)", margin: "0 0 16px" }} />

              {/* Rotating reassurance */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{
                  fontFamily: F_BODY,
                  fontSize: 15,
                  color: "#8ecfb0",
                  textAlign: "center",
                  lineHeight: 1.7,
                  minHeight: 72,
                  display: "flex",
                  alignItems: "center",
                  opacity: fadeIn ? 1 : 0,
                  transition: "opacity 0.4s ease",
                }}>
                  &ldquo;{MESSAGES[msgIdx].text}&rdquo;
                </div>

                {/* Emoji */}
                <div style={{
                  fontSize: 38,
                  opacity: fadeIn ? 1 : 0,
                  transition: "opacity 0.4s ease",
                  lineHeight: 1,
                }}>
                  {MESSAGES[msgIdx].emoji}
                </div>

                {/* Dot indicators */}
                <div style={{ display: "flex", gap: 5 }}>
                  {MESSAGES.map((_, i) => (
                    <div key={i} style={{
                      width: i === msgIdx ? 16 : 5,
                      height: 5,
                      borderRadius: 3,
                      background: i === msgIdx ? "var(--accent)" : "rgba(255,255,255,0.2)",
                      transition: "all 0.4s ease",
                    }} />
                  ))}
                </div>
              </div>

              <hr className="ci-divider" style={{ width: "100%", border: "none", borderTop: "1px solid rgba(255,255,255,0.10)", margin: "16px 0 12px" }} />

              {/* Privacy note */}
              <div style={{
                fontFamily: F_BODY,
                fontSize: 11,
                color: "rgba(255,255,255,0.38)",
                textAlign: "center",
                lineHeight: 1.5,
              }}>
                Everything you share is private and confidential. {companionName} is not a medical professional.
              </div>
            </div>

            {/* ═══ RIGHT PANEL ═══ */}
            <div style={{ flex: 1, padding: 32, display: "flex", flexDirection: "column", gap: 22, overflowY: "auto" }}>

              {/* What should I call you? */}
              <div>
                <label style={labelStyle}>What should I call you?</label>
                <input
                  className="ci-input"
                  type="text"
                  value={name}
                  placeholder="Name or nickname (optional)"
                  onChange={e => {
                    setName(e.target.value);
                    if (e.target.value.trim()) localStorage.setItem("user_name", e.target.value.trim());
                  }}
                />
              </div>

              {/* HIV journey */}
              <div>
                <label style={labelStyle}>Where are you in your HIV journey?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {JOURNEY_OPTS.map(opt => (
                    <button key={opt} style={chipStyle(journey === opt)} onClick={() => saveJourney(journey === opt ? "" : opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* HIV provider */}
              <div>
                <label style={labelStyle}>Do you have an HIV provider?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PROVIDER_OPTS.map(opt => (
                    <button key={opt} style={chipStyle(provider === opt)} onClick={() => saveProvider(provider === opt ? "" : opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pronouns */}
              <div>
                <label style={labelStyle}>What are your pronouns?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {PRONOUN_OPTS.map(opt => (
                    <button key={opt} style={chipStyle(pronouns === opt)} onClick={() => savePronouns(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood (multi-select) */}
              <div>
                <label style={labelStyle}>How are you feeling right now?</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {MOOD_OPTS.map(opt => (
                    <button key={opt} style={chipStyle(moods.includes(opt))} onClick={() => toggleMood(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* CTA */}
              <div>
                <button
                  onClick={handleStart}
                  style={{
                    width: "100%",
                    background: "var(--accent)",
                    color: "#fff",
                    fontFamily: F_HEADING,
                    fontWeight: 600,
                    fontSize: 17,
                    border: "1px solid rgba(255,255,255,0.14)",
                    borderRadius: 16,
                    padding: "16px 22px",
                    boxShadow: "0 8px 28px color-mix(in srgb, var(--accent) 35%, transparent)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 14px 36px color-mix(in srgb, var(--accent) 50%, transparent)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "none";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px color-mix(in srgb, var(--accent) 35%, transparent)";
                  }}
                >
                  Start conversation
                  <ArrowRight size={18} strokeWidth={2.2} />
                </button>

                {/* Skip */}
                <div style={{ textAlign: "center", marginTop: 12 }}>
                  <button
                    onClick={handleSkip}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontFamily: F_BODY, fontSize: 13,
                      color: "rgba(255,255,255,0.40)",
                    }}
                  >
                    · Skip for now ·
                  </button>
                </div>

                {/* Footer */}
                <div style={{
                  textAlign: "center", marginTop: 10,
                  fontFamily: F_BODY, fontSize: 11,
                  color: "rgba(255,255,255,0.28)", lineHeight: 1.5,
                }}>
                  Your conversation is private and confidential. {companionName} is not a medical professional but can guide you to help.
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <CrisisButton />
    </>
  );
}
