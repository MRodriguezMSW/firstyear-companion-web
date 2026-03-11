"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { LANGUAGE_OPTIONS, getStrings, readLang } from "../i18n";

// ── Themes ────────────────────────────────────────────────────────────────────
const THEMES = [
  { id: "calm-sea",       name: "Calm Sea",       swatch: "#88BDF2" },
  { id: "quiet-grove",    name: "Quiet Grove",    swatch: "#BAC095" },
  { id: "lavender-night", name: "Lavender Night", swatch: "#8686AC" },
  { id: "sage-stone",     name: "Sage & Stone",   swatch: "#B2AC88" },
  { id: "warm-clay",      name: "Warm Clay",      swatch: "#BF7587" },
  { id: "deep-teal",      name: "Deep Teal",      swatch: "#4F7C82" },
  { id: "painted-iris",   name: "Painted Iris",   swatch: "#B298E7" },
  { id: "desert-bloom",   name: "Desert Bloom",   swatch: "#9988A1" },
  { id: "meadow-mist",    name: "Meadow Mist",    swatch: "#68BA7F" },
];

// ── Constants (English keys — stored in profile for AI context) ────────────────
const PRONOUN_KEYS = ["She/Her", "He/Him", "They/Them", "Ze/Zir", "Prefer not to say", "Other"];
const AGE_RANGE_KEYS = ["Under 18", "18–24", "25–34", "35–44", "45–54", "55+", "Prefer not to say"];
const MOOD_KEYS = ["Struggling", "Anxious", "Numb", "Okay", "Good", "Strong"];
const MOOD_EMOJIS = ["😔", "😟", "😐", "🙂", "😊", "💪"];
const TOPIC_KEYS = [
  "Coping with diagnosis",
  "Understanding medication",
  "Relationships and disclosure",
  "Dealing with anxiety",
  "Finding a provider",
  "Understanding lab results",
  "Emotional support",
];
const COUNTRIES = [
  "Argentina", "Australia", "Belgium", "Botswana", "Brazil", "Cameroon",
  "Canada", "Chile", "China", "Colombia", "Cuba", "Denmark", "Dominican Republic",
  "Ecuador", "El Salvador", "Ethiopia", "Finland", "France", "Germany", "Ghana",
  "Guatemala", "Haiti", "Honduras", "India", "Indonesia", "Ireland", "Italy",
  "Jamaica", "Japan", "Kenya", "Mexico", "Mozambique", "Netherlands", "New Zealand",
  "Nigeria", "Norway", "Panama", "Peru", "Philippines", "Portugal", "Puerto Rico",
  "Russia", "South Africa", "Spain", "Sweden", "Switzerland", "Tanzania",
  "Thailand", "Trinidad and Tobago", "Uganda", "Ukraine", "United Kingdom",
  "United States", "Venezuela", "Vietnam", "Zambia", "Zimbabwe",
  "Other / Prefer not to say",
];

export const PROFILE_KEY = "fyc_user_profile";
export const JOURNAL_KEY = "fyc_journal";

export interface UserProfile {
  preferredName: string;
  pronouns: string;
  pronounsOther: string;
  ageRange: string;
  country: string;
  language: string;
  mood: string;
  moodEmoji: string;
  dailyCheckIns: boolean;
  topics: string[];
  lastMoodDate: string;
}

interface JournalEntry {
  id: string;
  timestamp: string;
  content: string;
}

const DEFAULT_PROFILE: UserProfile = {
  preferredName: "",
  pronouns: "",
  pronounsOther: "",
  ageRange: "",
  country: "",
  language: "",
  mood: "",
  moodEmoji: "",
  dailyCheckIns: false,
  topics: [],
  lastMoodDate: "",
};

// ── Styles ────────────────────────────────────────────────────────────────────

