"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import {
  COMPANION_IDENTITIES,
  AVATAR_CATEGORIES,
  daysSince,
  type CompanionId,
  type FycProfile,
  type OnboardingContext,
} from "../data";
import styles from "../styles/Onboarding.module.css";

const ALL_NAMES = Array.from(
  new Set(COMPANION_IDENTITIES.flatMap((c) => c.names))
) as string[];

const ALL_COMP_AVATARS = COMPANION_IDENTITIES.flatMap((c) => [...c.avatars]).filter(
  (a, i, arr) => arr.findIndex((x) => x.name === a.name) === i
);

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

  const [avatarCat, setAvatarCat] = useState("animals");
  const [userAvatarSel, setUserAvatarSel] = useState<{ catId: string; idx: number } | null>(null);
  const [companionName, setCompanionName] = useState("Nova");
  const [companionAvaIdx, setCompanionAvaIdx] = useState(0);
  const [isCustomName, setIsCustomName] = useState(false);
  const [customName, setCustomName] = useState("");

  const compAvatar = ALL_COMP_AVATARS[companionAvaIdx] ?? ALL_COMP_AVATARS[0];
  const currentCat = AVATAR_CATEGORIES.find((c) => c.id === avatarCat)!;
  const userAvatar = userAvatarSel
    ? AVATAR_CATEGORIES.find((c) => c.id === userAvatarSel.catId)?.avatars[userAvatarSel.idx]
    : null;

  const handleFinish = () => {
    if (!userAvatar) return;

    const finalName = isCustomName ? (customName.trim() || companionName) : companionName;

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
          <p className={styles.eyebrow}>Step 4 of 5</p>
          <h1>Choose your picture</h1>
          <p style={{ fontSize: 13, color: "rgba(245,237,224,.45)", marginBottom: 14 }}>
            No names, no photos — just a small piece of you in every conversation.
          </p>

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
                <div style={{ fontSize: 12, color: "rgba(245,237,224,.35)" }}>Pick one below to see your preview</div>
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
            Your companion
          </p>

          <div className={styles.companionCard}>
            <div className={styles.companionAva}>{compAvatar.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#8ecfbe", marginBottom: 2 }}>
                {isCustomName ? (customName.trim() || "…") : companionName} · {compAvatar.name}
              </div>
              <div style={{ fontSize: 12, color: "rgba(245,237,224,.35)" }}>Your companion</div>
            </div>
          </div>

          <div className={styles.namePills}>
            {ALL_NAMES.map((n) => (
              <button
                key={n}
                className={clsx(styles.namePill, !isCustomName && companionName === n && styles.act)}
                onClick={() => { setIsCustomName(false); setCompanionName(n); }}
              >
                {n}
              </button>
            ))}
            <button
              className={clsx(styles.namePill, isCustomName && styles.act)}
              onClick={() => { setIsCustomName(true); setCompanionName(""); }}
            >
              ✏️ My own
            </button>
          </div>

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
            {ALL_COMP_AVATARS.map((a, i) => (
              <div
                key={a.name}
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
            <button className={styles.btnBack} onClick={() => router.back()}>Back</button>
            <button className={styles.btnNext} disabled={!userAvatar} onClick={handleFinish}>
              {userAvatar ? `Start chat as ${userAvatar.name}` : "Choose an avatar to continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
