"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import styles from "./styles/Chat.module.css";
import CrisisButton from "../components/CrisisButton";
import { getStrings, readLang, getLangFamily } from "../i18n";

const FALLBACK_NAMES = ["Nova", "Sage", "River", "Luna"];

// ── Crisis detection — all 6 language families ───────────────────────────────
const CRISIS_PATTERNS = [
  // English
  /\b(kill\s*myself|killing\s*myself|end\s*my\s*life|take\s*my\s*(own\s*)?life|want\s*to\s*die|wish\s*i\s*were\s*dead|no\s*reason\s*to\s*(live|be\s*here)|better\s*off\s*dead|better\s*off\s*without\s*me|hurt\s*myself|self[\s-]?harm|suicidal|suicide|end\s*it\s*all|don'?t\s*want\s*to\s*(live|be\s*here)|can'?t\s*go\s*on)\b/i,
  // Spanish
  /\b(quiero\s*morir|quiero\s*acabar\s*con\s*mi\s*vida|suicida|hacerme\s*daño|no\s*quiero\s*vivir|terminar\s*con\s*todo|quitarme\s*la\s*vida|mejor\s*muerto|ya\s*no\s*quiero\s*vivir|sin\s*esperanza|no\s*hay\s*salida|matarme)\b/i,
  // Portuguese
  /\b(quero\s*morrer|suicida|me\s*machucar|acabar\s*com\s*tudo|não\s*quero\s*viver|me\s*matar|tirar\s*minha\s*vida)\b/i,
  // French
  /\b(je\s*veux\s*mourir|suicidaire|me\s*blesser|en\s*finir|plus\s*envie\s*de\s*vivre|mettre\s*fin\s*à\s*ma\s*vie)\b/i,
  // Haitian Creole
  /\b(mwen\s*vle\s*mouri|touye\s*tèt\s*mwen|fini\s*ak\s*tout|pa\s*vle\s*viv)\b/i,
  // Chinese
  /我想死|自杀|伤害自己|不想活了|结束生命|寻死/,
];
function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some(p => p.test(text));
}

// ── 9 mid-tone warm themes ────────────────────────────────────────────────────
const THEMES = [
  { id: "hopeful",  label: "🌸 Hopeful",  bg: "#C47A8A" },
  { id: "sunrise",  label: "☀️ Sunrise",  bg: "#C49A5A" },
  { id: "peaceful", label: "🌿 Peaceful", bg: "#5A9478" },
  { id: "calm",     label: "🌊 Calm",     bg: "#5A8FAA" },
  { id: "free",     label: "🦋 Free",     bg: "#8A7AAA" },
  { id: "bloom",    label: "🌺 Bloom",    bg: "#C47A5A" },
  { id: "bright",   label: "🌻 Bright",   bg: "#C4AA3A" },
  { id: "soft",     label: "🕊️ Soft",    bg: "#8A8A8A" },
  { id: "joy",      label: "🌈 Joy",      bg: "#AA8A5A" },
] as const;

function chipsToMessage(chips: string[]): string {
  if (chips.length === 1) return chips[0];
  const feelParts = chips.filter(c => c.toLowerCase().startsWith("i feel ")).map(c => c.slice(7));
  const others = chips.filter(c => !c.toLowerCase().startsWith("i feel "));
  const parts: string[] = [];
  if (feelParts.length > 0) {
    parts.push("I feel " + (feelParts.length === 1 ? feelParts[0] : feelParts.length === 2 ? `${feelParts[0]} and ${feelParts[1]}` : `${feelParts.slice(0,-1).join(", ")}, and ${feelParts[feelParts.length-1]}`));
  }
  parts.push(...others);
  return parts.join(". ");
}

