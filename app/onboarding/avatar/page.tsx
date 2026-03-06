"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import {
  AVATAR_CATEGORIES,
  daysSince,
  type CompanionId,
  type FycProfile,
  type OnboardingContext,
} from "../data";
import styles from "../styles/Onboarding.module.css";
import CrisisButton from "../../components/CrisisButton";
import { getStrings, readLang } from "../../i18n";

// ── Companion name rows (exactly 2 rows) ────────────────────────────────────
const NAME_ROWS = [
  ["Quinn", "Ember", "Sage", "River", "Lux"],
  ["Alma",  "Sky",   "Iris", "Nova",  "✏️ My own"],
];

// ── Per-name companion avatar icon sets ─────────────────────────────────────
type AvaItem = { emoji: string; name: string };
const NAME_AVATARS: Record<string, AvaItem[]> = {
  Quinn: [
    { emoji: "🌿", name: "Leaf" }, { emoji: "🌸", name: "Blossom" }, { emoji: "🍃", name: "Fern" },
    { emoji: "🌺", name: "Hibiscus" }, { emoji: "🌻", name: "Sunflower" }, { emoji: "🌾", name: "Wheat" },
  ],
  Ember: [
    { emoji: "🔥", name: "Ember" }, { emoji: "⭐", name: "Star" }, { emoji: "🌅", name: "Sunrise" },
    { emoji: "🕯️", name: "Candle" }, { emoji: "🌙", name: "Crescent" }, { emoji: "✨", name: "Spark" },
  ],
  Sage: [
    { emoji: "🌱", name: "Sprout" }, { emoji: "🍀", name: "Clover" }, { emoji: "🌿", name: "Herb" },
    { emoji: "🪨", name: "Stone" }, { emoji: "🌲", name: "Tree" }, { emoji: "🍂", name: "Autumn" },
  ],
  River: [
    { emoji: "🌊", name: "Wave" }, { emoji: "💧", name: "Drop" }, { emoji: "🐚", name: "Shell" },
    { emoji: "🪸", name: "Coral" }, { emoji: "🐬", name: "Dolphin" }, { emoji: "🌀", name: "Spiral" },
  ],
  Lux: [
    { emoji: "🌈", name: "Rainbow" }, { emoji: "💫", name: "Dizzy" }, { emoji: "🌟", name: "Star" },
    { emoji: "🔮", name: "Orb" }, { emoji: "🪐", name: "Planet" }, { emoji: "☁️", name: "Cloud" },
  ],
  Alma: [
    { emoji: "🦋", name: "Butterfly" }, { emoji: "🌷", name: "Tulip" }, { emoji: "🕊️", name: "Dove" },
    { emoji: "🌸", name: "Cherry" }, { emoji: "🫧", name: "Bubble" }, { emoji: "🪷", name: "Lotus" },
  ],
  Sky: [
    { emoji: "☁️", name: "Cloud" }, { emoji: "🌤️", name: "Sunny" }, { emoji: "🌬️", name: "Wind" },
    { emoji: "🦅", name: "Eagle" }, { emoji: "🌙", name: "Moon" }, { emoji: "⚡", name: "Lightning" },
  ],
  Iris: [
    { emoji: "🌈", name: "Rainbow" }, { emoji: "🎨", name: "Palette" }, { emoji: "🦚", name: "Peacock" },
    { emoji: "🌺", name: "Iris" }, { emoji: "🦜", name: "Parrot" }, { emoji: "🫐", name: "Berry" },
  ],
  Nova: [
    { emoji: "💥", name: "Nova" }, { emoji: "🌌", name: "Galaxy" }, { emoji: "⭐", name: "Star" },
    { emoji: "🪐", name: "Saturn" }, { emoji: "☄️", name: "Comet" }, { emoji: "🌙", name: "Moon" },
  ],
};
const DEFAULT_AVATARS: AvaItem[] = NAME_AVATARS["Nova"];

function dotState(i: number, screen = 4) {
  return i < screen ? "done" : i === screen ? "active" : "pending";
}

