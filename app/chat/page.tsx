"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import styles from "./styles/Chat.module.css";
import CrisisButton from "../components/CrisisButton";
import { getStrings, readLang, getLangFamily } from "../i18n";
import type { UserProfile } from "../profile/page";
import { PROFILE_KEY } from "../profile/page";

// ── Crisis detection ──────────────────────────────────────────────────────────
const CRISIS_PATTERNS = [
  /\b(kill\s*myself|killing\s*myself|end\s*my\s*life|take\s*my\s*(own\s*)?life|want\s*to\s*die|wish\s*i\s*were\s*dead|no\s*reason\s*to\s*(live|be\s*here)|better\s*off\s*dead|better\s*off\s*without\s*me|hurt\s*myself|self[\s-]?harm|suicidal|suicide|end\s*it\s*all|don'?t\s*want\s*to\s*(live|be\s*here)|can'?t\s*go\s*on)\b/i,
  /\b(quiero\s*morir|quiero\s*acabar\s*con\s*mi\s*vida|suicida|hacerme\s*daño|no\s*quiero\s*vivir|terminar\s*con\s*todo|quitarme\s*la\s*vida|mejor\s*muerto|ya\s*no\s*quiero\s*vivir|sin\s*esperanza|no\s*hay\s*salida|matarme)\b/i,
  /\b(quero\s*morrer|suicida|me\s*machucar|acabar\s*com\s*tudo|não\s*quero\s*viver|me\s*matar|tirar\s*minha\s*vida)\b/i,
  /\b(je\s*veux\s*mourir|suicidaire|me\s*blesser|en\s*finir|plus\s*envie\s*de\s*vivre|mettre\s*fin\s*à\s*ma\s*vie)\b/i,
  /\b(mwen\s*vle\s*mouri|touye\s*tèt\s*mwen|fini\s*ak\s*tout|pa\s*vle\s*viv)\b/i,
  /我想死|自杀|伤害自己|不想活了|结束生命|寻死/,
];
function detectCrisis(text: string) { return CRISIS_PATTERNS.some(p => p.test(text)); }

// ── Themes ────────────────────────────────────────────────────────────────────
const THEMES = [
  { id: "grounded", label: "🌲 Grounded", bg: "#1A2E1E" },
  { id: "ocean",    label: "🌊 Ocean",    bg: "#0D2233" },
  { id: "ember",    label: "🍂 Ember",    bg: "#2E1A0E" },
  { id: "midnight", label: "🌙 Midnight", bg: "#1A1A2E" },
  { id: "burgundy", label: "🍷 Burgundy", bg: "#2E0E1A" },
  { id: "walnut",   label: "🪵 Walnut",   bg: "#2E2010" },
  { id: "sage",     label: "🌿 Sage",     bg: "#1A2E26" },
  { id: "volcanic", label: "🌋 Volcanic", bg: "#2E1A1A" },
  { id: "dusk",     label: "🐚 Dusk",     bg: "#2A2035" },
] as const;


// ── Relax moments ─────────────────────────────────────────────────────────────
const RELAX_MOMENTS = [
  {
    id: "affirmation", emoji: "💙", name: "A word for you",
    content: "You are doing something incredibly brave just by being here. Living with HIV in a world that still carries so much stigma takes a kind of strength that most people will never understand. But you have it. You showed up. That matters more than you know.",
  },
  {
    id: "not-alone", emoji: "🤝", name: "You are not alone",
    content: "Right now, hundreds of thousands of people around the world are living full, rich lives with HIV — working, loving, laughing, thriving. Some of them had the same thoughts you're having today. They made it through. So will you. You are not alone in this.",
  },
  {
    id: "hope", emoji: "🌱", name: "A message of hope",
    content: "This diagnosis does not define your future. Modern HIV treatment means people diagnosed today live near-normal lifespans. Relationships. Children. Careers. Dreams. All of it is still possible. This is not the end of your story. It is a new chapter — and you are the author.",
  },
  {
    id: "breath", emoji: "🌬️", name: "Just breathe",
    content: "Just breathe for a moment.\n\nIn... and out.\nIn... and out.\nIn... and out.\n\nYou don't have to figure anything out right now. You just have to be here, in this moment. That is enough.",
  },
];


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
    return `${greeting}${nameStr}. Me alegra mucho que estés aquí. Recibir un diagnóstico de VIH puede sentirse como si el suelo se moviera bajo tus pies — y lo que sientes ahora mismo, sea miedo, confusión, enojo o incluso entumecimiento, tiene todo el sentido. No estás solo/a en esto, y va a estar bien. Tómate el tiempo que necesites. Cuando estés listo/a para hablar — de lo que sea — aquí estoy.`;
  }
  if (family !== "en") {
    return nameStr ? `${nameStr.replace(/^, /, "")}. ${welcomeBubble}` : welcomeBubble;
  }
  return `${greeting}${nameStr}. I'm really glad you're here. Being diagnosed with HIV can feel like the ground just shifted beneath you — and whatever you are feeling right now, whether that's fear, confusion, anger, or even numbness, all of it makes complete sense. You are not alone in this, and you are going to be okay. I mean that. Take all the time you need. When you're ready to talk — about anything at all — I'm right here with you.`;
}

