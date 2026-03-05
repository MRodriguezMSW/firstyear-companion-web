"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./styles/Chat.module.css";

const FALLBACK_NAMES = ["Nova", "Sage", "River", "Luna"];

const DECISION_CHIPS = new Set([
  "Yes, let's try",
  "No thanks",
  "Not now",
  "Yes, let's continue",
  "Not yet",
]);

function chipsToMessage(chips: string[]): string {
  if (chips.length === 1) return chips[0];
  const feelParts = chips
    .filter((c) => c.toLowerCase().startsWith("i feel "))
    .map((c) => c.slice("I feel ".length));
  const others = chips.filter((c) => !c.toLowerCase().startsWith("i feel "));
  const parts: string[] = [];
  if (feelParts.length > 0) {
    parts.push(
      "I feel " +
        (feelParts.length === 1
          ? feelParts[0]
          : feelParts.length === 2
          ? `${feelParts[0]} and ${feelParts[1]}`
          : `${feelParts.slice(0, -1).join(", ")}, and ${feelParts[feelParts.length - 1]}`)
    );
  }
  parts.push(...others);
  return parts.join(". ");
}

type Message = { role: "assistant" | "user"; content: string };

export default function ChatPage() {
  // Chat history
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi. I'm here with you. You can take your time. What feels most important right now?",
    },
  ]);

  // Composer + chips
  const [input, setInput] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [chips, setChips] = useState<string[]>([
    "I feel scared",
    "I feel overwhelmed",
    "I feel numb",
    "I'm not sure what to say",
  ]);

  const [sending, setSending] = useState(false);

  const [state, setState] = useState({
    mode: "companion" as "companion" | "guide",
    topic: "start",
    stage: "start:v1",
  });

  const [companionName, setCompanionName] = useState(
    () => FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)]
  );
  const [companionEmoji, setCompanionEmoji] = useState("🌱");
  const [userEmoji, setUserEmoji] = useState("");
  const [userName, setUserName] = useState<string>("");

  const [progressKey, setProgressKey] = useState(0);
  const [showProgress, setShowProgress] = useState(false);

  const inputRef = useRef("");
  const selectedChipsRef = useRef<string[]>([]);
  const autoSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending, chips]);

  const [onboardingContext, setOnboardingContext] = useState<string>("");

  useEffect(() => {
    const raw = localStorage.getItem("companion_context");
    if (raw) {
      try {
        const ctx = JSON.parse(raw);
        if (ctx.companion?.name) setCompanionName(ctx.companion.name);
        if (ctx.companion?.avatar?.emoji) setCompanionEmoji(ctx.companion.avatar.emoji);
        if (ctx.userAvatar?.emoji) setUserEmoji(ctx.userAvatar.emoji);
        if (ctx.name) setUserName(ctx.name);

        const parts: string[] = [];
        if (ctx.name)               parts.push(`User's name: ${ctx.name}`);
        if (ctx.pronoun)            parts.push(`User's pronouns: ${ctx.pronoun}`);
        if (ctx.diagnosisDate)      parts.push(`Diagnosis date: ${ctx.diagnosisDate}`);
        if (ctx.daysSinceDiagnosis !== null && ctx.daysSinceDiagnosis !== undefined)
                                    parts.push(`Days since diagnosis: ${ctx.daysSinceDiagnosis}`);
        if (ctx.diagnosisRange)     parts.push(`Diagnosis range: ${ctx.diagnosisRange}`);
        if (ctx.onMedication)       parts.push(`On HIV medication: ${ctx.onMedication}`);
        if (ctx.hasProvider)        parts.push(`Has HIV provider: ${ctx.hasProvider}`);
        if (ctx.needsProviderHelp)  parts.push(`Needs help finding a provider or starting meds: Yes — offer to help when the moment is right, not repeatedly`);
        if (ctx.emotionalIntensity !== undefined)
                                    parts.push(`Emotional intensity at start: ${ctx.emotionalIntensity}/10`);
        if (ctx.emotions?.length)   parts.push(`Starting emotions: ${ctx.emotions.join(", ")}`);
        if (ctx.note)               parts.push(`User's opening note: "${ctx.note}"`);
        if (ctx.userAvatar)         parts.push(`User's avatar: ${ctx.userAvatar.emoji} ${ctx.userAvatar.name} — "${ctx.userAvatar.desc}"`);
        if (ctx.companion) {
          parts.push(`Companion name: ${ctx.companion.name}`);
          parts.push(`Companion pronouns: ${ctx.companion.pronouns} — use these pronouns when referring to yourself in any reflective or third-person context`);
        }
        if (parts.length) setOnboardingContext(parts.join("\n"));
        return;
      } catch { /* fall through to legacy keys */ }
    }

    const profile = localStorage.getItem("fyc_profile");
    if (profile) {
      try {
        const p = JSON.parse(profile);
        if (p.companion?.name) setCompanionName(p.companion.name);
        if (p.companion?.avatar?.emoji) setCompanionEmoji(p.companion.avatar.emoji);
        if (p.userAvatar?.emoji) setUserEmoji(p.userAvatar.emoji);
      } catch { /* ignore */ }
    }
    const name = localStorage.getItem("companion_userName") || "";
    if (name) setUserName(name);
  }, []);

  useEffect(() => {
    return () => {
      if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
    };
  }, []);

  const send = async () => {
    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }
    setShowProgress(false);

    const typed = inputRef.current.trim();
    const chipSelections = selectedChipsRef.current;

    if ((!typed && chipSelections.length === 0) || sending) return;

    const text =
      chipSelections.length > 0 && typed
        ? `${chipsToMessage(chipSelections)}. ${typed}`
        : chipSelections.length > 0
        ? chipsToMessage(chipSelections)
        : typed;

    inputRef.current = "";
    setInput("");
    selectedChipsRef.current = [];
    setSelectedChips([]);
    setChips([]);
    setSending(true);

    // Reset textarea height
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const nextMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(nextMessages);

    try {
      const start = Date.now();

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages,
          state,
          onboarding: onboardingContext,
        }),
      });

      const data = await res.json();

      const elapsed = Date.now() - start;
      if (elapsed < 800) {
        await new Promise((r) => setTimeout(r, 800 - elapsed));
      }

      const reply =
        typeof data?.reply === "string"
          ? data.reply
          : "I'm here with you. What feels most important right now?";

      const nextChips: string[] = Array.isArray(data?.suggestions)
        ? data.suggestions.map((s: unknown) => String(s)).slice(0, 6)
        : [];

      if (data?.state) setState(data.state);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);

      setChips(nextChips);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please try again in a moment.",
        },
      ]);
      setChips([]);
    } finally {
      setSending(false);
    }
  };

  const sendRef = useRef(send);
  useEffect(() => { sendRef.current = send; });

  const toggleChip = (text: string) => {
    const next = selectedChipsRef.current.includes(text)
      ? selectedChipsRef.current.filter((x) => x !== text)
      : [...selectedChipsRef.current, text];

    selectedChipsRef.current = next;
    setSelectedChips(next);

    if (autoSendTimerRef.current) clearTimeout(autoSendTimerRef.current);
    setShowProgress(false);

    if (next.length === 0) return;

    if (next.some((c) => DECISION_CHIPS.has(c))) {
      autoSendTimerRef.current = setTimeout(() => sendRef.current(), 0);
      return;
    }

    setProgressKey((k) => k + 1);
    setShowProgress(true);
    autoSendTimerRef.current = setTimeout(() => sendRef.current(), 5000);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    inputRef.current = e.target.value;
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  return (
    <div className={styles.chatRoot}>
      <div className={clsx(styles.orb, styles.orb1)} />
      <div className={clsx(styles.orb, styles.orb2)} />

      {/* Header */}
      <div className={styles.chatHeader}>
        <div className={styles.headerAvatar}>{companionEmoji}</div>
        <div className={styles.headerInfo}>
          <div className={styles.headerName}>{companionName}</div>
          <div className={styles.headerStatus}>
            <div className={styles.statusDot} />
            <span>Here with you</span>
          </div>
        </div>
        {userEmoji && <div className={styles.headerUserAvatar}>{userEmoji}</div>}
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        <div className={styles.dateDivider}>
          <div className={styles.dateLine} />
          <div className={styles.dateText}>Today</div>
          <div className={styles.dateLine} />
        </div>

        {messages.map((m, i) => {
          const isUser = m.role === "user";
          const isCont = i > 0 && messages[i - 1].role === m.role;
          const isLastAssistant = !isUser && i === messages.length - 1;

          return (
            <div key={i}>
              <div className={clsx(styles.msgRow, isUser ? styles.user : styles.companion)}>
                <div
                  className={clsx(
                    styles.msgAvatar,
                    isUser ? styles.userAv : styles.compAv,
                    isCont && styles.hidden
                  )}
                >
                  {isUser ? userEmoji || "🫂" : companionEmoji}
                </div>
                <div className={styles.msgCol}>
                  {!isCont && (
                    <div className={clsx(styles.senderName, isUser ? styles.userName : styles.compName)}>
                      {isUser ? (userName || "You") : companionName}
                    </div>
                  )}
                  <div
                    className={clsx(
                      styles.bubble,
                      isUser ? styles.userBubble : styles.compBubble,
                      isCont && styles.cont
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              </div>

              {/* Chips on last assistant message */}
              {isLastAssistant && chips.length > 0 && (
                <>
                  <div className={styles.chipsWrap}>
                    {chips.map((c) => (
                      <button
                        key={c}
                        className={clsx(styles.suggChip, selectedChips.includes(c) && styles.selected)}
                        onClick={() => toggleChip(c)}
                        disabled={sending}
                        aria-pressed={selectedChips.includes(c)}
                      >
                        {selectedChips.includes(c) ? "✓ " : ""}{c}
                      </button>
                    ))}
                  </div>
                  {showProgress && (
                    <div className={styles.progressBar}>
                      <div key={progressKey} className={styles.progressBarFill} />
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {sending && (
          <div className={styles.typingWrap}>
            <div className={clsx(styles.msgAvatar, styles.compAv)}>{companionEmoji}</div>
            <div className={styles.typingBubble}>
              <div className={styles.typingDot} />
              <div className={styles.typingDot} />
              <div className={styles.typingDot} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className={styles.inputArea}>
        <div className={styles.inputRow}>
          <div className={styles.inputWrap}>
            <textarea
              ref={textareaRef}
              className={styles.chatInput}
              placeholder="Type here..."
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              disabled={sending}
            />
          </div>
          <button
            className={styles.sendBtn}
            disabled={sending || (!input.trim() && selectedChips.length === 0)}
            onClick={send}
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
        <div className={styles.inputHint}>🔒 This conversation is private and confidential</div>
      </div>
    </div>
  );
}