const SCREEN: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  display: "flex", flexDirection: "column", overflow: "hidden",
};
const SCROLL: React.CSSProperties = {
  flex: 1, overflowY: "auto", overscrollBehavior: "none",
  WebkitOverflowScrolling: "touch" as any,
  padding: "20px 16px 16px",
  display: "flex", flexDirection: "column", alignItems: "center",
};
const CONTENT: React.CSSProperties = {
  width: "100%", maxWidth: 480, position: "relative", zIndex: 1,
};

export default function AvatarPage() {
  const router = useRouter();
  const [t, setT] = useState(() => getStrings("en-US"));

  const [avatarCat, setAvatarCat] = useState("animals");
  const [userAvatarSel, setUserAvatarSel] = useState<{ catId: string; idx: number } | null>(null);
  const [companionName, setCompanionName] = useState("Nova");
  const [isCustomName, setIsCustomName] = useState(false);
  const [customName, setCustomName] = useState("");
  const [companionAvaIdx, setCompanionAvaIdx] = useState(0);

  useEffect(() => { setT(getStrings(readLang())); }, []);

  const currentCat = AVATAR_CATEGORIES.find((c) => c.id === avatarCat)!;
  const userAvatar = userAvatarSel
    ? AVATAR_CATEGORIES.find((c) => c.id === userAvatarSel.catId)?.avatars[userAvatarSel.idx]
    : null;

  const compAvatars = isCustomName ? DEFAULT_AVATARS : (NAME_AVATARS[companionName] ?? DEFAULT_AVATARS);
  const compAvatar = compAvatars[companionAvaIdx] ?? compAvatars[0];

  const selectName = (n: string) => {
    if (n === "✏️ My own") {
      setIsCustomName(true);
      setCompanionAvaIdx(0);
    } else {
      setIsCustomName(false);
      setCompanionName(n);
      setCompanionAvaIdx(0);
    }
  };

  const handleFinish = () => {
    if (!userAvatar) return;

    const finalName = isCustomName ? (customName.trim() || "Nova") : companionName;

    const profile: FycProfile = {
      companion: {
        name: finalName,
        id: "neutral" as CompanionId,
        pronouns: "they/them",
        avatar: { emoji: compAvatar.emoji, name: compAvatar.name },
      },
      userAvatar: { emoji: userAvatar.emoji, name: userAvatar.name, desc: userAvatar.desc },
    };
    localStorage.setItem("fyc_profile", JSON.stringify(profile));

    const name         = localStorage.getItem("companion_userName") || null;
    const pronoun      = localStorage.getItem("companion_pronouns") || null;
    const diagnosisDate = localStorage.getItem("companion_diagnosisDate") || null;
    const timeline     = localStorage.getItem("companion_timeline") || null;
    const onMedication = localStorage.getItem("companion_onMeds") || null;
    const hasProvider  = localStorage.getItem("companion_hasProvider") || null;
    const needsProviderHelp = localStorage.getItem("companion_needsProvider") === "true";
    const wantsMedsIntro    = localStorage.getItem("companion_wantsMedsIntro") === "true";
    const emotionalIntensity = Number(localStorage.getItem("companion_intensity") ?? 5);
    const emotions     = JSON.parse(localStorage.getItem("companion_emotions") || "[]") as string[];
    const note         = localStorage.getItem("companion_note") || null;
    const days         = diagnosisDate ? daysSince(diagnosisDate) : null;

    const ctx: OnboardingContext = {
      name, pronoun, diagnosisDate,
      daysSinceDiagnosis: days,
      diagnosisRange: timeline,
      onMedication, hasProvider, needsProviderHelp, wantsMedsIntro,
      emotionalIntensity, emotions, note,
      userAvatar: { emoji: userAvatar.emoji, name: userAvatar.name, desc: userAvatar.desc },
      companion: profile.companion,
    };
    localStorage.setItem("companion_context", JSON.stringify(ctx));
    router.push("/onboarding/theme");
  };

  return (
    <div className={styles.fycRoot} style={SCREEN}>
      <div className={`${styles.bgOrb} ${styles.bgOrb1}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb2}`} />
      <div className={`${styles.bgOrb} ${styles.bgOrb3}`} />

      <div style={SCROLL}>
        <div style={CONTENT}>
          <div className={styles.stepDots}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={clsx(styles.dot, styles[dotState(i)])} />
            ))}
          </div>
          <p className={styles.eyebrow}>{t.avatar_step}</p>
          <h1>{t.avatar_title}</h1>
          <p style={{ fontSize: 13, color: "rgba(245,237,224,.45)", marginBottom: 14 }}>{t.avatar_sub}</p>

          <div className={styles.previewRow}>
            <div className={clsx(styles.previewAva, userAvatar && styles.chosen)}>
              {userAvatar ? userAvatar.emoji : "?"}
            </div>
            <div style={{ flex: 1 }}>
              {userAvatar ? (
                <>
                  <div style={{ fontSize: 15, fontWeight: 500, color: "#f5ede0", marginBottom: 2 }}>{userAvatar.name}</div>
                  <div style={{ fontSize: 12, color: "rgba(245,237,224,.35)" }}>{userAvatar.desc}</div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: "rgba(245,237,224,.35)" }}>{t.avatar_preview_hint}</div>
              )}
            </div>
          </div>

          <div className={styles.catTabs}>
            {AVATAR_CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={clsx(styles.catTab, avatarCat === c.id && styles.act)}
                onClick={() => setAvatarCat(c.id)}
              >
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>

          <div className={styles.avaGrid}>
            {currentCat.avatars.map((a, i) => (
              <div
                key={`${avatarCat}-${i}`}
                className={clsx(
                  styles.avaTile,
                  userAvatarSel?.catId === avatarCat && userAvatarSel?.idx === i && styles.selected
                )}
                style={{ animationDelay: `${i * 0.025}s` }}
                onClick={() => setUserAvatarSel({ catId: avatarCat, idx: i })}
              >
                <div className={styles.avaChk}>✓</div>
                <div className={styles.avaEmoji}>{a.emoji}</div>
                <div className={styles.avaLbl}>{a.name}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(245,237,224,.28)", marginBottom: 8 }}>
            {t.avatar_companion_lbl}
          </p>

          <div className={styles.companionCard}>
            <div className={styles.companionAva}>{compAvatar.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#8ecfbe", marginBottom: 2 }}>
                {isCustomName ? (customName.trim() || "…") : companionName} · {compAvatar.name}
              </div>
              <div style={{ fontSize: 12, color: "rgba(245,237,224,.35)" }}>{t.avatar_your_companion}</div>
            </div>
          </div>

          {NAME_ROWS.map((row, ri) => (
            <div key={ri} className={styles.namePills} style={{ marginBottom: ri === 0 ? 4 : 8 }}>
              {row.map((n) => {
                const isMyOwn = n === "✏️ My own";
                const isActive = isMyOwn ? isCustomName : (!isCustomName && companionName === n);
                return (
                  <button
                    key={n}
                    className={clsx(styles.namePill, isActive && styles.act)}
                    onClick={() => selectName(n)}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          ))}

          {isCustomName && (
            <input
              className={styles.textInput}
              style={{ marginBottom: 12, marginTop: 6 }}
              placeholder="Type a name…"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
              maxLength={30}
              autoFocus
            />
          )}

          <div className={styles.compAvaRow}>
            {compAvatars.map((a, i) => (
              <div
                key={`${isCustomName ? "custom" : companionName}-${i}`}
                className={clsx(styles.compAvaTile, companionAvaIdx === i && styles.act)}
                onClick={() => setCompanionAvaIdx(i)}
              >
                <span style={{ fontSize: 20 }}>{a.emoji}</span>
                <span style={{ fontSize: 9, color: companionAvaIdx === i ? "rgba(245,237,224,.55)" : "rgba(245,237,224,.25)" }}>
                  {a.name}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.btnRow}>
            <button className={styles.btnBack} onClick={() => router.back()}>{t.back}</button>
            <button className={styles.btnNext} disabled={!userAvatar} onClick={handleFinish}>
              {userAvatar ? t.avatar_start(userAvatar.name) : t.avatar_choose}
            </button>
          </div>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