const S = {
  root: {
    position: "fixed" as const,
    inset: 0,
    overflowY: "auto" as const,
    overflowX: "hidden" as const,
    background: "var(--bg, #1A2E1E)",
    WebkitOverflowScrolling: "touch" as const,
  },
  header: {
    position: "sticky" as const,
    top: 0,
    zIndex: 20,
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "0 16px",
    height: 56,
    background: "color-mix(in srgb, var(--bg) 92%, transparent)",
    borderBottom: "1px solid color-mix(in srgb, var(--text) 8%, transparent)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    fontSize: 22,
    cursor: "pointer",
    color: "var(--text)",
    opacity: 0.65,
    padding: "4px 8px",
    flexShrink: 0,
  },
  headerTitle: {
    flex: 1,
    fontFamily: "'Lora', serif",
    fontSize: 17,
    fontWeight: 500,
    color: "var(--text)",
  },
  body: {
    maxWidth: 520,
    margin: "0 auto",
    padding: "0 16px 80px",
  },
  tabRow: {
    display: "flex",
    gap: 8,
    padding: "16px 0 4px",
    borderBottom: "1px solid color-mix(in srgb, var(--text) 8%, transparent)",
    marginBottom: 20,
  },
  tab: (active: boolean): React.CSSProperties => ({
    flex: 1,
    background: active ? "color-mix(in srgb, var(--accent) 15%, transparent)" : "transparent",
    border: active
      ? "1px solid color-mix(in srgb, var(--accent) 40%, transparent)"
      : "1px solid color-mix(in srgb, var(--text) 10%, transparent)",
    borderRadius: 10,
    padding: "9px 12px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: active ? "var(--accent)" : "color-mix(in srgb, var(--text) 50%, transparent)",
    cursor: "pointer",
    transition: "all 0.18s ease",
  }),
  section: {
    marginBottom: 24,
  },
  label: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    color: "color-mix(in srgb, var(--text) 45%, transparent)",
    marginBottom: 10,
  },
  textInput: {
    width: "100%",
    background: "color-mix(in srgb, var(--text) 5%, transparent)",
    border: "1px solid color-mix(in srgb, var(--text) 10%, transparent)",
    borderRadius: 12,
    padding: "14px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 15,
    color: "var(--text)",
    outline: "none",
    boxSizing: "border-box" as const,
  },
  pillRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
  },
  pill: (active: boolean): React.CSSProperties => ({
    background: active
      ? "color-mix(in srgb, var(--accent) 18%, transparent)"
      : "color-mix(in srgb, var(--text) 5%, transparent)",
    border: active
      ? "1px solid color-mix(in srgb, var(--accent) 50%, transparent)"
      : "1px solid color-mix(in srgb, var(--text) 10%, transparent)",
    borderRadius: 20,
    padding: "8px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: active ? "var(--accent)" : "color-mix(in srgb, var(--text) 65%, transparent)",
    cursor: "pointer",
    transition: "all 0.15s ease",
  }),
  moodGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 8,
  },
  moodBtn: (active: boolean): React.CSSProperties => ({
    background: active
      ? "color-mix(in srgb, var(--accent) 15%, transparent)"
      : "color-mix(in srgb, var(--text) 5%, transparent)",
    border: active
      ? "1px solid color-mix(in srgb, var(--accent) 45%, transparent)"
      : "1px solid color-mix(in srgb, var(--text) 10%, transparent)",
    borderRadius: 12,
    padding: "12px 8px",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: 6,
    cursor: "pointer",
    transition: "all 0.15s ease",
    fontFamily: "'DM Sans', sans-serif",
  }),
  moodEmoji: {
    fontSize: 22,
    lineHeight: 1,
  },
  moodLabel: (active: boolean): React.CSSProperties => ({
    fontSize: 11,
    fontWeight: 500,
    color: active ? "var(--accent)" : "color-mix(in srgb, var(--text) 55%, transparent)",
  }),
  select: {
    width: "100%",
    background: "color-mix(in srgb, var(--text) 5%, transparent)",
    border: "1px solid color-mix(in srgb, var(--text) 10%, transparent)",
    borderRadius: 12,
    padding: "14px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "var(--text)",
    outline: "none",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
    backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='rgba(200,200,200,0.4)' d='M4 6l4 4 4-4'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat" as const,
    backgroundPosition: "right 12px center" as const,
    backgroundSize: "14px" as const,
    paddingRight: 36,
    cursor: "pointer",
    boxSizing: "border-box" as const,
    colorScheme: "dark" as const,
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "color-mix(in srgb, var(--text) 4%, transparent)",
    border: "1px solid color-mix(in srgb, var(--text) 8%, transparent)",
    borderRadius: 12,
    padding: "14px 16px",
  },
  toggleLabel: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "color-mix(in srgb, var(--text) 75%, transparent)",
    lineHeight: 1.4,
  },
  toggleBtn: (active: boolean): React.CSSProperties => ({
    width: 48,
    height: 26,
    borderRadius: 13,
    background: active ? "var(--accent)" : "color-mix(in srgb, var(--text) 15%, transparent)",
    border: "none",
    cursor: "pointer",
    position: "relative" as const,
    transition: "background 0.2s",
    flexShrink: 0,
  }),
  toggleDot: (active: boolean): React.CSSProperties => ({
    position: "absolute" as const,
    top: 3,
    left: active ? 25 : 3,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#fff",
    transition: "left 0.2s",
    boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
  }),
  saveBtn: {
    width: "100%",
    background: "linear-gradient(135deg, var(--accent) 0%, color-mix(in srgb, var(--accent) 75%, #000) 100%)",
    border: "none",
    borderRadius: 14,
    padding: "16px 24px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 16,
    fontWeight: 500,
    color: "#fff",
    cursor: "pointer",
    marginBottom: 12,
    transition: "opacity 0.2s",
  },
  privacyNote: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    color: "color-mix(in srgb, var(--text) 30%, transparent)",
    textAlign: "center" as const,
    lineHeight: 1.6,
    marginBottom: 32,
  },
  savedToast: {
    background: "color-mix(in srgb, var(--accent) 15%, transparent)",
    border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
    borderRadius: 10,
    padding: "10px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "var(--accent)",
    textAlign: "center" as const,
    marginBottom: 16,
    animation: "fadeIn 0.3s ease",
  },
  // Journal
  journalNote: {
    background: "color-mix(in srgb, var(--text) 4%, transparent)",
    border: "1px solid color-mix(in srgb, var(--text) 8%, transparent)",
    borderRadius: 12,
    padding: "12px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12,
    color: "color-mix(in srgb, var(--text) 45%, transparent)",
    lineHeight: 1.6,
    marginBottom: 20,
  },
  journalTextarea: {
    width: "100%",
    background: "color-mix(in srgb, var(--text) 5%, transparent)",
    border: "1px solid color-mix(in srgb, var(--text) 10%, transparent)",
    borderRadius: 14,
    padding: "14px 16px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "var(--text)",
    outline: "none",
    resize: "vertical" as const,
    minHeight: 120,
    boxSizing: "border-box" as const,
    lineHeight: 1.65,
    marginBottom: 10,
    display: "block",
  },
  saveEntryBtn: {
    background: "color-mix(in srgb, var(--accent) 15%, transparent)",
    border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
    borderRadius: 10,
    padding: "10px 20px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    fontWeight: 500,
    color: "var(--accent)",
    cursor: "pointer",
    marginBottom: 28,
    transition: "opacity 0.15s",
  },
  entryList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
  },
  entryCard: (expanded: boolean): React.CSSProperties => ({
    background: "color-mix(in srgb, var(--text) 4%, transparent)",
    border: "1px solid color-mix(in srgb, var(--text) 9%, transparent)",
    borderRadius: 14,
    overflow: "hidden",
    cursor: "pointer",
    transition: "border-color 0.15s",
  }),
  entryHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    gap: 10,
  },
  entryMeta: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    color: "color-mix(in srgb, var(--text) 38%, transparent)",
    marginBottom: 3,
  },
  entryPreview: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 13,
    color: "color-mix(in srgb, var(--text) 65%, transparent)",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    maxWidth: 260,
  },
  entryDeleteBtn: {
    background: "transparent",
    border: "1px solid color-mix(in srgb, var(--text) 12%, transparent)",
    borderRadius: 8,
    padding: "5px 10px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11,
    color: "color-mix(in srgb, var(--text) 35%, transparent)",
    cursor: "pointer",
    flexShrink: 0,
    transition: "all 0.15s",
  },
  entryBody: {
    padding: "0 16px 14px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14,
    color: "color-mix(in srgb, var(--text) 72%, transparent)",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap" as const,
    borderTop: "1px solid color-mix(in srgb, var(--text) 7%, transparent)",
    paddingTop: 12,
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatTimestamp(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return { date, time };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "journal">("profile");
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [langCode, setLangCode] = useState("en-US");
  const [activeTheme, setActiveTheme] = useState("calm-sea");
  const t = getStrings(langCode);

  // Apply theme + language from localStorage
  useEffect(() => {
    const theme = localStorage.getItem("companion_theme") || "calm-sea";
    document.documentElement.setAttribute("data-theme", theme);
    setActiveTheme(theme);
    setLangCode(readLang());
  }, []);

  // Load profile + journal from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
        return;
      } catch {}
    }
    // Pre-fill language from companion_language
    const lang = localStorage.getItem("companion_language") || "";
    if (lang) setProfile(p => ({ ...p, language: lang }));
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(JOURNAL_KEY);
    if (raw) {
      try { setEntries(JSON.parse(raw)); } catch {}
    }
  }, []);

  const saveProfile = () => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const setField = <K extends keyof UserProfile>(key: K, val: UserProfile[K]) => {
    setProfile(p => ({ ...p, [key]: val }));
  };

  const toggleTopic = (topic: string) => {
    setProfile(p => ({
      ...p,
      topics: p.topics.includes(topic)
        ? p.topics.filter(t => t !== topic)
        : [...p.topics, topic],
    }));
  };

  const saveJournalEntry = () => {
    if (!journalText.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      content: journalText.trim(),
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
    setJournalText("");
  };

  const deleteEntry = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = entries.filter(en => en.id !== id);
    setEntries(updated);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
    if (expandedId === id) setExpandedId(null);
  }, [entries, expandedId]);

  return (
    <div style={S.root}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        select option { background: #1A2E1E; color: #E8F5E2; }
        textarea::placeholder { color: color-mix(in srgb, var(--text) 25%, transparent); }
        input::placeholder { color: color-mix(in srgb, var(--text) 25%, transparent); }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <button style={S.backBtn} onClick={() => router.push("/chat")}>←</button>
        <div style={S.headerTitle}>{t.profile_title}</div>
      </div>

      <div style={S.body}>
        {/* Tab switcher */}
        <div style={S.tabRow}>
          <button style={S.tab(tab === "profile")} onClick={() => setTab("profile")}>
            {t.profile_tab}
          </button>
          <button style={S.tab(tab === "journal")} onClick={() => setTab("journal")}>
            {t.journal_tab}
          </button>
        </div>

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <>
            {/* Preferred name */}
            <div style={S.section}>
              <div style={S.label}>{t.profile_name_label} <span style={{ color: "color-mix(in srgb, var(--text) 25%, transparent)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>— {t.optional}</span></div>
              <input
                style={S.textInput}
                type="text"
                placeholder={t.profile_name_ph}
                value={profile.preferredName}
                onChange={e => setField("preferredName", e.target.value)}
                maxLength={40}
              />
            </div>

            {/* Pronouns */}
            <div style={S.section}>
              <div style={S.label}>{t.profile_pronouns_label}</div>
              <div style={S.pillRow}>
                {PRONOUN_KEYS.map((key, i) => (
                  <button key={key} style={S.pill(profile.pronouns === key)} onClick={() => setField("pronouns", key)}>
                    {t.profile_pronouns[i] ?? key}
                  </button>
                ))}
              </div>
              {profile.pronouns === "Other" && (
                <input
                  style={{ ...S.textInput, marginTop: 10 }}
                  type="text"
                  placeholder={t.profile_name_ph}
                  value={profile.pronounsOther}
                  onChange={e => setField("pronounsOther", e.target.value)}
                  maxLength={40}
                />
              )}
            </div>

            {/* Age range */}
            <div style={S.section}>
              <div style={S.label}>{t.profile_age_label}</div>
              <div style={S.pillRow}>
                {AGE_RANGE_KEYS.map((key, i) => (
                  <button key={key} style={S.pill(profile.ageRange === key)} onClick={() => setField("ageRange", key)}>
                    {t.profile_age_ranges[i] ?? key}
                  </button>
                ))}
              </div>
            </div>

            {/* Country */}
            <div style={S.section}>
              <div style={S.label}>{t.profile_country_label}</div>
              <select
                style={S.select}
                value={profile.country}
                onChange={e => setField("country", e.target.value)}
              >
                <option value="">{t.country_ph}</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Language */}
            <div style={S.section}>
              <div style={S.label}>{t.profile_language_label}</div>
              <select
                style={S.select}
                value={profile.language}
                onChange={e => setField("language", e.target.value)}
              >
                <option value="">{t.language_ph}</option>
                {LANGUAGE_OPTIONS.map(l => (
                  <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
                ))}
              </select>
            </div>

            {/* Theme */}
            <div style={S.section}>
              <div style={S.label}>Color Theme</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {THEMES.map(th => (
                  <div key={th.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <button
                      onClick={() => {
                        setActiveTheme(th.id);
                        localStorage.setItem("companion_theme", th.id);
                        document.documentElement.setAttribute("data-theme", th.id);
                      }}
                      style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: th.swatch, border: "none",
                        cursor: "pointer", padding: 0,
                        outline: activeTheme === th.id ? "2px solid #fff" : "2px solid transparent",
                        outlineOffset: 2,
                        transition: "outline 0.15s ease",
                      }}
                    />
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif", fontSize: 9,
                      color: "color-mix(in srgb, var(--text) 50%, transparent)",
                      textAlign: "center", maxWidth: 52, lineHeight: 1.2,
                    }}>
                      {th.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mood */}
            <div style={S.section}>
              <div style={S.label}>{t.profile_mood_label}</div>
              <div style={S.moodGrid}>
                {MOOD_KEYS.map((key, i) => (
                  <button
                    key={key}
                    style={S.moodBtn(profile.mood === key)}
                    onClick={() => {
                      setField("mood", key);
                      setField("moodEmoji", MOOD_EMOJIS[i]);
                      setField("lastMoodDate", new Date().toISOString().slice(0, 10));
                    }}
                  >
                    <span style={S.moodEmoji}>{MOOD_EMOJIS[i]}</span>
                    <span style={S.moodLabel(profile.mood === key)}>{t.profile_moods[i]?.label ?? key}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily check-ins */}
            <div style={S.section}>
              <div style={S.label}>{t.profile_checkin_label}</div>
              <div style={S.toggleRow}>
                <span style={S.toggleLabel}>{t.profile_checkin_toggle}</span>
                <button
                  style={S.toggleBtn(profile.dailyCheckIns)}
                  onClick={() => setField("dailyCheckIns", !profile.dailyCheckIns)}
                  aria-label={profile.dailyCheckIns ? "Disable daily check-ins" : "Enable daily check-ins"}
                >
                  <span style={S.toggleDot(profile.dailyCheckIns)} />
                </button>
              </div>
            </div>

            {/* Topics */}
            <div style={S.section}>
              <div style={S.label}>{t.profile_topics_label}</div>
              <div style={S.pillRow}>
                {TOPIC_KEYS.map((key, i) => (
                  <button key={key} style={S.pill(profile.topics.includes(key))} onClick={() => toggleTopic(key)}>
                    {t.profile_topics[i] ?? key}
                  </button>
                ))}
              </div>
            </div>

            {/* Save */}
            {saved && <div style={S.savedToast}>{t.profile_saved}</div>}
            <button style={S.saveBtn} onClick={saveProfile}>{t.profile_save_btn}</button>
            <p style={S.privacyNote}>{t.profile_privacy_note}</p>
          </>
        )}

        {/* ── JOURNAL TAB ── */}
        {tab === "journal" && (
          <>
            <div style={S.journalNote}>{t.journal_note}</div>

            <textarea
              style={S.journalTextarea}
              placeholder={t.journal_placeholder}
              value={journalText}
              onChange={e => setJournalText(e.target.value)}
              rows={5}
            />
            <button
              style={{ ...S.saveEntryBtn, opacity: journalText.trim() ? 1 : 0.4 }}
              onClick={saveJournalEntry}
              disabled={!journalText.trim()}
            >
              {t.journal_save_btn}
            </button>

            {entries.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "color-mix(in srgb, var(--text) 30%, transparent)" }}>
                {t.journal_empty}
              </div>
            ) : (
              <div style={S.entryList}>
                {entries.map(entry => {
                  const { date, time } = formatTimestamp(entry.timestamp);
                  const isExpanded = expandedId === entry.id;
                  const firstLine = entry.content.split("\n")[0].slice(0, 80);
                  return (
                    <div
                      key={entry.id}
                      style={S.entryCard(isExpanded)}
                      onClick={() => setExpandedId(isExpanded ? null : entry.id)}
                    >
                      <div style={S.entryHeader}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={S.entryMeta}>{date} · {time}</div>
                          {!isExpanded && (
                            <div style={S.entryPreview}>{firstLine}{entry.content.length > 80 ? "…" : ""}</div>
                          )}
                        </div>
                        <button
                          style={S.entryDeleteBtn}
                          onClick={(e) => deleteEntry(entry.id, e)}
                        >
                          {t.journal_delete_btn}
                        </button>
                      </div>
                      {isExpanded && (
                        <div style={S.entryBody}>{entry.content}</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
