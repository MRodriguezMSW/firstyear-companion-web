"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import styles from "./styles/Chat.module.css";
import CrisisButton from "../components/CrisisButton";

const FALLBACK_NAMES = ["Nova", "Sage", "River", "Luna"];

const WELCOME_BUBBLE: Record<"en" | "es", string> = {
  en: "I'm here with you. Take all the time you need.",
  es: "Estoy aquí contigo. Tómate todo el tiempo que necesites.",
};

const AFFIRMATIONS = [
  "You are safe here.",
  "Take your time.",
  "You are not alone.",
  "You are stronger than you know.",
  "Healing is not linear — and that's okay.",
];

const PLACEHOLDERS = {
  en: ["What's on your mind?", "Talk to me...", "I'm listening...", "Whatever you're feeling is okay to share."],
  es: ["¿Qué tienes en mente?", "Cuéntame...", "Te escucho...", "Lo que sientes está bien compartirlo."],
};

const THEMES = [
  { id: "forest",   label: "🌲 Forest",   bg: "#0e1f1b" },
  { id: "ocean",    label: "🌊 Ocean",    bg: "#0a1a2e" },
  { id: "dusk",     label: "🌅 Dusk",     bg: "#1e1018" },
  { id: "midnight", label: "🌙 Midnight", bg: "#0d0e1f" },
  { id: "ember",    label: "🍂 Ember",    bg: "#1a100a" },
  { id: "bloom",    label: "🌸 Bloom",    bg: "#1a1015" },
] as const;

const AMBIENT_TRACKS = [
  { name: "Gentle Rain",    type: "rain"    },
  { name: "Ocean Waves",    type: "ocean"   },
  { name: "Forest Breeze",  type: "forest"  },
  { name: "Healing Tone",   type: "healing" },
  { name: "Soft Wind",      type: "wind"    },
] as const;

const GLOSSARY = [
  { term: "U=U", def: "Undetectable = Untransmittable. If you are on treatment and your viral load is undetectable, you cannot sexually transmit HIV to a partner. This is one of the most important things to know — and it's backed by extensive science." },
  { term: "ART", def: "Antiretroviral Therapy. The medication used to treat HIV. Usually just one pill, once a day. It keeps the virus suppressed so your immune system can recover and stay healthy." },
  { term: "Viral Load (VL)", def: "The amount of HIV in your blood. The goal of treatment is to get this number to 'undetectable.' Most people reach that within 3–6 months of starting medication." },
  { term: "CD4 Count", def: "CD4 cells are a type of immune cell that HIV attacks. A higher CD4 count means a stronger immune system. Treatment helps rebuild your CD4 count over time." },
  { term: "PrEP", def: "Pre-Exposure Prophylaxis. A pill or injection that HIV-negative people take to prevent getting HIV. It's over 99% effective when taken as prescribed." },
  { term: "PEP", def: "Post-Exposure Prophylaxis. Emergency medication taken within 72 hours of a possible HIV exposure. The sooner it's started, the better — don't wait if you think you may have been exposed." },
  { term: "Undetectable", def: "When HIV levels in your blood are so low the test can't detect them. If you're undetectable, U=U applies — you cannot transmit HIV sexually. This is the goal of treatment." },
  { term: "AIDS", def: "An advanced stage of untreated HIV. With modern treatment, most people living with HIV today never develop AIDS. Starting treatment early prevents this completely." },
  { term: "Opportunistic Infection", def: "An infection that takes advantage of a weakened immune system. These are rare with treatment. Staying on your medication keeps your immune system strong enough to prevent them." },
  { term: "Ryan White Program", def: "A federal program that helps people living with HIV access care and medication regardless of ability to pay. If you don't have insurance or can't afford care, this program can help." },
];

