"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { getS2 } from "../translations";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";

const AVATARS = [
  { id: "nova",  name: "Nova",  theme: "calm-sea" },
  { id: "luna",  name: "Luna",  theme: "periwinkle" },
  { id: "sage",  name: "Sage",  theme: "quiet-grove" },
  { id: "ember", name: "Ember", theme: "hot-sunset" },
  { id: "rio",   name: "Rio",   theme: "deep-teal" },
  { id: "kai",   name: "Kai",   theme: "ocean-deep" },
  { id: "wren",  name: "Wren",  theme: "linen-moss" },
  { id: "lea",   name: "Lea",   theme: "rose-dusk" },
  { id: "milo",  name: "Milo",  theme: "harvest" },
  { id: "aria",  name: "Aria",  theme: "blue-violet" },
  { id: "zeke",  name: "Zeke",  theme: "meadow-mist" },
  { id: "ivy",   name: "Ivy",   theme: "garden-fresh" },
  { id: "rex",   name: "Rex",   theme: "teal-earth" },
  { id: "mia",   name: "Mia",   theme: "warm-clay" },
  { id: "finn",  name: "Finn",  theme: "charcoal-sky" },
];

const THEME_DOTS = [
  { theme: "calm-sea",     color: "#88BDF2" },
  { theme: "periwinkle",   color: "#CCCCFF" },
  { theme: "quiet-grove",  color: "#BAC095" },
  { theme: "hot-sunset",   color: "#FD3DB5" },
  { theme: "deep-teal",    color: "#4F7C82" },
  { theme: "ocean-deep",   color: "#0047AB" },
  { theme: "linen-moss",   color: "#DBD1ED" },
  { theme: "rose-dusk",    color: "#DCA1A1" },
  { theme: "harvest",      color: "#FFCE1B" },
  { theme: "blue-violet",  color: "#A4A5F5" },
  { theme: "meadow-mist",  color: "#68BA7F" },
  { theme: "garden-fresh", color: "#93C572" },
  { theme: "teal-earth",   color: "#81D8D0" },
  { theme: "warm-clay",    color: "#E68057" },
  { theme: "charcoal-sky", color: "#CBCBCB" },
];

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
  const [companionName, setCompanionName] = useState("Nova");

  // Avatar picker state
  const [selectedAvatar, setSelectedAvatar] = useState("nova");
  const [customAvatarSrc, setCustomAvatarSrc] = useState("");
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("calm-sea");
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const saved = localStorage.getItem("companion_language") ?? "en-US";
    setLang(saved);

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

    const savedCompanionName = localStorage.getItem("companion_name");
    if (savedCompanionName) setCompanionName(savedCompanionName);
  }, []);

  const t = getS2(lang);

  const toggleMood = (m: string) =>
    setMoods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);

  const handleProviderSelect = (opt: string) => {
    setProvider(opt);
    if (opt === t.yesno[1]) setModal("provider");
  };

  const handleMedSelect = (opt: string) => {
    setMedication(opt);
    if (opt === t.yesno[1]) setModal("meds");
  };

  const handleAvatarSelect = (av: typeof AVATARS[0]) => {
    setSelectedAvatar(av.id);
    setSelectedTheme(av.theme);
    setCompanionName(av.name);
    setShowThemePicker(false);
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

  const saveAndGo = () => {
    if (name.trim()) localStorage.setItem("user_name", name.trim());
    localStorage.setItem("companion_name", companionName || "Nova");
    if (journey)    localStorage.setItem("companion_journey", journey);
    if (provider)   localStorage.setItem("companion_provider", provider);
    if (medication) localStorage.setItem("companion_medication", medication);
    if (pronouns)   localStorage.setItem("companion_pronouns", pronouns);
    localStorage.setItem("companion_moods", JSON.stringify(moods));
    if (skipFlag)   localStorage.setItem("firstyear_skip_checkin", "true");
    localStorage.setItem("onboarding_complete", "true");
    router.push("/chat");
  };

  const lbl: React.CSSProperties = {
    display: "block",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "color-mix(in srgb, var(--text) 55%, transparent)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: 6,
  };

  const pill = (active: boolean): React.CSSProperties => ({
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.3)"}`,
    borderRadius: 10,
    padding: "6px 12px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    color: active ? "#8ecfbe" : "var(--text)",
    cursor: "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap" as const,
  });

  const yn = (active: boolean): React.CSSProperties => ({
    flex: 1,
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.3)"}`,
    borderRadius: 8,
    padding: "8px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: active ? "#8ecfbe" : "var(--text)",
    cursor: "pointer",
    textAlign: "center" as const,
    transition: "all 0.15s ease",
  });

  const chip = (active: boolean): React.CSSProperties => ({
    background: active ? "rgba(74,124,111,0.22)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${active ? "rgba(74,124,111,0.65)" : "rgba(255,255,255,0.3)"}`,
    borderRadius: 16,
    padding: "6px 10px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    color: active ? "#8ecfbe" : "var(--text)",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    transition: "all 0.15s ease",
  });

  return (
    <>
      <style>{`
        @media (max-width: 479px) {
          .checkin-card {
            width: 100% !important;
            border-radius: 0 !important;
            padding: 20px 16px !important;
            overflow-y: auto !important;
          }
        }
        @media (max-width: 767px) {
          .checkin-bottom-row { padding-bottom: 80px !important; }
        }
      `}</style>

      {/* Page wrapper */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
        background: "var(--bg, #1A2E1E)",
        color: "var(--text)",
        overflow: "hidden",
        padding: "24px 0",
      }}>

        {/* Modal overlay */}
        {modal && (
          <div className={styles.warmModalOverlay} onClick={() => setModal(null)}>
            <div className={styles.warmModal} onClick={e => e.stopPropagation()}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: "var(--text)", marginBottom: 14 }}>
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

        {/* Card */}
        <div
          className="checkin-card"
          style={{
            width: "90%",
            maxWidth: 760,
            minHeight: "calc(100vh - 48px)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: 18,
            padding: "24px 24px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 12,
            boxSizing: "border-box",
            overflowY: "auto",
          }}
        >

          {/* Title */}
          <div>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: "var(--text)", margin: "0 0 3px" }}>
              {t.title}
            </h2>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "var(--subtext)", margin: 0, lineHeight: 1.4 }}>
              {t.sub}
            </p>
          </div>

          {/* ── Avatar picker ── */}
          <div>
            <label style={lbl}>CHOOSE YOUR COMPANION</label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))",
              gap: 10,
            }}>
              {AVATARS.map(av => (
                <button
                  key={av.id}
                  onClick={() => handleAvatarSelect(av)}
                  style={{
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <div style={{
                    width: 56, height: 56,
                    borderRadius: "50%",
                    border: selectedAvatar === av.id
                      ? "2.5px solid #22C55E"
                      : "2px solid rgba(255,255,255,0.15)",
                    boxShadow: selectedAvatar === av.id
                      ? "0 0 0 3px rgba(34,197,94,0.25)"
                      : "none",
                    overflow: "hidden",
                    transition: "all 0.15s",
                    flexShrink: 0,
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/avatars/${av.id}.png`}
                      alt={av.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <span style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 11,
                    color: selectedAvatar === av.id ? "#22C55E" : "var(--subtext)",
                    fontWeight: selectedAvatar === av.id ? 600 : 400,
                  }}>
                    {av.name}
                  </span>
                </button>
              ))}

              {/* My photo option */}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <div style={{
                  width: 56, height: 56,
                  borderRadius: "50%",
                  border: selectedAvatar === "custom"
                    ? "2.5px solid #22C55E"
                    : "2px dashed rgba(255,255,255,0.3)",
                  boxShadow: selectedAvatar === "custom"
                    ? "0 0 0 3px rgba(34,197,94,0.25)"
                    : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  transition: "all 0.15s",
                  background: "rgba(255,255,255,0.04)",
                  flexShrink: 0,
                }}>
                  {customAvatarSrc && selectedAvatar === "custom" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={customAvatarSrc} alt="My photo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Camera size={20} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                  )}
                </div>
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: selectedAvatar === "custom" ? "#22C55E" : "var(--subtext)",
                  fontWeight: selectedAvatar === "custom" ? 600 : 400,
                }}>
                  My photo
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleCustomPhoto}
              />
            </div>

            {/* Theme dot picker — only shown for custom photo */}
            {showThemePicker && (
              <div style={{ marginTop: 12 }}>
                <span style={{ ...lbl, marginBottom: 8 }}>PICK YOUR THEME</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {THEME_DOTS.map(td => (
                    <button
                      key={td.theme}
                      onClick={() => handleThemeSelect(td.theme)}
                      title={td.theme.replace(/-/g, " ")}
                      style={{
                        width: 24, height: 24,
                        borderRadius: "50%",
                        background: td.color,
                        border: selectedTheme === td.theme
                          ? "2.5px solid #fff"
                          : "2px solid transparent",
                        boxShadow: selectedTheme === td.theme
                          ? "0 0 0 2px rgba(255,255,255,0.4)"
                          : "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "all 0.15s",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label style={lbl}>{t.name_label}</label>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder={t.name_ph}
              style={{
                width: "100%",
                boxSizing: "border-box",
                height: 36,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                padding: "0 12px",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                color: "var(--text)",
                outline: "none",
              }}
            />
          </div>

          {/* Journey */}
          <div>
            <label style={lbl}>{t.journey_label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {t.journey_opts.map(opt => (
                <button key={opt} style={pill(journey === opt)} onClick={() => setJourney(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Provider */}
          <div>
            <label style={lbl}>{t.provider_label}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {t.yesno.slice(0, 2).map(opt => (
                <button key={opt} style={yn(provider === opt)} onClick={() => handleProviderSelect(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Medication */}
          <div>
            <label style={lbl}>{t.meds_label}</label>
            <div style={{ display: "flex", gap: 8 }}>
              {t.yesno.slice(0, 2).map(opt => (
                <button key={opt} style={yn(medication === opt)} onClick={() => handleMedSelect(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Pronouns */}
          <div>
            <label style={lbl}>{t.pronouns_label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {t.pronouns_opts.map(opt => (
                <button key={opt} style={pill(pronouns === opt)} onClick={() => setPronouns(pronouns === opt ? "" : opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div>
            <label style={lbl}>{t.mood_label}</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {t.mood_opts.map(opt => (
                <button key={opt} style={chip(moods.includes(opt))} onClick={() => toggleMood(opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="checkin-bottom-row" style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
              <input
                type="checkbox" checked={skipFlag} onChange={e => setSkipFlag(e.target.checked)}
                style={{ accentColor: "#c4956a", width: 13, height: 13, cursor: "pointer" }}
              />
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text)" }}>
                {t.skip_label}
              </span>
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={() => router.push("/chat")}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  padding: "7px 14px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 12,
                  color: "var(--text)",
                  cursor: "pointer",
                }}
              >
                {t.skip_btn}
              </button>
              <button
                onClick={saveAndGo}
                style={{
                  background: "linear-gradient(135deg, #c4956a 0%, #a87a52 100%)",
                  border: "none",
                  borderRadius: 8,
                  padding: "7px 14px",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#fff",
                  cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(196,149,106,0.3)",
                }}
              >
                {t.start_btn} →
              </button>
            </div>
          </div>

        </div>
      </div>

      <CrisisButton />
    </>
  );
}