type Message = { role: "assistant" | "user"; content: string };
type GlossaryEntry = { term: string; def: string };

const MOOD_OPTIONS = [
  { emoji: "😔", label: "Struggling" },
  { emoji: "😟", label: "Anxious" },
  { emoji: "😐", label: "Numb" },
  { emoji: "🙂", label: "Okay" },
  { emoji: "😊", label: "Good" },
  { emoji: "💪", label: "Strong" },
];

export default function ChatPage() {
  const router = useRouter();

  // ── Language / i18n ──────────────────────────────────────────────────────
  const [langCode, setLangCode] = useState("en-US");
  const t = getStrings(langCode);

  // ── Messages ─────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "I'm here with you. Take all the time you need." },
  ]);
  const [input, setInput] = useState("");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [chips, setChips] = useState<string[]>(["I feel scared", "I feel overwhelmed", "I feel numb", "I'm not sure what to say"]);
  const [sending, setSending] = useState(false);
  const [state, setState] = useState({ mode: "companion" as "companion" | "guide", topic: "start", stage: "start:v1" });

  // ── Profile ──────────────────────────────────────────────────────────────
  const [companionName] = useState("Nova");
  const [companionEmoji] = useState("🌱");
  const [userEmoji, setUserEmoji] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [onboardingContext, setOnboardingContext] = useState<string>("");
  const [profileContext, setProfileContext] = useState<string>("");
  const [showMoodCheckin, setShowMoodCheckin] = useState(false);
  const [checkinName, setCheckinName] = useState<string>("");

  // ── UI state ─────────────────────────────────────────────────────────────
  const [affirmationIdx, setAffirmationIdx] = useState(0);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [glossaryTerm, setGlossaryTerm] = useState<GlossaryEntry | null>(null);
  const [crisisDetected, setCrisisDetected] = useState(false);
  const [mobileSheet, setMobileSheet] = useState<"calm" | "relax" | "terms" | "provider" | null>(null);

  // ── Calm popup state ─────────────────────────────────────────────────────
  const [calmOpen, setCalmOpen] = useState(false);
  const [calmExId, setCalmExId] = useState<string | null>(null);
  const [calmStep, setCalmStep] = useState(0);

  // ── Relax popup state ────────────────────────────────────────────────────
  const [relaxOpen, setRelaxOpen] = useState(false);
  const [relaxMomentId, setRelaxMomentId] = useState<string | null>(null);

  // ── Dict popup state ─────────────────────────────────────────────────────
  const [dictOpen, setDictOpen] = useState(false);

  // ── Provider search popup state ───────────────────────────────────────────
  const [providerOpen, setProviderOpen] = useState(false);
  const [providerCategory, setProviderCategory] = useState<{ label: string; prompt: string } | null>(null);
  const [providerAddress, setProviderAddress] = useState("");
  const [providerResults, setProviderResults] = useState<{ name: string; address: string; phone: string; website: string; rating: number | null; placeId: string; lat: number; lng: number }[]>([]);
  const [providerSearching, setProviderSearching] = useState(false);
  const [providerError, setProviderError] = useState("");
  const [selectedPlaceCoords, setSelectedPlaceCoords] = useState<{ lat: number; lng: number } | null>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<any>(null);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const inputRef = useRef("");
  const selectedChipsRef = useRef<string[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // ── Effects ──────────────────────────────────────────────────────────────
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, sending, chips]);

  useEffect(() => {
    const affirms = t.affirmations;
    const timer = setInterval(() => setAffirmationIdx(i => (i + 1) % affirms.length), 6000);
    return () => clearInterval(timer);
  }, [t]);

  const PLACEHOLDERS = [t.welcome_bubble, ...(t.initial_chips || [])];
  useEffect(() => {
    const timer = setInterval(() => setPlaceholderIdx(i => (i + 1) % PLACEHOLDERS.length), 6000);
    return () => clearInterval(timer);
  }, [t]);

  useEffect(() => {
    const lastUser = [...messages].reverse().find(m => m.role === "user");
    if (lastUser && detectCrisis(lastUser.content)) setCrisisDetected(true);
  }, [messages]);

  // ── Load onboarding + language ────────────────────────────────────────────
  useEffect(() => {
    const savedLang = localStorage.getItem("companion_language") ?? "en-US";
    setLangCode(savedLang);

    // Try NEW onboarding format first (from Screen 2 check-in)
    const newName      = localStorage.getItem("companion_name") || "";
    const newJourney   = localStorage.getItem("companion_journey") || "";
    const newProvider  = localStorage.getItem("companion_provider") || "";
    const newMedication = localStorage.getItem("companion_medication") || "";
    const newPronouns  = localStorage.getItem("companion_pronouns") || "";
    const newMoodsRaw  = localStorage.getItem("companion_moods") || "[]";
    let newMoods: string[] = [];
    try { newMoods = JSON.parse(newMoodsRaw); } catch { newMoods = []; }

    const hasNewData = newName || newJourney || newProvider || newMedication || newPronouns || newMoods.length > 0;

    if (hasNewData) {
      const parts: string[] = [];
      parts.push(`CRITICAL: You are speaking directly to the patient. Always use "you" and "your" when addressing them directly.`);

      const pronounMap: Record<string, string> = {
        "She/Her": "she/her/hers", "Ella": "she/her/hers",
        "He/Him": "he/him/his", "Él": "he/him/his",
        "They/Them": "they/them/their",
        "Ze/Zir": "ze/zir/zirs",
      };
      if (newPronouns && !newPronouns.toLowerCase().includes("prefer")) {
        const pLabel = pronounMap[newPronouns] || newPronouns.toLowerCase();
        parts.push(`Patient pronouns (for third-person reference only, NOT for replacing "you"): ${pLabel}`);
      }
      parts.push(`Patient name: ${newName || "not provided — address warmly without a name"}`);
      if (newJourney)          parts.push(`HIV journey stage: ${newJourney}`);
      if (newProvider === "No" || newProvider.toLowerCase() === "non" || newProvider === "否")
        parts.push(`Has HIV provider: No — proactively offer to help find one once, warmly, early in the conversation.`);
      else if (newProvider)    parts.push(`Has HIV provider: ${newProvider}`);
      if (newMedication === "No" || newMedication.toLowerCase() === "non" || newMedication === "否")
        parts.push(`On HIV medication: No — naturally open the door to what starting ART actually feels like, at the right moment.`);
      else if (newMedication)  parts.push(`On HIV medication: ${newMedication}`);
      if (newMoods.length > 0) parts.push(`Starting emotions: ${newMoods.join(", ")}`);

      setOnboardingContext(parts.join("\n"));
      if (newName) setUserName(newName);

      const welcome = getStrings(savedLang).welcome_bubble;
      setMessages([{ role: "assistant", content: buildOpeningMessage({ name: newName || null, emotions: newMoods }, savedLang, welcome) }]);
      setChips(getStrings(savedLang).initial_chips);
      return;
    }

    // Legacy: try old companion_context JSON
    const raw = localStorage.getItem("companion_context");
    if (raw) {
      try {
        const ctx = JSON.parse(raw);
        if (ctx.name) setUserName(ctx.name);
        if (ctx.userAvatar?.emoji) setUserEmoji(ctx.userAvatar.emoji);

        const pronounLabel = ctx.pronoun?.toLowerCase().includes("he/him") ? "he/him/his"
          : ctx.pronoun?.toLowerCase().includes("she/her") ? "she/her/hers"
          : ctx.pronoun?.toLowerCase().includes("they/them") ? "they/them/their"
          : null;

        const parts: string[] = [];
        parts.push(`CRITICAL: You are speaking directly to the patient. Always use "you" and "your" when addressing them.`);
        if (pronounLabel) parts.push(`Patient pronouns (third-person only): ${pronounLabel}`);
        if (ctx.name)               parts.push(`User's name: ${ctx.name}`);
        if (ctx.diagnosisDate)      parts.push(`Diagnosis date: ${ctx.diagnosisDate}`);
        if (ctx.daysSinceDiagnosis !== null && ctx.daysSinceDiagnosis !== undefined) parts.push(`Days since diagnosis: ${ctx.daysSinceDiagnosis}`);
        if (ctx.diagnosisRange)     parts.push(`Diagnosis range: ${ctx.diagnosisRange}`);
        if (ctx.hasProvider === "No") parts.push(`Has HIV provider: No — proactively offer to help find one once, warmly, near the start of conversation.`);
        else if (ctx.hasProvider)   parts.push(`Has HIV provider: ${ctx.hasProvider}`);
        if (ctx.onMedication === "No") parts.push(`On HIV medication: No — naturally open the door to what starting ART feels like, at the right moment.`);
        else if (ctx.onMedication)  parts.push(`On HIV medication: ${ctx.onMedication}`);
        if (ctx.emotionalIntensity !== undefined) parts.push(`Emotional intensity at start: ${ctx.emotionalIntensity}/10`);
        if (ctx.emotions?.length)   parts.push(`Starting emotions: ${ctx.emotions.join(", ")}`);
        if (ctx.note)               parts.push(`User's opening note: "${ctx.note}"`);
        if (parts.length) setOnboardingContext(parts.join("\n"));

        const welcome = getStrings(savedLang).welcome_bubble;
        setMessages([{ role: "assistant", content: buildOpeningMessage(ctx, savedLang, welcome) }]);
        setChips(getStrings(savedLang).initial_chips);
        return;
      } catch { /* fall through */ }
    }

    // User profile
    const userProfileRaw = localStorage.getItem(PROFILE_KEY);
    if (userProfileRaw) {
      try {
        const up: UserProfile = JSON.parse(userProfileRaw);
        const profileParts: string[] = [];
        const displayName = up.preferredName?.trim() || null;
        profileParts.push(`Patient name: ${displayName ?? "not provided — address warmly without a name"}`);
        const pronounsDisplay = up.pronouns === "Other" ? (up.pronounsOther || "they/them") : (up.pronouns || "not specified");
        profileParts.push(`Patient pronouns: ${pronounsDisplay}`);
        if (up.ageRange) profileParts.push(`Age range: ${up.ageRange}`);
        if (up.country) profileParts.push(`Country or region: ${up.country}`);
        if (up.mood && up.moodEmoji) profileParts.push(`Mood today: ${up.moodEmoji} ${up.mood}`);
        if (up.topics?.length) profileParts.push(`Topics patient wants help with: ${up.topics.join(", ")}`);
        if (profileParts.length) setProfileContext(profileParts.join("\n"));

        if (up.dailyCheckIns) {
          const today = new Date().toISOString().slice(0, 10);
          if (!up.lastMoodDate || up.lastMoodDate !== today) {
            setCheckinName(displayName || "");
            setShowMoodCheckin(true);
          }
        }
      } catch { /* ignore */ }
    }

    setChips(getStrings(savedLang).initial_chips);
    setMessages([{ role: "assistant", content: getStrings(savedLang).welcome_bubble }]);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("companion_theme") ?? "grounded";
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const applyTheme = (id: string) => {
    localStorage.setItem("companion_theme", id);
    document.documentElement.setAttribute("data-theme", id);
    setShowThemePicker(false);
  };

  // ── Load Google Maps script lazily ────────────────────────────────────────
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
    if (!key || document.getElementById("gm-script")) return;
    const s = document.createElement("script");
    s.id = "gm-script";
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  // ── Attach Google Places Autocomplete when popup opens ────────────────────
  useEffect(() => {
    if (!providerOpen) {
      if (autocompleteRef.current) {
        const g = (window as any).google;
        if (g?.maps?.event) g.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
      return;
    }
    const attach = () => {
      const g = (window as any).google;
      if (!g?.maps?.places || !addressInputRef.current) return;
      const ac = new g.maps.places.Autocomplete(addressInputRef.current, { types: ["geocode"] });
      autocompleteRef.current = ac;
      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (place?.geometry?.location) {
          setProviderAddress(place.formatted_address ?? addressInputRef.current?.value ?? "");
          setSelectedPlaceCoords({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
        }
      });
    };
    // Small delay to let the popup DOM render before attaching
    const timer = setTimeout(attach, 150);
    return () => clearTimeout(timer);
  }, [providerOpen]);

  // ── Provider nearby search ────────────────────────────────────────────────
  const searchProviders = useCallback(() => {
    if (!providerAddress.trim()) return;
    const g = (window as any).google;
    if (!g?.maps) {
      setProviderError("Google Maps is not loaded. Please check your API key.");
      return;
    }
    setProviderSearching(true);
    setProviderError("");
    setProviderResults([]);

    const doSearch = (location: any) => {
      const map = new g.maps.Map(mapDivRef.current!, { center: location, zoom: 14 });
      const service = new g.maps.places.PlacesService(map);
      service.nearbySearch(
        { location, radius: 16000, keyword: providerCategory?.prompt ?? "HIV clinic infectious disease" },
        (placeResults: any[], placeStatus: string) => {
          if (placeStatus !== g.maps.places.PlacesServiceStatus.OK || !placeResults?.length) {
            setProviderSearching(false);
            setProviderError(t.provider_no_results);
            return;
          }
          const list = placeResults.slice(0, 5);
          const detailed: any[] = new Array(list.length).fill(null);
          let count = 0;
          list.forEach((p: any, idx: number) => {
            service.getDetails(
              { placeId: p.place_id, fields: ["name", "formatted_address", "formatted_phone_number", "website", "rating"] },
              (detail: any) => {
                detailed[idx] = {
                  name: detail?.name ?? p.name,
                  address: detail?.formatted_address ?? p.vicinity ?? "",
                  phone: detail?.formatted_phone_number ?? "",
                  website: detail?.website ?? "",
                  rating: detail?.rating ?? null,
                  placeId: p.place_id,
                  lat: p.geometry.location.lat(),
                  lng: p.geometry.location.lng(),
                };
                count++;
                if (count === list.length) {
                  setProviderSearching(false);
                  setProviderResults(detailed.filter(Boolean));
                }
              }
            );
          });
        }
      );
    };

    if (selectedPlaceCoords) {
      doSearch(new g.maps.LatLng(selectedPlaceCoords.lat, selectedPlaceCoords.lng));
    } else {
      const geocoder = new g.maps.Geocoder();
      geocoder.geocode({ address: providerAddress }, (results: any[], status: string) => {
        if (status !== "OK" || !results?.[0]) {
          setProviderSearching(false);
          setProviderError(t.provider_error_location);
          return;
        }
        doSearch(results[0].geometry.location);
      });
    }
  }, [providerAddress, providerCategory, selectedPlaceCoords]);

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
        body: JSON.stringify({ messages: nextMessages, state, onboarding: onboardingContext, language: langCode, profile: profileContext }),
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

  const triggerSend = useCallback((text: string) => {
    if (sending) return;
    inputRef.current = text;
    setInput(text);
    selectedChipsRef.current = [];
    setSelectedChips([]);
    setTimeout(() => sendRef.current(), 50);
  }, [sending]);

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

  // ── Calm exercise helpers ─────────────────────────────────────────────────
  const currentExercise = t.calm_exercises.find(e => e.id === calmExId);
  const totalSteps = currentExercise?.steps.length ?? 0;
  const isLastStep = calmStep >= totalSteps - 1;

  // ── Relax moment helpers ──────────────────────────────────────────────────
  const currentMoment = RELAX_MOMENTS.find(m => m.id === relaxMomentId);

  // ── Sidebar card shared style ─────────────────────────────────────────────
  const sCard: React.CSSProperties = {
    background: "color-mix(in srgb, var(--text) 2%, transparent)",
    border: "1px solid color-mix(in srgb, var(--text) 8%, transparent)",
    borderRadius: 14, padding: 13, flexShrink: 0,
  };
  const sTitle: React.CSSProperties = {
    fontSize: 13, fontWeight: 600,
    color: "color-mix(in srgb, var(--text) 88%, transparent)",
    marginBottom: 10,
    fontFamily: "'DM Sans', sans-serif",
  };
  const sBtn = (disabled?: boolean): React.CSSProperties => ({
    width: "100%",
    background: "color-mix(in srgb, var(--text) 5%, transparent)",
    border: "1px solid color-mix(in srgb, var(--text) 10%, transparent)",
    borderRadius: 9, padding: "9px 11px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 12, fontWeight: 500, color: "var(--text)",
    cursor: disabled ? "not-allowed" : "pointer",
    textAlign: "left" as const,
    transition: "all 0.18s ease",
    opacity: disabled ? 0.4 : 1,
    marginBottom: 5,
  });

  // ── Popup overlay shared style ────────────────────────────────────────────
  const overlayStyle: React.CSSProperties = {
    position: "fixed", inset: 0, zIndex: 300,
    background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20,
  };
  const popupStyle: React.CSSProperties = {
    background: "var(--bg)",
    border: "1px solid color-mix(in srgb, var(--text) 12%, transparent)",
    borderRadius: 20, padding: "24px",
    maxWidth: 480, width: "100%",
    maxHeight: "80vh", overflowY: "auto",
  };

  return (
    <div className={styles.chatRoot} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, display: "flex", flexDirection: "column" }}>
      <div className={clsx(styles.orb, styles.orb1)} />
      <div className={clsx(styles.orb, styles.orb2)} />

      {/* ── Glossary modal ── */}
      {glossaryTerm && (
        <div className={styles.glossaryOverlay} onClick={() => setGlossaryTerm(null)}>
          <div className={styles.glossaryModal} onClick={e => e.stopPropagation()}>
            <div className={styles.glossaryModalTerm}>{glossaryTerm.term}</div>
            <div className={styles.glossaryModalDef}>{glossaryTerm.def}</div>
            <button className={styles.glossaryModalClose} onClick={() => setGlossaryTerm(null)}>{t.got_it}</button>
          </div>
        </div>
      )}

      {/* ── Theme picker ── */}
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

      {/* ── Daily mood check-in ── */}
      {showMoodCheckin && (
        <div style={{ position: "fixed", inset: 0, zIndex: 600, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: "var(--bg)", border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)", borderRadius: 24, padding: "28px 24px", maxWidth: 360, width: "100%" }}>
            <div style={{ fontFamily: "'Lora', serif", fontSize: 19, fontWeight: 500, color: "var(--text)", marginBottom: 6, lineHeight: 1.35 }}>
              How are you feeling today{checkinName ? `, ${checkinName}` : ""}?
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "color-mix(in srgb, var(--text) 50%, transparent)", marginBottom: 20, lineHeight: 1.6 }}>
              Take a moment to check in with yourself.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
              {MOOD_OPTIONS.map(m => (
                <button key={m.label} onClick={() => {
                  const raw = localStorage.getItem(PROFILE_KEY);
                  const today = new Date().toISOString().slice(0, 10);
                  const existing = raw ? (() => { try { return JSON.parse(raw); } catch { return {}; } })() : {};
                  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...existing, mood: m.label, moodEmoji: m.emoji, lastMoodDate: today }));
                  setProfileContext(prev => {
                    const lines = prev.split("\n").filter(l => !l.startsWith("Mood today:"));
                    return [...lines, `Mood today: ${m.emoji} ${m.label}`].join("\n");
                  });
                  setShowMoodCheckin(false);
                }} style={{ background: "color-mix(in srgb, var(--text) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--text) 10%, transparent)", borderRadius: 12, padding: "12px 6px", display: "flex", flexDirection: "column", alignItems: "center", gap: 5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s ease" }}>
                  <span style={{ fontSize: 22 }}>{m.emoji}</span>
                  <span style={{ fontSize: 11, color: "color-mix(in srgb, var(--text) 60%, transparent)", fontWeight: 500 }}>{m.label}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowMoodCheckin(false)} style={{ width: "100%", background: "transparent", border: "none", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "color-mix(in srgb, var(--text) 30%, transparent)", cursor: "pointer", padding: "6px 0" }}>
              Skip for now
            </button>
          </div>
        </div>
      )}

      {/* ── Calm popup ── */}
      {calmOpen && (
        <div style={overlayStyle} onClick={() => { setCalmOpen(false); setCalmExId(null); setCalmStep(0); }}>
          <div style={popupStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: "var(--text)" }}>
                {calmExId ? `${currentExercise?.emoji} ${currentExercise?.name}` : `🧘 ${t.calm_title}`}
              </div>
              <button onClick={() => { setCalmOpen(false); setCalmExId(null); setCalmStep(0); }} style={{ background: "transparent", border: "none", fontSize: 20, color: "color-mix(in srgb, var(--text) 50%, transparent)", cursor: "pointer", padding: "4px 8px" }}>×</button>
            </div>

            {!calmExId ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {t.calm_exercises.map(ex => (
                  <button key={ex.id} onClick={() => { setCalmExId(ex.id); setCalmStep(0); }}
                    style={{ background: "color-mix(in srgb, var(--text) 4%, transparent)", border: "1px solid color-mix(in srgb, var(--text) 10%, transparent)", borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s ease" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{ex.emoji} {ex.name}</div>
                    <div style={{ fontSize: 12, color: "color-mix(in srgb, var(--text) 50%, transparent)" }}>{ex.desc}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ background: "color-mix(in srgb, var(--text) 4%, transparent)", border: "1px solid color-mix(in srgb, var(--text) 8%, transparent)", borderRadius: 14, padding: "20px 22px", marginBottom: 20, minHeight: 80 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, color: "var(--text)", lineHeight: 1.75, margin: 0 }}>
                    {currentExercise?.steps[calmStep]}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "color-mix(in srgb, var(--text) 35%, transparent)" }}>
                    {t.calm_step_of(calmStep + 1, totalSteps)}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => { setCalmExId(null); setCalmStep(0); }} style={{ background: "transparent", border: "1px solid color-mix(in srgb, var(--text) 15%, transparent)", borderRadius: 10, padding: "9px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "color-mix(in srgb, var(--text) 55%, transparent)", cursor: "pointer" }}>{t.calm_back}</button>
                    {!isLastStep ? (
                      <button onClick={() => setCalmStep(s => s + 1)} style={{ background: "rgba(74,124,111,0.2)", border: "1px solid rgba(74,124,111,0.45)", borderRadius: 10, padding: "9px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#8ecfbe", cursor: "pointer" }}>{t.calm_next}</button>
                    ) : (
                      <button onClick={() => { setCalmOpen(false); setCalmExId(null); setCalmStep(0); }} style={{ background: "rgba(74,124,111,0.2)", border: "1px solid rgba(74,124,111,0.45)", borderRadius: 10, padding: "9px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#8ecfbe", cursor: "pointer" }}>{t.calm_done}</button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Relax popup ── */}
      {relaxOpen && (
        <div style={overlayStyle} onClick={() => { setRelaxOpen(false); setRelaxMomentId(null); }}>
          <div style={popupStyle} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: "var(--text)" }}>
                {relaxMomentId ? `${currentMoment?.emoji} ${currentMoment?.name}` : "🌿 Give yourself a moment"}
              </div>
              <button onClick={() => { setRelaxOpen(false); setRelaxMomentId(null); }} style={{ background: "transparent", border: "none", fontSize: 20, color: "color-mix(in srgb, var(--text) 50%, transparent)", cursor: "pointer", padding: "4px 8px" }}>×</button>
            </div>

            {!relaxMomentId ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {RELAX_MOMENTS.map(m => (
                  <button key={m.id} onClick={() => setRelaxMomentId(m.id)}
                    style={{ background: "color-mix(in srgb, var(--text) 4%, transparent)", border: "1px solid color-mix(in srgb, var(--text) 10%, transparent)", borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s ease" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{m.emoji} {m.name}</div>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div style={{ background: "color-mix(in srgb, var(--text) 4%, transparent)", border: "1px solid color-mix(in srgb, var(--text) 8%, transparent)", borderRadius: 14, padding: "22px 24px", marginBottom: 20 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--text)", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line" }}>
                    {currentMoment?.content}
                  </p>
                </div>
                <button onClick={() => setRelaxMomentId(null)} style={{ background: "transparent", border: "1px solid color-mix(in srgb, var(--text) 15%, transparent)", borderRadius: 10, padding: "9px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "color-mix(in srgb, var(--text) 55%, transparent)", cursor: "pointer" }}>← Back</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── HIV Dictionary popup ── */}
      {dictOpen && !glossaryTerm && (
        <div style={overlayStyle} onClick={() => setDictOpen(false)}>
          <div style={{ ...popupStyle, maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: "var(--text)" }}>📖 {t.sidebar_dict_title}</div>
              <button onClick={() => setDictOpen(false)} style={{ background: "transparent", border: "none", fontSize: 20, color: "color-mix(in srgb, var(--text) 50%, transparent)", cursor: "pointer", padding: "4px 8px" }}>×</button>
            </div>
            <div className={styles.glossaryList}>
              {t.glossary.map(g => (
                <button key={g.term} className={styles.glossaryTerm} onClick={() => { setGlossaryTerm(g); setDictOpen(false); }}>
                  <span>{g.term}</span><span className={styles.glossaryTermArrow}>›</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Provider search popup ── */}
      {providerOpen && (
        <div style={overlayStyle} onClick={() => setProviderOpen(false)}>
          <div style={{ ...popupStyle, maxWidth: 560 }} onClick={e => e.stopPropagation()}>
            {/* Hidden map div for PlacesService */}
            <div ref={mapDivRef} style={{ display: "none", width: 1, height: 1 }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 500, color: "var(--text)" }}>
                📍 {providerCategory?.label ?? "Find a Provider"}
              </div>
              <button onClick={() => setProviderOpen(false)} style={{ background: "transparent", border: "none", fontSize: 20, color: "color-mix(in srgb, var(--text) 50%, transparent)", cursor: "pointer", padding: "4px 8px" }}>×</button>
            </div>

            {/* Search input */}
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "color-mix(in srgb, var(--text) 50%, transparent)", marginBottom: 12, lineHeight: 1.5 }}>
              {t.provider_address_subtitle}
            </p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <input
                ref={addressInputRef}
                type="text"
                value={providerAddress}
                onChange={e => { setProviderAddress(e.target.value); setSelectedPlaceCoords(null); }}
                onKeyDown={e => { if (e.key === "Enter") searchProviders(); }}
                placeholder={t.provider_address_ph}
                style={{
                  flex: 1, background: "color-mix(in srgb, var(--text) 5%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--text) 12%, transparent)",
                  borderRadius: 10, padding: "11px 14px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14,
                  color: "var(--text)", outline: "none",
                }}
              />
              <button
                onClick={searchProviders}
                disabled={providerSearching || !providerAddress.trim()}
                style={{
                  background: "linear-gradient(135deg, #c4956a 0%, #a87a52 100%)",
                  border: "none", borderRadius: 10, padding: "11px 18px",
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
                  color: "#fff", cursor: providerSearching ? "not-allowed" : "pointer",
                  opacity: providerSearching || !providerAddress.trim() ? 0.6 : 1,
                  flexShrink: 0,
                }}
              >
                {providerSearching ? "..." : t.provider_search_btn}
              </button>
            </div>

            {/* Error */}
            {providerError && (
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#e07070", marginBottom: 12, lineHeight: 1.5 }}>
                {providerError}
              </div>
            )}

            {/* Results */}
            {providerResults.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {providerResults.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      background: "color-mix(in srgb, var(--text) 4%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--text) 9%, transparent)",
                      borderRadius: 12, padding: "14px 16px",
                    }}
                  >
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>
                      {r.name}
                      {r.rating !== null && (
                        <span style={{ fontSize: 11, fontWeight: 400, color: "#c4956a", marginLeft: 8 }}>⭐ {r.rating.toFixed(1)}</span>
                      )}
                    </div>
                    {r.address && (
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "color-mix(in srgb, var(--text) 55%, transparent)", marginBottom: 6 }}>
                        📍 {r.address}
                      </div>
                    )}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                      {r.phone && (
                        <a href={`tel:${r.phone.replace(/\D/g, "")}`} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(142,207,190,0.85)", textDecoration: "none" }}>
                          {t.provider_phone_label} {r.phone}
                        </a>
                      )}
                      {r.website && (
                        <a href={r.website} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(142,207,190,0.85)", textDecoration: "none" }}>
                          {t.provider_website_label}
                        </a>
                      )}
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.name + " " + r.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(142,207,190,0.85)", textDecoration: "none" }}
                      >
                        {t.provider_directions} →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No API key notice */}
            {!process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY && (
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "color-mix(in srgb, var(--text) 45%, transparent)", lineHeight: 1.6 }}>
                Provider search requires a Google Places API key (NEXT_PUBLIC_GOOGLE_PLACES_KEY). Once configured, enter your location to find nearby providers.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div className={styles.chatHeader} style={{ flexShrink: 0, height: 56 }}>
        <div className={styles.headerAvatar}>{companionEmoji}</div>
        <div className={styles.headerInfo}>
          <div className={styles.headerName}>{companionName}</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "color-mix(in srgb, var(--text) 45%, transparent)", letterSpacing: "0.02em" }}>
            {t.avatar_your_companion}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "color-mix(in srgb, var(--text) 40%, transparent)", letterSpacing: "0.03em", marginRight: 8 }}>
          🔒 Private and confidential
        </div>
        <button className={styles.headerIconBtn} onClick={() => setShowThemePicker(v => !v)} title="Change theme">🎨</button>
        <button className={styles.headerIconBtn} onClick={() => router.push("/profile")} title="My profile" style={{ fontSize: 19 }}>👤</button>
        {userEmoji && <div className={styles.headerUserAvatar}>{userEmoji}</div>}
      </div>

      {/* ── Body ── */}
      <div className={styles.chatBody} style={{ flex: 1, overflow: "hidden" }}>

        {/* ── Chat panel ── */}
        <div className={styles.chatPanel}>
          {/* Affirmation bar */}
          <div className={styles.affirmationBar}>
            <span key={affirmationIdx} className={styles.affirmationText} style={{ fontFamily: "'Lora', serif" }}>
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

          {/* Card 1: Quick Support */}
          <div style={sCard}>
            <div style={sTitle}>{t.sidebar_quick_support}</div>
            <button style={sBtn()} onClick={() => setCalmOpen(true)}>{t.sidebar_calm_title}</button>
            <button style={sBtn()} onClick={() => setRelaxOpen(true)}>{t.sidebar_relax_title}</button>
            <button style={sBtn()} onClick={() => setDictOpen(true)}>{t.sidebar_dict_title}</button>
          </div>

          {/* Card 2: Real World Help */}
          <div style={sCard}>
            <div style={sTitle}>{t.sidebar_real_world}</div>
            {t.provider_cats.map(cat => (
              <button key={cat.label} style={sBtn()} onClick={() => {
                setProviderCategory({ label: cat.label, prompt: cat.prompt });
                setProviderOpen(true);
                setProviderResults([]);
                setProviderAddress("");
                setSelectedPlaceCoords(null);
              }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Card 3: Personalize Later */}
          <div style={{ ...sCard, background: "rgba(74,124,111,0.06)", border: "1px solid rgba(74,124,111,0.18)" }}>
            <div style={{ ...sTitle, color: "rgba(142,207,190,0.85)" }}>{t.sidebar_personalize}</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "color-mix(in srgb, var(--text) 50%, transparent)", lineHeight: 1.65, margin: 0 }}>
              {t.sidebar_personalize_body}
            </p>
            <button onClick={() => router.push("/profile")} style={{ marginTop: 12, background: "rgba(74,124,111,0.12)", border: "1px solid rgba(74,124,111,0.3)", borderRadius: 9, padding: "7px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "#8ecfbe", cursor: "pointer", width: "100%" }}>
              {t.sidebar_go_profile}
            </button>
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
                <div className={styles.mobileSheetTitle}>{t.sidebar_quick_support}</div>
                <div className={styles.mobileSheetBtnGroup}>
                  <button className={styles.sidebarBtn} onClick={() => { setMobileSheet(null); setCalmOpen(true); }}>{t.sidebar_calm_title}</button>
                  <button className={styles.sidebarBtn} onClick={() => { setMobileSheet(null); setRelaxOpen(true); }}>{t.sidebar_relax_title}</button>
                  <button className={styles.sidebarBtn} onClick={() => { setMobileSheet(null); setDictOpen(true); }}>{t.sidebar_dict_title}</button>
                </div>
              </>
            )}

            {mobileSheet === "relax" && (
              <>
                <div className={styles.mobileSheetTitle}>{t.sidebar_relax_title}</div>
                <div className={styles.mobileSheetBtnGroup}>
                  {RELAX_MOMENTS.map(m => (
                    <button key={m.id} className={styles.sidebarBtn} onClick={() => { setMobileSheet(null); setRelaxMomentId(m.id); setRelaxOpen(true); }}>
                      {m.emoji} {m.name}
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
                <div className={styles.mobileSheetTitle}>{t.sidebar_real_world}</div>
                <div className={styles.mobileSheetBtnGroup}>
                  {t.provider_cats.map(cat => (
                    <button key={cat.label} className={styles.sidebarBtn} onClick={() => {
                      setProviderCategory({ label: cat.label, prompt: cat.prompt });
                      setProviderOpen(true);
                      setProviderResults([]);
                      setProviderAddress("");
                      setSelectedPlaceCoords(null);
                      setMobileSheet(null);
                    }}>
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <CrisisButton pulsing={crisisDetected} />
    </div>
  );
}