const PROVIDER_CATEGORIES = [
  { id: "hiv",       icon: "🩺", label: "HIV Provider",               prompt: "HIV care providers" },
  { id: "mental",    icon: "🧠", label: "Mental Health Therapist",    prompt: "mental health therapists who specialize in chronic illness" },
  { id: "substance", icon: "💊", label: "Substance Use Counselor",    prompt: "substance use counselors" },
  { id: "std",       icon: "🧪", label: "STD Testing",                prompt: "STD testing clinics" },
  { id: "lgbtq",     icon: "🏳️‍🌈", label: "LGBTQ+ Affirming Care",  prompt: "LGBTQ+ affirming healthcare providers" },
  { id: "prep",      icon: "💉", label: "PrEP Provider",              prompt: "PrEP providers" },
] as const;

// ── Crisis detection (visual pulse only — no voice) ──────────────────────────
const CRISIS_PATTERNS = [
  /\b(kill\s*myself|killing\s*myself|end\s*my\s*life|take\s*my\s*(own\s*)?life|want\s*to\s*die|wish\s*i\s*were\s*dead|no\s*reason\s*to\s*(live|be\s*here)|better\s*off\s*dead|better\s*off\s*without\s*me)\b/i,
  /\b(suicide|suicidal|self[\s-]?harm|cut\s*(myself|me)|hurt\s*(myself|me)|overdose)\b/i,
  /\b(hopeless|no hope|feeling hopeless|there('?s| is) no point|can'?t go on|can'?t do this anymore|don'?t want to be here|don'?t want to live)\b/i,
  /\b(quiero\s*morir|quitarme\s*la\s*vida|hacerme\s*daño|mejor\s*muerto|ya\s*no\s*quiero\s*vivir|sin\s*esperanza|no\s*hay\s*salida)\b/i,
];
function detectCrisis(text: string): boolean {
  return CRISIS_PATTERNS.some(p => p.test(text));
}

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

function getTimeGreeting(lang: "en" | "es"): string {
  const h = new Date().getHours();
  if (lang === "es") {
    if (h >= 5  && h < 12) return "Buenos días";
    if (h >= 12 && h < 20) return "Buenas tardes";
    return "Me alegra que hayas escrito esta noche";
  }
  if (h >= 5  && h < 11) return "Good morning";
  if (h >= 11 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "It's late — I'm really glad you reached out instead of sitting with this alone tonight";
}

function mapPronoun(raw: string | null) {
  const p = (raw || "").toLowerCase();
  if (p.includes("he/him") || p.startsWith("he"))  return { subj: "he",   obj: "him",  poss: "his",   verb: "is"  };
  if (p.includes("she/her") || p.startsWith("she")) return { subj: "she",  obj: "her",  poss: "her",   verb: "is"  };
  return                                              { subj: "they", obj: "them", poss: "their", verb: "are" };
}

function buildOpeningMessage(ctx: any, lang: "en" | "es"): string {
  const greeting = getTimeGreeting(lang);
  const name = ctx?.name as string | null;
  const nameStr = name ? `, ${name}` : "";
  if (lang === "es") {
    return `${greeting}${nameStr}. Me alegra mucho que estés aquí. Recibir un diagnóstico de VIH puede sentirse como si el suelo se moviera bajo tus pies — y lo que sientes ahora mismo, sea miedo, confusión, enojo o incluso entumecimiento, tiene todo el sentido. No estás solo/a en esto, y va a estar bien. Lo digo en serio. Tómate el tiempo que necesites. Cuando estés listo/a para hablar — de lo que sea — aquí estoy.`;
  }
  return `${greeting}${nameStr}. I'm really glad you're here. Being diagnosed with HIV can feel like the ground just shifted beneath you — and whatever you are feeling right now, whether that's fear, confusion, anger, or even numbness, all of it makes complete sense. You are not alone in this, and you are going to be okay. I mean that. Take all the time you need. When you're ready to talk — about anything at all — I'm right here with you.`;
}

// ── Web Audio ambient tones ──────────────────────────────────────────────────
function createAmbientNodes(ctx: AudioContext, type: string, masterGain: GainNode): AudioNode[] {
  const nodes: AudioNode[] = [];
  if (type === "rain" || type === "forest" || type === "wind") {
    const bufSize = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = type === "wind" ? 200 : type === "forest" ? 600 : 400;
    src.connect(filter);
    filter.connect(masterGain);
    src.start();
    nodes.push(src, filter);
  } else if (type === "ocean") {
    const bufSize = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 300;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.4;
    lfo.connect(lfoGain);
    src.connect(filter);
    filter.connect(masterGain);
    lfo.start();
    src.start();
    nodes.push(src, filter, lfo, lfoGain);
  } else if (type === "healing") {
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 528;
    const g1 = ctx.createGain();
    g1.gain.value = 0.6;
    osc1.connect(g1);
    g1.connect(masterGain);
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.value = 264;
    const g2 = ctx.createGain();
    g2.gain.value = 0.25;
    osc2.connect(g2);
    g2.connect(masterGain);
    osc1.start();
    osc2.start();
    nodes.push(osc1, g1, osc2, g2);
  }
  return nodes;
}


type Message = { role: "assistant" | "user"; content: string };
type BreathPhase = "in" | "hold" | "out" | "done";
const BREATH_ROUNDS = 3;

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "I'm here with you. Take all the time you need." },
  ]);
  const [input, setInput] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [chips, setChips] = useState<string[]>(["I feel scared", "I feel overwhelmed", "I feel numb", "I'm not sure what to say"]);
  const [sending, setSending] = useState(false);
  const [state, setState] = useState({ mode: "companion" as "companion" | "guide", topic: "start", stage: "start:v1" });

  const [companionName, setCompanionName] = useState(() => FALLBACK_NAMES[Math.floor(Math.random() * FALLBACK_NAMES.length)]);
  const [companionEmoji, setCompanionEmoji] = useState("🌱");
  const [userEmoji, setUserEmoji] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [onboardingContext, setOnboardingContext] = useState<string>("");
  const [openingCtx, setOpeningCtx] = useState<any>(null);

  // Language — reactive
  const [language, setLanguageState] = useState<"en" | "es">("en");

  // UI state
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [showBreathing, setShowBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState<BreathPhase>("in");
  const [breathCount, setBreathCount] = useState(4);
  const [breathRound, setBreathRound] = useState(1);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState<typeof GLOSSARY[number] | null>(null);
  const [providerCity, setProviderCity] = useState("");
  const [providerCategory, setProviderCategory] = useState("");
  const [mobileSheet, setMobileSheet] = useState<"calm" | "relax" | "terms" | "provider" | null>(null);

  // Crisis pulse
  const [crisisDetected, setCrisisDetected] = useState(false);

  // Music
  const [musicTrack, setMusicTrack] = useState(0);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.35);

  // Refs
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

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending, chips]);
  useEffect(() => { const t = setInterval(() => setAffirmationIdx(i => (i + 1) % AFFIRMATIONS.length), 8000); return () => clearInterval(t); }, []);
  useEffect(() => { const allP = PLACEHOLDERS[language]; const t = setInterval(() => setPlaceholderIdx(i => (i + 1) % allP.length), 6000); return () => clearInterval(t); }, [language]);


  // ── Reactive opening message when language changes ───────────────────────
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === "assistant") {
        const content = openingCtx
          ? buildOpeningMessage(openingCtx, language)
          : WELCOME_BUBBLE[language];
        return [{ role: "assistant", content }];
      }
      return prev;
    });
  }, [language, openingCtx]);

  // ── Crisis pulse: activate when last user message contains crisis language ──
  useEffect(() => {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (lastUser && detectCrisis(lastUser.content)) {
      setCrisisDetected(true);
    }
  }, [messages]);

  // ── Google Places Autocomplete ─────────────────────────────────────────────
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
    if (!key) return;
    if ((window as any).google?.maps?.places) {
      initPlaces();
      return;
    }
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

  // Re-init autocomplete for mobile sheet provider input when it opens
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

  // ── Load onboarding context ───────────────────────────────────────────────
  useEffect(() => {
    const savedLang = localStorage.getItem("companion_language") as "en" | "es" | null;
    if (savedLang) { setLanguageState(savedLang); }

    const raw = localStorage.getItem("companion_context");
    if (raw) {
      try {
        const ctx = JSON.parse(raw);
        if (ctx.companion?.name) setCompanionName(ctx.companion.name);
        if (ctx.companion?.avatar?.emoji) setCompanionEmoji(ctx.companion.avatar.emoji);
        if (ctx.userAvatar?.emoji) setUserEmoji(ctx.userAvatar.emoji);
        if (ctx.name) setUserName(ctx.name);

        const lang = (localStorage.getItem("companion_language") as "en" | "es") || "en";
        setOpeningCtx(ctx);
        setMessages([{ role: "assistant", content: buildOpeningMessage(ctx, lang) }]);

        const { subj, obj, poss } = mapPronoun(ctx.pronoun);
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
  }, []);

  // ── Language ──────────────────────────────────────────────────────────────
  const setLanguage = (l: "en" | "es") => {
    setLanguageState(l);
    localStorage.setItem("companion_language", l);
  };

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

  const playAmbient = (idx: number, vol: number) => {
    stopAmbient();
    if (!audioCtxRef.current || audioCtxRef.current.state === "closed") audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const gain = ctx.createGain();
    gain.gain.value = vol;
    gain.connect(ctx.destination);
    masterGainRef.current = gain;
    const nodes = createAmbientNodes(ctx, AMBIENT_TRACKS[idx].type, gain);
    ambientNodesRef.current = [gain, ...nodes];
  };

  const toggleMusic = () => {
    if (musicPlaying) { stopAmbient(); setMusicPlaying(false); }
    else { playAmbient(musicTrack, musicVolume); setMusicPlaying(true); }
  };

  const nextMusicTrack = () => {
    const next = (musicTrack + 1) % AMBIENT_TRACKS.length;
    setMusicTrack(next);
    if (musicPlaying) playAmbient(next, musicVolume);
  };

  const handleMusicVolume = (v: number) => {
    setMusicVolume(v);
    if (masterGainRef.current) masterGainRef.current.gain.value = v;
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
        body: JSON.stringify({ messages: nextMessages, state, onboarding: onboardingContext, language }),
      });
      const data = await res.json();
      const elapsed = Date.now() - start;
      if (elapsed < 800) await new Promise(r => setTimeout(r, 800 - elapsed));

      const reply = typeof data?.reply === "string" ? data.reply : "I'm here with you. What feels most important right now?";
      const nextChips: string[] = Array.isArray(data?.suggestions) ? data.suggestions.map((s: unknown) => String(s)).slice(0, 6) : [];

      if (data?.state) setState(data.state);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
      setChips(nextChips);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "I'm having trouble connecting right now. Please try again in a moment." }]);
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
  const currentPlaceholders = PLACEHOLDERS[language];

  return (
    <div className={styles.chatRoot} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column" }}>
      <div className={clsx(styles.orb, styles.orb1)} />
      <div className={clsx(styles.orb, styles.orb2)} />

      {/* ── Breathing overlay ── */}
      {showBreathing && (
        <div className={styles.breathOverlay}>
          {breathPhase === "done" ? (
            <div className={styles.breathDoneWrap}>
              <div className={styles.breathDoneText}>{language === "es" ? "Muy bien. Tómate un momento para notar cómo te sientes." : "Well done. Take a moment to notice how you feel."}</div>
              <button className={styles.breathDoneBtn} onClick={() => setShowBreathing(false)}>{language === "es" ? "Volver al chat" : "Return to chat"}</button>
            </div>
          ) : (
            <>
              <div className={styles.breathLabel}>{breathLabel}</div>
              <div className={clsx(styles.breathCircle, breathCircleClass)} />
              <div className={styles.breathCounter}>{breathCount}</div>
              <div className={styles.breathRoundText}>Round {Math.min(breathRound, BREATH_ROUNDS)} of {BREATH_ROUNDS}</div>
              <button className={styles.breathCloseBtn} onClick={() => setShowBreathing(false)}>
                {language === "es" ? "Detener ejercicio" : "Stop exercise"}
              </button>
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
            <button className={styles.glossaryModalClose} onClick={(e) => { e.stopPropagation(); setGlossaryTerm(null); }}>{language === "es" ? "Cerrar" : "Got it"}</button>
          </div>
        </div>
      )}

      {/* ── Theme picker overlay ── */}
      {showThemePicker && (
        <div className={styles.themeOverlay} onClick={() => setShowThemePicker(false)}>
          <div className={styles.themePanel} onClick={e => e.stopPropagation()}>
            <div className={styles.themePanelTitle}>{language === "es" ? "Elige tu espacio" : "Choose your space"}</div>
            <div className={styles.themePanelGrid}>
              {THEMES.map(t => (
                <button key={t.id} className={styles.themePanelSwatch} onClick={() => applyTheme(t.id)}>
                  <div className={styles.themePanelBg} style={{ background: t.bg }} />
                  <span className={styles.themePanelLabel}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Full-width header ── */}
      <div className={styles.chatHeader} style={{ flexShrink: 0, height: 56 }}>
        <div className={styles.headerAvatar}>{companionEmoji}</div>
        <div className={styles.headerInfo}>
          <div className={styles.headerName}>{companionName}</div>
        </div>

        <button className={styles.headerIconBtn} onClick={() => setShowThemePicker(v => !v)} title="Change theme">🎨</button>

        <div className={styles.langToggleHeader}>
          <button className={clsx(styles.langBtnHeader, language === "en" && styles.langBtnHeaderActive)} onClick={() => setLanguage("en")}>EN</button>
          <span className={styles.langDividerHeader}>|</span>
          <button className={clsx(styles.langBtnHeader, language === "es" && styles.langBtnHeaderActive)} onClick={() => setLanguage("es")}>ES</button>
        </div>

        {userEmoji && <div className={styles.headerUserAvatar}>{userEmoji}</div>}
      </div>

      {/* ── Body ── */}
      <div className={styles.chatBody} style={{ flex: 1, overflow: "hidden" }}>

        {/* ── Chat panel ── */}
        <div className={styles.chatPanel}>
          <div className={styles.affirmationBar}>
            <span key={affirmationIdx} className={styles.affirmationText}>{AFFIRMATIONS[affirmationIdx]}</span>
          </div>

          <div className={styles.messages}>
            <div className={styles.dateDivider}>
              <div className={styles.dateLine} />
              <div className={styles.dateText}>{language === "es" ? "Hoy" : "Today"}</div>
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
                          {isUser ? (userName || (language === "es" ? "Tú" : "You")) : companionName}
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
              <span>🧘</span><span className={styles.mobileWellnessIconLbl}>{language === "es" ? "Calma" : "Calm"}</span>
            </button>
            <button className={styles.mobileWellnessIconBtn} onClick={() => setMobileSheet("relax")}>
              <span>🌿</span><span className={styles.mobileWellnessIconLbl}>{language === "es" ? "Momento" : "Relax"}</span>
            </button>
            <button className={styles.mobileWellnessIconBtn} onClick={() => setMobileSheet("terms")}>
              <span>📖</span><span className={styles.mobileWellnessIconLbl}>{language === "es" ? "Términos" : "HIV Terms"}</span>
            </button>
            <button className={styles.mobileWellnessIconBtn} onClick={() => setMobileSheet("provider")}>
              <span>📍</span><span className={styles.mobileWellnessIconLbl}>{language === "es" ? "Proveedor" : "Provider"}</span>
            </button>
          </div>

          {/* Input bar */}
          <div className={styles.inputArea} style={{ flexShrink: 0 }}>
            <div className={styles.inputRow}>
              <div className={styles.inputWrap}>
                <textarea
                  ref={textareaRef}
                  className={styles.chatInput}
                  placeholder={currentPlaceholders[placeholderIdx]}
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
              <div className={styles.inputHintPrivacy}>🔒 {language === "es" ? "Esta conversación es privada y confidencial" : "This conversation is private and confidential"}</div>
              <div className={styles.inputFooterDivider} />
              <div className={styles.inputHintCopyright}>© 2025 FirstYear Companion. All rights reserved. Not a clinical tool.</div>
            </div>
          </div>
        </div>

        {/* ── Wellness sidebar ── */}
        <div className={styles.wellnessSidebar}>
          <div className={styles.sidebarCardRow}>
            <div className={styles.sidebarCard}>
              <div className={styles.sidebarCardTitle}>🧘 {language === "es" ? "Encuentra tu calma" : "Find your calm"}</div>
              <div className={styles.sidebarBtnGroup}>
                <button className={styles.sidebarBtn} onClick={startBreathing} disabled={sending}>{language === "es" ? "Ejercicio de respiración" : "Breathing Exercise"}</button>
                <button className={styles.sidebarBtn} onClick={() => triggerSend("Can you guide me through a 4-7-8 breathing exercise?")} disabled={sending}>{language === "es" ? "Respiración 4-7-8" : "4-7-8 Breathing"}</button>
                <button className={styles.sidebarBtn} onClick={() => triggerSend("Can you guide me through a body scan exercise?")} disabled={sending}>{language === "es" ? "Escaneo corporal" : "Body Scan"}</button>
                <button className={styles.sidebarBtn} onClick={() => triggerSend("Can you guide me through a 5 senses grounding exercise?")} disabled={sending}>{language === "es" ? "Los 5 sentidos" : "5 Senses Grounding"}</button>
                <button className={styles.sidebarBtn} onClick={() => triggerSend("Can you guide me through a safe place visualization?")} disabled={sending}>{language === "es" ? "Lugar seguro" : "Safe Place"}</button>
                <button className={styles.sidebarBtn} onClick={() => triggerSend("Can you guide me through a gratitude practice?")} disabled={sending}>{language === "es" ? "Gratitud" : "Gratitude Practice"}</button>
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <div className={styles.sidebarCardTitle}>🌿 {language === "es" ? "Un momento para ti" : "Give yourself a moment"}</div>
              <div className={styles.sidebarBtnGroup}>
                <button className={styles.sidebarBtn} onClick={() => triggerSend("Can you share some affirmations for today?")} disabled={sending}>{language === "es" ? "Afirmaciones de hoy" : "Affirmations for today"}</button>
                <button className={styles.sidebarBtn} onClick={() => triggerSend("I need to be reminded that I'm not alone in this.")} disabled={sending}>{language === "es" ? "No estoy solo/a" : "You are not alone"}</button>
                <button className={styles.sidebarBtn} onClick={() => triggerSend("What have others felt after their HIV diagnosis?")} disabled={sending}>{language === "es" ? "Lo que otros sienten" : "What others have felt"}</button>
              </div>
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarCardTitle}>📖 {language === "es" ? "Diccionario VIH" : "HIV Dictionary"}</div>
            <div className={styles.glossaryList}>
              {GLOSSARY.map(g => (
                <button key={g.term} className={styles.glossaryTerm} onClick={() => setGlossaryTerm(g)}>
                  <span>{g.term}</span><span className={styles.glossaryTermArrow}>›</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarCardTitle}>📍 {language === "es" ? "Encontrar un proveedor" : "Find a Provider"}</div>
            <p style={{ fontSize: 11, color: "rgba(245,237,224,.45)", marginBottom: 10, lineHeight: 1.5 }}>
              {language === "es" ? "Selecciona una categoría" : "Select a category first"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 10 }}>
              {PROVIDER_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setProviderCategory(cat.id)}
                  style={{
                    background: providerCategory === cat.id ? "rgba(74,124,111,0.2)" : "rgba(255,248,235,0.04)",
                    border: `1px solid ${providerCategory === cat.id ? "rgba(74,124,111,0.6)" : "rgba(255,248,235,0.1)"}`,
                    borderRadius: 10, padding: "9px 8px",
                    color: providerCategory === cat.id ? "#8ecfbe" : "rgba(245,237,224,0.6)",
                    fontSize: 11, fontWeight: 500,
                    cursor: "pointer", textAlign: "center",
                    fontFamily: "DM Sans, sans-serif",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    transition: "all 0.15s ease",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{cat.icon}</span>
                  <span style={{ lineHeight: 1.3 }}>{cat.label}</span>
                </button>
              ))}
            </div>
            {providerCategory && (() => {
              const cat = PROVIDER_CATEGORIES.find(c => c.id === providerCategory)!;
              const doSearch = () => {
                if (!providerCity.trim()) return;
                triggerSend(`Can you help me find ${cat.prompt} near ${providerCity.trim()}?`);
                setProviderCity("");
              };
              return (
                <div className={styles.providerSearchRow}>
                  <input
                    ref={providerInputRef}
                    className={styles.providerInput}
                    placeholder={language === "es" ? "Ciudad o código postal..." : "City or zip code..."}
                    value={providerCity}
                    onChange={e => setProviderCity(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") doSearch(); }}
                  />
                  <button
                    className={styles.providerSearchBtn}
                    disabled={sending || !providerCity.trim()}
                    onClick={doSearch}
                  >
                    {language === "es" ? "Buscar" : "Search"}
                  </button>
                </div>
              );
            })()}
          </div>

          <div className={styles.sidebarCard}>
            <div className={styles.sidebarCardTitle}>🎵 {language === "es" ? "Música tranquila" : "Calming music"}</div>
            <div className={styles.musicPlayer}>
              <div className={styles.musicTrackName}>{AMBIENT_TRACKS[musicTrack].name}</div>
              <div className={styles.musicControls}>
                <button className={styles.musicBtn} onClick={toggleMusic}>{musicPlaying ? "⏸" : "▶"}</button>
                <button className={styles.musicBtn} onClick={nextMusicTrack}>⏭</button>
              </div>
              <div className={styles.musicVolumeRow}>
                <span className={styles.musicVolumeIcon}>🔈</span>
                <input type="range" min={0} max={1} step={0.01} value={musicVolume} onChange={e => handleMusicVolume(Number(e.target.value))} className={styles.musicVolume} />
                <span className={styles.musicVolumeIcon}>🔊</span>
              </div>
              <p className={styles.musicNote}>{language === "es" ? "Tonos ambientales generados en el dispositivo" : "Device-generated ambient tones — no download needed"}</p>
            </div>
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
                <div className={styles.mobileSheetTitle}>🧘 {language === "es" ? "Encuentra tu calma" : "Find your calm"}</div>
                <div className={styles.mobileSheetBtnGroup}>
                  <button className={styles.sidebarBtn} disabled={sending} onClick={() => { startBreathing(); setMobileSheet(null); }}>{language === "es" ? "Ejercicio de respiración" : "Breathing Exercise"}</button>
                  <button className={styles.sidebarBtn} disabled={sending} onClick={() => { triggerSend("Can you guide me through a 4-7-8 breathing exercise?"); setMobileSheet(null); }}>{language === "es" ? "Respiración 4-7-8" : "4-7-8 Breathing"}</button>
                  <button className={styles.sidebarBtn} disabled={sending} onClick={() => { triggerSend("Can you guide me through a body scan exercise?"); setMobileSheet(null); }}>{language === "es" ? "Escaneo corporal" : "Body Scan"}</button>
                  <button className={styles.sidebarBtn} disabled={sending} onClick={() => { triggerSend("Can you guide me through a 5 senses grounding exercise?"); setMobileSheet(null); }}>{language === "es" ? "Los 5 sentidos" : "5 Senses Grounding"}</button>
                  <button className={styles.sidebarBtn} disabled={sending} onClick={() => { triggerSend("Can you guide me through a safe place visualization?"); setMobileSheet(null); }}>{language === "es" ? "Lugar seguro" : "Safe Place"}</button>
                  <button className={styles.sidebarBtn} disabled={sending} onClick={() => { triggerSend("Can you guide me through a gratitude practice?"); setMobileSheet(null); }}>{language === "es" ? "Gratitud" : "Gratitude Practice"}</button>
                </div>
              </>
            )}

            {mobileSheet === "relax" && (
              <>
                <div className={styles.mobileSheetTitle}>🌿 {language === "es" ? "Un momento para ti" : "Give yourself a moment"}</div>
                <div className={styles.mobileSheetBtnGroup}>
                  <button className={styles.sidebarBtn} disabled={sending} onClick={() => { triggerSend("Can you share some affirmations for today?"); setMobileSheet(null); }}>{language === "es" ? "Afirmaciones de hoy" : "Affirmations for today"}</button>
                  <button className={styles.sidebarBtn} disabled={sending} onClick={() => { triggerSend("I need to be reminded that I'm not alone in this."); setMobileSheet(null); }}>{language === "es" ? "No estoy solo/a" : "You are not alone"}</button>
                  <button className={styles.sidebarBtn} disabled={sending} onClick={() => { triggerSend("What have others felt after their HIV diagnosis?"); setMobileSheet(null); }}>{language === "es" ? "Lo que otros sienten" : "What others have felt"}</button>
                </div>
              </>
            )}

            {mobileSheet === "terms" && (
              <>
                <div className={styles.mobileSheetTitle}>📖 {language === "es" ? "Diccionario VIH" : "HIV Dictionary"}</div>
                <div className={styles.glossaryList}>
                  {GLOSSARY.map(g => (
                    <button key={g.term} className={styles.glossaryTerm} onClick={() => { setGlossaryTerm(g); setMobileSheet(null); }}>
                      <span>{g.term}</span><span className={styles.glossaryTermArrow}>›</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {mobileSheet === "provider" && (
              <>
                <div className={styles.mobileSheetTitle}>📍 {language === "es" ? "Encontrar un proveedor" : "Find a Provider"}</div>
                <p style={{ fontSize: 12, color: "rgba(245,237,224,.45)", marginBottom: 10, lineHeight: 1.5 }}>
                  {language === "es" ? "Selecciona una categoría" : "Select a category first"}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
                  {PROVIDER_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setProviderCategory(cat.id)}
                      style={{
                        background: providerCategory === cat.id ? "rgba(74,124,111,0.2)" : "rgba(255,248,235,0.04)",
                        border: `1px solid ${providerCategory === cat.id ? "rgba(74,124,111,0.6)" : "rgba(255,248,235,0.1)"}`,
                        borderRadius: 10, padding: "9px 6px",
                        color: providerCategory === cat.id ? "#8ecfbe" : "rgba(245,237,224,0.6)",
                        fontSize: 10, fontWeight: 500,
                        cursor: "pointer", textAlign: "center",
                        fontFamily: "DM Sans, sans-serif",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{cat.icon}</span>
                      <span style={{ lineHeight: 1.3 }}>{cat.label}</span>
                    </button>
                  ))}
                </div>
                {providerCategory && (() => {
                  const cat = PROVIDER_CATEGORIES.find(c => c.id === providerCategory)!;
                  const doSearch = () => {
                    if (!providerCity.trim()) return;
                    triggerSend(`Can you help me find ${cat.prompt} near ${providerCity.trim()}?`);
                    setProviderCity("");
                    setMobileSheet(null);
                  };
                  return (
                    <div className={styles.providerSearchRow}>
                      <input
                        ref={mobileProviderInputRef}
                        className={styles.providerInput}
                        placeholder={language === "es" ? "Ciudad o código postal..." : "City or zip code..."}
                        value={providerCity}
                        onChange={e => setProviderCity(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") doSearch(); }}
                      />
                      <button
                        className={styles.providerSearchBtn}
                        disabled={sending || !providerCity.trim()}
                        onClick={doSearch}
                      >
                        {language === "es" ? "Buscar" : "Search"}
                      </button>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      )}

      <CrisisButton pulsing={crisisDetected} />
    </div>
  );
}