function getTimeGreeting(langCode: string): string {
  const h = new Date().getHours();
  const family = getLangFamily(langCode);
  if (family === "es") {
    if (h >= 5  && h < 12) return "Buenos días";
    if (h >= 12 && h < 20) return "Buenas tardes";
    return "Me alegra que hayas escrito esta noche";
  }
  if (h >= 5  && h < 11) return "Good morning";
  if (h >= 11 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "It's late — I'm really glad you reached out instead of sitting with this alone tonight";
}

function buildOpeningMessage(ctx: any, langCode: string, welcomeBubble: string): string {
  const family = getLangFamily(langCode);
  const greeting = getTimeGreeting(langCode);
  const name = ctx?.name as string | null;
  const nameStr = name ? `, ${name}` : "";

  if (family === "es") {
    return `${greeting}${nameStr}. Me alegra mucho que estés aquí. Recibir un diagnóstico de VIH puede sentirse como si el suelo se moviera bajo tus pies — y lo que sientes ahora mismo, sea miedo, confusión, enojo o incluso entumecimiento, tiene todo el sentido. No estás solo/a en esto, y va a estar bien. Lo digo en serio. Tómate el tiempo que necesites. Cuando estés listo/a para hablar — de lo que sea — aquí estoy.`;
  }
  if (family !== "en") {
    return nameStr ? `${nameStr.replace(/^, /, "")}. ${welcomeBubble}` : welcomeBubble;
  }
  return `${greeting}${nameStr}. I'm really glad you're here. Being diagnosed with HIV can feel like the ground just shifted beneath you — and whatever you are feeling right now, whether that's fear, confusion, anger, or even numbness, all of it makes complete sense. You are not alone in this, and you are going to be okay. I mean that. Take all the time you need. When you're ready to talk — about anything at all — I'm right here with you.`;
}

// ── Web Audio ambient tones ──────────────────────────────────────────────────
function createAmbientNodes(ctx: AudioContext, type: string, masterGain: GainNode): AudioNode[] {
  const nodes: AudioNode[] = [];

  // Noise-based sounds
  if (["rain","forest","wind","fire","stream","thunder"].includes(type)) {
    const bufSize = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = type === "thunder" ? "lowpass" : type === "stream" ? "bandpass" : "lowpass";
    filter.frequency.value = type === "wind" ? 200 : type === "forest" ? 600 : type === "thunder" ? 80 : type === "stream" ? 800 : type === "fire" ? 350 : 400;
    src.connect(filter); filter.connect(masterGain); src.start();
    nodes.push(src, filter);
  } else if (type === "ocean") {
    const bufSize = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf; src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass"; filter.frequency.value = 300;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.4;
    lfo.connect(lfoGain); src.connect(filter); filter.connect(masterGain);
    lfo.start(); src.start();
    nodes.push(src, filter, lfo, lfoGain);
  } else if (type === "healing" || type === "piano") {
    const freq1 = type === "piano" ? 261.63 : 528;
    const freq2 = type === "piano" ? 392 : 264;
    const osc1 = ctx.createOscillator(); osc1.type = "sine"; osc1.frequency.value = freq1;
    const g1 = ctx.createGain(); g1.gain.value = type === "piano" ? 0.4 : 0.6;
    osc1.connect(g1); g1.connect(masterGain);
    const osc2 = ctx.createOscillator(); osc2.type = "sine"; osc2.frequency.value = freq2;
    const g2 = ctx.createGain(); g2.gain.value = 0.25;
    osc2.connect(g2); g2.connect(masterGain);
    osc1.start(); osc2.start();
    nodes.push(osc1, g1, osc2, g2);
  } else {
    // Uplift tracks: warm harmonic pairs
    const UPLIFT_FREQS: Record<string, number[]> = {
      rising:    [396, 528, 660],
      loved:     [396, 528, 660],
      stronger:  [440, 550],
      newday:    [396, 462],
      becoming:  [468, 585],
      worthy:    [432, 528],
      brave:     [440, 528],
      enough:    [528, 594],
    };
    const freqs: number[] = UPLIFT_FREQS[type] ?? [432, 528];
    const gainVal = 0.35 / freqs.length;
    freqs.forEach((freq: number) => {
      const osc = ctx.createOscillator(); osc.type = "sine"; osc.frequency.value = freq;
      const g = ctx.createGain(); g.gain.value = gainVal;
      osc.connect(g); g.connect(masterGain); osc.start();
      nodes.push(osc, g);
    });
  }
  return nodes;
}


type Message = { role: "assistant" | "user"; content: string };
type GlossaryEntry = { term: string; def: string };
type BreathPhase = "in" | "hold" | "out" | "done";
const BREATH_ROUNDS = 3;

export default function ChatPage() {
  // ── Language / i18n ────────────────────────────────────────────────────────
  const [langCode, setLangCode] = useState("en-US");
  const t = getStrings(langCode);

  // ── Messages ──────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "I'm here with you. Take all the time you need." },
  ]);
  const [input, setInput] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [chips, setChips] = useState<string[]>(["I feel scared", "I feel overwhelmed", "I feel numb", "I'm not sure what to say"]);
  const [sending, setSending] = useState(false);
  const [state, setState] = useState({ mode: "companion" as "companion" | "guide", topic: "start", stage: "start:v1" });

  // ── Profile ────────────────────────────────────────────────────────────────
  const [companionName, setCompanionName] = useState(() => FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)]);
  const [companionEmoji, setCompanionEmoji] = useState("🌱");
  const [userEmoji, setUserEmoji] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [onboardingContext, setOnboardingContext] = useState<string>("");
  const [openingCtx, setOpeningCtx] = useState<any>(null);

  // ── UI state ───────────────────────────────────────────────────────────────
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("in");
  const [breathCount, setBreathCount] = useState(4);
  const [breathRound, setBreathRound] = useState(1);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState<GlossaryEntry | null>(null);
  const [providerCity, setProviderCity] = useState("");
  const [providerCategory, setProviderCategory] = useState("");
  const [mobileSheet, setMobileSheet] = useState<"calm" | "relax" | "terms" | "provider" | "music" | null>(null);
  const [crisisDetected, setCrisisDetected] = useState(false);

  // ── Sidebar accordions (calm/relax/dict closed; provider/music open) ───────
  const [sidebarOpen, setSidebarOpen] = useState<Record<string, boolean>>({
    calm: false, relax: false, dict: false,
  });
  const toggleSection = (key: string) => setSidebarOpen(prev => ({ ...prev, [key]: !prev[key] }));

  // ── Music ──────────────────────────────────────────────────────────────────
  const [musicTab, setMusicTab] = useState<"sounds" | "uplift">("sounds");
  const [activeTrackType, setActiveTrackType] = useState<string | null>(null);
  const [trackVolumes, setTrackVolumes] = useState<Record<string, number>>({});

  // ── Refs ───────────────────────────────────────────────────────────────────
  const inputRef = useRef("");
  const selectedChipsRef = useRef<string[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const ambientNodesRef = useRef<AudioNode[]>([]);
  const providerInputRef = useRef<HTMLInputElement | null>(null);
  const mobileProviderInputRef = useRef<HTMLInputElement | null>(null);

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending, chips]);

  // Affirmation cycle (6s)
  useEffect(() => {
    const affirms = t.affirmations;
    const timer = setInterval(() => setAffirmationIdx(i => (i + 1) % affirms.length), 6000);
    return () => clearInterval(timer);
  }, [t]);

  // Placeholder cycle
  const PLACEHOLDERS = [t.welcome_bubble, ...(t.initial_chips || [])];
  useEffect(() => {
    const timer = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 6000);
    return () => clearInterval(timer);
  }, [t]);

  // Crisis pulse
  useEffect(() => {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (lastUser && detectCrisis(lastUser.content)) setCrisisDetected(true);
  }, [messages]);

  // Google Places
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
    if (!key) return;
    if ((window as any).google?.maps?.places) { initPlaces(); return; }
    const scriptId = "gmaps-places-script";
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.onload = initPlaces;
    document.head.appendChild(script);

    function initPlaces() {
      const opts = { types: ["geocode"], componentRestrictions: { country: "us" } };
      if (providerInputRef.current) {
        const ac = new (window as any).google.maps.places.Autocomplete(providerInputRef.current, opts);
        ac.addListener("place_changed", () => {
          const place = ac.getPlace();
          if (place?.formatted_address) setProviderCity(place.formatted_address);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (mobileSheet !== "provider") return;
    const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
    if (!key || !(window as any).google?.maps?.places) return;
    if (!mobileProviderInputRef.current) return;
    const opts = { types: ["geocode"], componentRestrictions: { country: "us" } };
    const ac = new (window as any).google.maps.places.Autocomplete(mobileProviderInputRef.current, opts);
    ac.addListener("place_changed", () => {
      const place = ac.getPlace();
      if (place?.formatted_address) setProviderCity(place.formatted_address);
    });
  }, [mobileSheet]);

  // Load onboarding context + language
  useEffect(() => {
    const savedLang = localStorage.getItem("companion_language") ?? "en-US";
    setLangCode(savedLang);

    const raw = localStorage.getItem("companion_context");
    if (raw) {
      try {
        const ctx = JSON.parse(raw);
        if (ctx.companion?.name) setCompanionName(ctx.companion.name);
        if (ctx.companion?.avatar?.emoji) setCompanionEmoji(ctx.companion.avatar.emoji);
        if (ctx.userAvatar?.emoji) setUserEmoji(ctx.userAvatar.emoji);
        if (ctx.name) setUserName(ctx.name);

        const lang = savedLang;
        const welcome = getStrings(lang).welcome_bubble;
        setOpeningCtx(ctx);
        setMessages([{ role: "assistant", content: buildOpeningMessage(ctx, lang, welcome) }]);

        const pronounLabel = ctx.pronoun?.toLowerCase().includes("he/him") ? "he/him/his"
          : ctx.pronoun?.toLowerCase().includes("she/her") ? "she/her/hers"
          : ctx.pronoun?.toLowerCase().includes("they/them") ? "they/them/their"
          : null;

        const parts: string[] = [];
        parts.push(`CRITICAL: You are speaking directly to the patient. Always use "you" and "your" when addressing them — NEVER replace "you" with they/them/their/he/him/she/her, regardless of pronoun selection. Every sentence directed at the patient must use second-person ("you are", "your", etc).`);
        if (pronounLabel) parts.push(`Patient's stated pronouns (for future third-party reference only, NOT for replacing "you" in conversation): ${pronounLabel}`);
        if (ctx.name)               parts.push(`User's name: ${ctx.name}`);
        if (ctx.diagnosisDate)      parts.push(`Diagnosis date: ${ctx.diagnosisDate}`);
        if (ctx.daysSinceDiagnosis !== null && ctx.daysSinceDiagnosis !== undefined) parts.push(`Days since diagnosis: ${ctx.daysSinceDiagnosis}`);
        if (ctx.diagnosisRange)     parts.push(`Diagnosis range: ${ctx.diagnosisRange}`);
        if (ctx.hasProvider === "No") parts.push(`Has HIV provider: No — proactively offer to help find one once, warmly, near the start of conversation.`);
        else if (ctx.hasProvider)   parts.push(`Has HIV provider: ${ctx.hasProvider}`);
        if (ctx.onMedication === "No") parts.push(`On HIV medication: No — naturally open the door to what starting ART actually feels like, at the right moment.`);
        else if (ctx.onMedication)  parts.push(`On HIV medication: ${ctx.onMedication}`);
        if (ctx.needsProviderHelp)  parts.push(`Wants help finding an HIV provider: Yes — proactively offer to help find a provider once, warmly, early in the conversation.`);
        if (ctx.wantsMedsIntro)     parts.push(`Patient wants to learn about starting HIV medications — open a door naturally to what starting ART actually feels like, early in the conversation.`);
        if (ctx.emotionalIntensity !== undefined) parts.push(`Emotional intensity at start: ${ctx.emotionalIntensity}/10`);
        if (ctx.emotions?.length)   parts.push(`Starting emotions: ${ctx.emotions.join(", ")}`);
        if (ctx.note)               parts.push(`User's opening note: "${ctx.note}"`);
        if (ctx.userAvatar)         parts.push(`User's avatar: ${ctx.userAvatar.emoji} ${ctx.userAvatar.name}`);
        if (ctx.companion) {
          parts.push(`Companion name: ${ctx.companion.name}`);
          parts.push(`Companion pronouns: ${ctx.companion.pronouns}`);
        }
        if (parts.length) setOnboardingContext(parts.join("\n"));
        return;
      } catch { /* fall through */ }
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

    // Set initial chips and welcome from language
    setChips(getStrings(savedLang).initial_chips);
    setMessages([{ role: "assistant", content: getStrings(savedLang).welcome_bubble }]);
  }, []);

  // Apply saved theme
  useEffect(() => {
    const theme = localStorage.getItem("companion_theme") ?? "hopeful";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  // ── Breathing ─────────────────────────────────────────────────────────────
  const startBreathing = () => { setBreathPhase("in"); setBreathCount(4); setBreathRound(1); setShowBreathing(true); };

  useEffect(() => {
    if (!showBreathing) { if (breathTimerRef.current) clearInterval(breathTimerRef.current); return; }
    if (breathPhase === "done") return;
    breathTimerRef.current = setInterval(() => {
      setBreathCount(prev => {
        if (prev > 1) return prev - 1;
        clearInterval(breathTimerRef.current!);
        setBreathPhase(ph => {
          if (ph === "in")   { setTimeout(() => setBreathCount(7), 0); return "hold"; }
          if (ph === "hold") { setTimeout(() => setBreathCount(8), 0); return "out"; }
          setBreathRound(r => {
            const next = r + 1;
            if (next > BREATH_ROUNDS) setTimeout(() => setBreathPhase("done"), 0);
            else setTimeout(() => { setBreathCount(4); setBreathPhase("in"); }, 800);
            return next;
          });
          return "out";
        });
        return prev;
      });
    }, 1000);
    return () => { if (breathTimerRef.current) clearInterval(breathTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBreathing, breathPhase]);

  // ── Theme ─────────────────────────────────────────────────────────────────
  const applyTheme = (id: string) => {
    localStorage.setItem("companion_theme", id);
    document.documentElement.setAttribute("data-theme", id);
    setShowThemePicker(false);
  };

  // ── Ambient music ─────────────────────────────────────────────────────────
  const stopAmbient = () => {
    ambientNodesRef.current.forEach(n => { try { (n as any).stop?.(); n.disconnect(); } catch {} });
    ambientNodesRef.current = [];
  };

  const playAmbient = (type: string, vol: number) => {
    stopAmbient();
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const gain = ctx.createGain();
    gain.gain.value = vol;
    gain.connect(ctx.destination);
    masterGainRef.current = gain;
    const nodes = createAmbientNodes(ctx, type, gain);
    ambientNodesRef.current = [gain, ...nodes];
  };

  const toggleTrack = (type: string) => {
    if (activeTrackType === type) {
      stopAmbient();
      setActiveTrackType(null);
    } else {
      const vol = trackVolumes[type] ?? 0.35;
      playAmbient(type, vol);
      setActiveTrackType(type);
    }
  };

  const setTrackVol = (type: string, vol: number) => {
    setTrackVolumes(prev => ({ ...prev, [type]: vol }));
    if (activeTrackType === type && masterGainRef.current) {
      masterGainRef.current.gain.value = vol;
    }
  };

  const switchMusicTab = (tab: "sounds" | "uplift") => {
    stopAmbient();
    setActiveTrackType(null);
    setMusicTab(tab);
  };

  useEffect(() => () => {
    stopAmbient();
    if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
  }, []);

  // ── Send ──────────────────────────────────────────────────────────────────
  const send = async () => {
    const typed = inputRef.current.trim();
    const chipSel = selectedChipsRef.current;
    if ((!typed && chipSel.length === 0) || sending) return;

    const text = chipSel.length > 0 && typed ? `${chipsToMessage(chipSel)}. ${typed}`
      : chipSel.length > 0 ? chipsToMessage(chipSel) : typed;

    inputRef.current = "";
    setInput("");
    selectedChipsRef.current = [];
    setSelectedChips([]);
    setChips([]);
    setSending(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);

    try {
      const start = Date.now();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, state, onboarding: onboardingContext, language: langCode }),
      });
      const data = await res.json();
      const elapsed = Date.now() - start;
      if (elapsed < 800) await new Promise(r => setTimeout(r, 800 - elapsed));

      const nextChips: string[] = Array.isArray(data?.suggestions) ? data.suggestions.map((s: unknown) => String(s)).slice(0, 6) : [];
      if (data?.state) setState(data.state);

      if (Array.isArray(data?.multi_reply) && data.multi_reply.length > 0) {
        const bubbles = (data.multi_reply as string[]).map(s => String(s).trim()).filter(Boolean);
        setMessages(prev => [...prev, ...bubbles.map(content => ({ role: "assistant" as const, content }))]);
      } else {
        const reply = typeof data?.reply === "string" ? data.reply : t.welcome_bubble;
        setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      }
      setChips(nextChips);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: t.welcome_bubble }]);
      setChips([]);
    } finally {
      setSending(false);
    }
  };

  const sendRef = useRef(send);
  useEffect(() => { sendRef.current = send; });

  const triggerSend = (text: string) => {
    if (sending) return;
    inputRef.current = text;
    setInput(text);
    selectedChipsRef.current = [];
    setSelectedChips([]);
    setTimeout(() => sendRef.current(), 50);
  };

  const toggleChip = (text: string) => {
    if (sending) return;
    selectedChipsRef.current = [text];
    setSelectedChips([text]);
    sendRef.current();
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    inputRef.current = e.target.value;
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const breathLabel = breathPhase === "in" ? "Breathe in..." : breathPhase === "hold" ? "Hold..." : breathPhase === "out" ? "Breathe out..." : "";
  const breathCircleClass = breathPhase === "in" ? styles.breathIn : breathPhase === "hold" ? styles.breathHold : styles.breathOut;

  // Provider category search
  const providerCats = t.provider_cats;
  const doProviderSearch = (_inputEl?: HTMLInputElement | null) => {
    if (!providerCity.trim()) return;
    const catObj = providerCats[Number(providerCategory)] ?? null;
    if (catObj) triggerSend(t.provider_search_msg(catObj.prompt, providerCity.trim()));
    setProviderCity("");
  };

  // Sidebar provider search — find category by id from providerCategory state (stores index as string)
  const selectedProviderCat = providerCats[Number(providerCategory)] ?? null;

  const renderProviderSection = (isMobile = false) => (
    <>
      <p style={{ fontSize: isMobile ? 12 : 11, color: "rgba(245,237,224,.45)", marginBottom: 10, lineHeight: 1.5 }}>
        {t.sidebar_provider_select}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr 1fr" : "1fr 1fr", gap: 6, marginBottom: 10 }}>
        {providerCats.map((cat, idx) => (
          <button
            key={cat.label}
            onClick={() => setProviderCategory(String(idx))}
            style={{
              background: providerCategory === String(idx) ? "rgba(74,124,111,0.2)" : "rgba(255,248,235,0.04)",
              border: `1px solid ${providerCategory === String(idx) ? "rgba(74,124,111,0.6)" : "rgba(255,248,235,0.1)"}`,
              borderRadius: 10, padding: isMobile ? "9px 6px" : "9px 8px",
              color: providerCategory === String(idx) ? "#8ecfbe" : "rgba(245,237,224,0.6)",
              fontSize: isMobile ? 10 : 11, fontWeight: 500,
              cursor: "pointer", textAlign: "center",
              fontFamily: "DM Sans, sans-serif",
              display: "flex", flexDirection: "column", alignItems: "center", gap: isMobile ? 3 : 4,
              transition: "all 0.15s ease",
            }}
          >
            <span style={{ fontSize: isMobile ? 18 : 16 }}>{cat.icon}</span>
            <span style={{ lineHeight: 1.3 }}>{cat.label}</span>
          </button>
        ))}
      </div>
      {selectedProviderCat && (
        <div className={styles.providerSearchRow}>
          <input
            ref={isMobile ? mobileProviderInputRef : providerInputRef}
            className={styles.providerInput}
            placeholder={t.search + "..."}
            value={providerCity}
            onChange={e => setProviderCity(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                triggerSend(t.provider_search_msg(selectedProviderCat.prompt, providerCity.trim()));
                setProviderCity("");
                if (isMobile) setMobileSheet(null);
              }
            }}
          />
          <button
            className={styles.providerSearchBtn}
            disabled={sending || !providerCity.trim()}
            onClick={() => {
              triggerSend(t.provider_search_msg(selectedProviderCat.prompt, providerCity.trim()));
              setProviderCity("");
              if (isMobile) setMobileSheet(null);
            }}
          >
            {t.search}
          </button>
        </div>
      )}
    </>
  );

  const renderMusicSection = () => {
    const trackList = musicTab === "sounds" ? t.sounds : t.uplift;
    return (
      <div className={styles.musicPlayer}>
        <div className={styles.musicTabRow}>
          <button className={clsx(styles.musicTab, musicTab === "sounds" && styles.musicTabActive)} onClick={() => switchMusicTab("sounds")}>{t.sidebar_music_sounds}</button>
          <button className={clsx(styles.musicTab, musicTab === "uplift" && styles.musicTabActive)} onClick={() => switchMusicTab("uplift")}>{t.sidebar_music_uplift}</button>
        </div>
        {trackList.map((track) => {
          const isPlaying = activeTrackType === track.type;
          const vol = trackVolumes[track.type] ?? 0.35;
          return (
            <div key={track.type} className={styles.musicTrackRow}>
              <button
                className={clsx(styles.musicTrackBtn, isPlaying && styles.musicTrackBtnActive)}
                onClick={() => toggleTrack(track.type)}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <div className={styles.musicTrackInfo}>
                <span className={styles.musicTrackName}>{track.name}</span>
                {isPlaying && (
                  <div className={styles.musicLiveBar}>
                    <span /><span /><span /><span />
                  </div>
                )}
              </div>
              <input
                type="range" min={0} max={1} step={0.01} value={vol}
                onChange={e => setTrackVol(track.type, Number(e.target.value))}
                className={styles.musicVolumeMini}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.chatRoot} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column" }}>
      <div className={clsx(styles.orb, styles.orb1)} />
      <div className={clsx(styles.orb, styles.orb2)} />

      {/* ── Breathing overlay ── */}
      {showBreathing && (
        <div className={styles.breathOverlay}>
          {breathPhase === "done" ? (
            <div className={styles.breathDoneWrap}>
              <div className={styles.breathDoneText}>Well done. Take a moment to notice how you feel.</div>
              <button className={styles.breathDoneBtn} onClick={() => setShowBreathing(false)}>Return to chat</button>
            </div>
          ) : (
            <>
              <div className={styles.breathLabel}>{breathLabel}</div>
              <div className={clsx(styles.breathCircle, breathCircleClass)} />
              <div className={styles.breathCounter}>{breathCount}</div>
              <div className={styles.breathRoundText}>Round {Math.min(breathRound, BREATH_ROUNDS)} of {BREATH_ROUNDS}</div>
              <button className={styles.breathCloseBtn} onClick={() => setShowBreathing(false)}>Stop exercise</button>
            </>
          )}
        </div>
      )}

      {/* ── Glossary modal ── */}
      {glossaryTerm && (
        <div className={styles.glossaryOverlay} onClick={() => setGlossaryTerm(null)}>
          <div className={styles.glossaryModal} onClick={e => e.stopPropagation()}>
            <div className={styles.glossaryModalTerm}>{glossaryTerm.term}</div>
            <div className={styles.glossaryModalDef}>{glossaryTerm.def}</div>
            <button className={styles.glossaryModalClose} onClick={(e) => { e.stopPropagation(); setGlossaryTerm(null); }}>{t.got_it}</button>
          </div>
        </div>
      )}

      {/* ── Theme picker overlay ── */}
      {showThemePicker && (
        <div className={styles.themeOverlay} onClick={() => setShowThemePicker(false)}>
          <div className={styles.themePanel} onClick={e => e.stopPropagation()}>
            <div className={styles.themePanelTitle}>Choose your space</div>
            <div className={styles.themePanelGrid}>
              {THEMES.map(th => (
                <button key={th.id} className={styles.themePanelSwatch} onClick={() => applyTheme(th.id)}>
                  <div className={styles.themePanelBg} style={{ background: th.bg }} />
                  <span className={styles.themePanelLabel}>{th.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className={styles.chatHeader} style={{ flexShrink: 0, height: 56 }}>
        <div className={styles.headerAvatar}>{companionEmoji}</div>
        <div className={styles.headerInfo}>
          <div className={styles.headerName}>{companionName}</div>
        </div>
        <button className={styles.headerIconBtn} onClick={() => setShowThemePicker(v => !v)} title="Change theme">🎨</button>
        {userEmoji && <div className={styles.headerUserAvatar}>{userEmoji}</div>}
      </div>

      {/* ── Body ── */}
      <div className={styles.chatBody} style={{ flex: 1, overflow: "hidden" }}>

        {/* ── Chat panel ── */}
        <div className={styles.chatPanel}>
          {/* Affirmation bar */}
          <div className={styles.affirmationBar}>
            <span key={affirmationIdx} className={styles.affirmationText}>
              {t.affirmations[affirmationIdx % t.affirmations.length]}
            </span>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            <div className={styles.dateDivider}>
              <div className={styles.dateLine} />
              <div className={styles.dateText}>{t.today}</div>
              <div className={styles.dateLine} />
            </div>

            {messages.map((m, i) => {
              const isUser = m.role === "user";
              const isCont = i > 0 && messages[i - 1].role === m.role;
              const isLastAssistant = !isUser && i === messages.length - 1;
              return (
                <div key={i}>
                  <div className={clsx(styles.msgRow, isUser ? styles.user : styles.companion)}>
                    <div className={clsx(styles.msgAvatar, isUser ? styles.userAv : styles.compAv, isCont && styles.hidden)}>
                      {isUser ? userEmoji || "🫂" : companionEmoji}
                    </div>
                    <div className={styles.msgCol}>
                      {!isCont && (
                        <div className={clsx(styles.senderName, isUser ? styles.userName : styles.compName)}>
                          {isUser ? (userName || "You") : companionName}
                        </div>
                      )}
                      <div className={clsx(styles.bubble, isUser ? styles.userBubble : styles.compBubble, isCont && styles.cont)}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                  {isLastAssistant && chips.length > 0 && (
                    <div className={styles.chipsWrap}>
                      {chips.map(c => <button key={c} className={styles.suggChip} onClick={() => toggleChip(c)} disabled={sending}>{c}</button>)}
                    </div>
                  )}
                </div>
              );
            })}

            {sending && (
              <div className={styles.typingWrap}>
                <div className={clsx(styles.msgAvatar, styles.compAv)}>{companionEmoji}</div>
                <div className={styles.typingBubble}>
                  <div className={styles.typingDot} /><div className={styles.typingDot} /><div className={styles.typingDot} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Mobile wellness icon bar */}
          <div className={styles.mobileWellnessBar}>
            <button className={styles.mobileWellnessIconBtn} onClick={() => setMobileSheet("calm")}>
              <span>🧘</span><span className={styles.mobileWellnessIconLbl}>{t.wb_calm}</span>
            </button>
            <button className={styles.mobileWellnessIconBtn} onClick={() => setMobileSheet("relax")}>
              <span>🌿</span><span className={styles.mobileWellnessIconLbl}>{t.wb_relax}</span>
            </button>
            <button className={styles.mobileWellnessIconBtn} onClick={() => setMobileSheet("terms")}>
              <span>📖</span><span className={styles.mobileWellnessIconLbl}>{t.wb_terms}</span>
            </button>
            <button className={styles.mobileWellnessIconBtn} onClick={() => setMobileSheet("provider")}>
              <span>📍</span><span className={styles.mobileWellnessIconLbl}>{t.wb_provider}</span>
            </button>
            <button className={styles.mobileWellnessIconBtn} onClick={() => setMobileSheet("music")}>
              <span>🎵</span><span className={styles.mobileWellnessIconLbl}>{t.sidebar_music_title.replace(/^🎵 ?/, "")}</span>
            </button>
          </div>

          {/* Input bar */}
          <div className={styles.inputArea} style={{ flexShrink: 0 }}>
            <div className={styles.inputRow}>
              <div className={styles.inputWrap}>
                <textarea
                  ref={textareaRef}
                  className={styles.chatInput}
                  placeholder={PLACEHOLDERS[placeholderIdx % PLACEHOLDERS.length] || ""}
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  rows={1}
                  disabled={sending}
                />
              </div>
              <button className={styles.sendBtn} disabled={sending || (!input.trim() && selectedChips.length === 0)} onClick={send}>
                <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
              </button>
            </div>
            <div className={styles.inputFooter}>
              <div className={styles.inputHintPrivacy}>🔒 {t.privacy}</div>
              <div className={styles.inputFooterDivider} />
              <div className={styles.inputHintCopyright}>© 2025 FirstYear Companion. All rights reserved. Not a clinical tool.</div>
            </div>
          </div>
        </div>

        {/* ── Wellness sidebar ── */}
        <div className={styles.wellnessSidebar}>

          {/* Find Your Calm — accordion */}
          <div className={styles.sidebarCard}>
            <button className={styles.sidebarAccordionHeader} onClick={() => toggleSection("calm")}>
              <span className={styles.sidebarCardTitle}>{t.sidebar_calm_title}</span>
              <span className={clsx(styles.sidebarAccordionArrow, sidebarOpen.calm && styles.sidebarAccordionArrowOpen)}>▼</span>
            </button>
            {sidebarOpen.calm && (
              <div className={styles.sidebarBtnGroup} style={{ marginTop: 9 }}>
                {t.sidebar_calm_btns.map((label, i) => (
                  <button key={i} className={styles.sidebarBtn} disabled={sending} onClick={() => {
                    if (i === 0) { startBreathing(); }
                    else if (t.sidebar_calm_prompts[i]) triggerSend(t.sidebar_calm_prompts[i]);
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Give Yourself a Moment — accordion */}
          <div className={styles.sidebarCard}>
            <button className={styles.sidebarAccordionHeader} onClick={() => toggleSection("relax")}>
              <span className={styles.sidebarCardTitle}>{t.sidebar_relax_title}</span>
              <span className={clsx(styles.sidebarAccordionArrow, sidebarOpen.relax && styles.sidebarAccordionArrowOpen)}>▼</span>
            </button>
            {sidebarOpen.relax && (
              <div className={styles.sidebarBtnGroup} style={{ marginTop: 9 }}>
                {t.sidebar_relax_btns.map((label, i) => (
                  <button key={i} className={styles.sidebarBtn} disabled={sending} onClick={() => {
                    if (t.sidebar_relax_prompts[i]) triggerSend(t.sidebar_relax_prompts[i]);
                  }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* HIV Dictionary — accordion */}
          <div className={styles.sidebarCard}>
            <button className={styles.sidebarAccordionHeader} onClick={() => toggleSection("dict")}>
              <span className={styles.sidebarCardTitle}>{t.sidebar_dict_title}</span>
              <span className={clsx(styles.sidebarAccordionArrow, sidebarOpen.dict && styles.sidebarAccordionArrowOpen)}>▼</span>
            </button>
            {sidebarOpen.dict && (
              <div className={styles.glossaryList} style={{ marginTop: 9 }}>
                {t.glossary.map(g => (
                  <button key={g.term} className={styles.glossaryTerm} onClick={() => setGlossaryTerm(g)}>
                    <span>{g.term}</span><span className={styles.glossaryTermArrow}>›</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Find a Provider — always expanded */}
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarCardTitle}>{t.sidebar_provider_title}</div>
            {renderProviderSection(false)}
          </div>

          {/* Calming Music — always expanded */}
          <div className={styles.sidebarCard}>
            <div className={styles.sidebarCardTitle}>{t.sidebar_music_title}</div>
            {renderMusicSection()}
          </div>
        </div>
      </div>

      {/* ── Mobile bottom sheet ── */}
      {mobileSheet && (
        <div className={styles.mobileSheetOverlay} onClick={() => setMobileSheet(null)}>
          <div className={styles.mobileSheet} onClick={e => e.stopPropagation()}>
            <div className={styles.mobileSheetHandle} />

            {mobileSheet === "calm" && (
              <>
                <div className={styles.mobileSheetTitle}>{t.sidebar_calm_title}</div>
                <div className={styles.mobileSheetBtnGroup}>
                  {t.sidebar_calm_btns.map((label, i) => (
                    <button key={i} className={styles.sidebarBtn} disabled={sending} onClick={() => {
                      if (i === 0) { startBreathing(); setMobileSheet(null); }
                      else if (t.sidebar_calm_prompts[i]) { triggerSend(t.sidebar_calm_prompts[i]); setMobileSheet(null); }
                    }}>
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mobileSheet === "relax" && (
              <>
                <div className={styles.mobileSheetTitle}>{t.sidebar_relax_title}</div>
                <div className={styles.mobileSheetBtnGroup}>
                  {t.sidebar_relax_btns.map((label, i) => (
                    <button key={i} className={styles.sidebarBtn} disabled={sending} onClick={() => {
                      if (t.sidebar_relax_prompts[i]) { triggerSend(t.sidebar_relax_prompts[i]); setMobileSheet(null); }
                    }}>
                      {label}
                    </button>
                  ))}
                </div>
              </>
            )}

            {mobileSheet === "terms" && (
              <>
                <div className={styles.mobileSheetTitle}>{t.sidebar_dict_title}</div>
                <div className={styles.glossaryList}>
                  {t.glossary.map(g => (
                    <button key={g.term} className={styles.glossaryTerm} onClick={() => { setGlossaryTerm(g); setMobileSheet(null); }}>
                      <span>{g.term}</span><span className={styles.glossaryTermArrow}>›</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {mobileSheet === "provider" && (
              <>
                <div className={styles.mobileSheetTitle}>{t.sidebar_provider_title}</div>
                {renderProviderSection(true)}
              </>
            )}

            {mobileSheet === "music" && (
              <>
                <div className={styles.mobileSheetTitle}>{t.sidebar_music_title}</div>
                {renderMusicSection()}
              </>
            )}
          </div>
        </div>
      )}

      <CrisisButton pulsing={crisisDetected} />
    </div>
  );
}
