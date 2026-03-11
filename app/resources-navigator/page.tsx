"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CrisisButton from "../components/CrisisButton";

// ── Shared style helpers ───────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 16,
  padding: "18px 20px",
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "'Lora', serif",
  fontSize: 20,
  fontWeight: 500,
  color: "var(--text)",
  marginBottom: 6,
};

const sectionSub: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  color: "var(--subtext)",
  marginBottom: 20,
  lineHeight: 1.6,
};

const comingSoonBadge: React.CSSProperties = {
  display: "inline-block",
  background: "color-mix(in srgb, var(--accent) 22%, transparent)",
  border: "1px solid color-mix(in srgb, var(--accent) 45%, transparent)",
  borderRadius: 20,
  padding: "2px 10px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 11,
  fontWeight: 600,
  color: "var(--accent)",
  letterSpacing: "0.04em",
  marginLeft: 8,
  verticalAlign: "middle",
};

// ── Q&A Data ──────────────────────────────────────────────────────────────
const QA = [
  {
    q: "Am I going to die?",
    a: "Modern HIV treatment has completely changed what a diagnosis means. People who start treatment today can expect to live a full, near-normal lifespan — many into their 70s, 80s, and beyond. This is not false hope; it is what the research consistently shows.",
  },
  {
    q: "How did I get HIV?",
    a: "HIV is transmitted through specific body fluids — blood, semen, vaginal fluid, and breast milk — usually during unprotected sex or sharing needles. However you arrived at this moment, what matters most right now is where you go from here. This diagnosis does not define you.",
  },
  {
    q: "Who do I have to tell about my diagnosis?",
    a: "Legally, disclosure laws vary by state — many require telling sexual or needle-sharing partners, but not employers, friends, or family. You don't owe anyone your medical history unless you choose to share it. This is your story, and you decide who becomes part of it.",
  },
  {
    q: "Will people reject me if they find out?",
    a: "Some people may react out of fear or outdated beliefs, and that is real and painful. But many people — especially those who truly know you — will show up in ways that surprise you. You are so much more than this diagnosis, and the people who matter most tend to see that.",
  },
  {
    q: "Can I still have sex?",
    a: "Yes — absolutely and fully. With treatment and an undetectable viral load, you cannot transmit HIV to your partners. Intimacy, connection, and a full love life are entirely possible, and something people with HIV experience every day.",
  },
  {
    q: "Will I have to take medication for the rest of my life?",
    a: "Most people take one pill once a day, or for some, a monthly or bi-monthly injection — no daily pill at all. It becomes as routine as a vitamin. The medications work so well that many people say they rarely think about HIV in their day-to-day lives.",
  },
  {
    q: "Will anyone know I have HIV from my medication or medical records?",
    a: "Medical records are protected by federal law (HIPAA), and your providers cannot share your diagnosis without your consent. Medication bottles typically display generic drug names, not the condition they treat. Your privacy is a legal right.",
  },
  {
    q: "Can I still have children?",
    a: "Yes. With proper medical care, people with HIV have healthy pregnancies and give birth to HIV-negative children every day. Treatment during pregnancy reduces transmission risk to nearly zero. This door has not closed.",
  },
  {
    q: "How much will treatment and care cost?",
    a: "HIV care can feel financially overwhelming, but there are programs built specifically for this. The Ryan White Program, ADAP, and pharmaceutical patient assistance programs can cover care and medication at nearly every income level. Your care team's case manager can help you navigate what's available to you.",
  },
  {
    q: "Is my life over?",
    a: "No. It is not. What you're feeling right now makes complete sense given what you just learned. But people with HIV fall in love, raise families, build careers, travel, create, and live lives that are genuinely full and meaningful. This is the beginning of a new chapter — not the end of your story.",
  },
];

// ── Ryan White Subsections ────────────────────────────────────────────────
const RW_SECTIONS = [
  {
    title: "What is the Ryan White Program?",
    body: "The Ryan White HIV/AIDS Program is a federal initiative funded through HRSA (the Health Resources & Services Administration) that provides a comprehensive system of care for people living with HIV who have limited or no insurance coverage. It is the largest federal program specifically for HIV care in the United States, serving over half a million people each year. It fills the gaps that Medicaid, Medicare, and private insurance leave behind.",
  },
  {
    title: "Who was Ryan White?",
    body: "Ryan White was a teenager from Kokomo, Indiana who was diagnosed with HIV in 1984 after receiving a contaminated blood transfusion for his hemophilia. He was 13. His school tried to ban him from attending class, and his family faced harassment and discrimination. Instead of retreating, Ryan became a national voice for compassion and education — appearing on television, testifying before Congress, and humanizing HIV at a time when fear and stigma dominated the conversation. He died in April 1990 at the age of 18. Six months later, Congress passed the Ryan White CARE Act in his name.",
  },
  {
    title: "Services Covered",
    body: "The Ryan White Program covers: primary medical care and HIV specialist visits, antiretroviral medications through ADAP, dental care, mental health counseling and substance use treatment, case management services, medical transportation, emergency financial assistance, housing support, and health insurance premium assistance. Eligibility and available services vary by state — your local HIV clinic or case manager can help you understand exactly what you qualify for.",
  },
];

// ── Disclosure Cards ──────────────────────────────────────────────────────
const DISCLOSURE_CARDS = [
  {
    emoji: "💬",
    title: "Disclosure Anxiety",
    body: "You do not owe anyone your status — not immediately, not ever, unless you choose to share it. When you do decide to tell someone, timing matters: choose a private moment when you feel calm and safe. Practice what you want to say. You control this narrative.",
  },
  {
    emoji: "❤️",
    title: "Dating & Relationships",
    body: "HIV does not end your love life. Many people with HIV are in deeply fulfilling relationships — some with partners who are also HIV-positive, and many with partners who are HIV-negative. With U=U and PrEP, intimacy doesn't have to mean risk.",
  },
  {
    emoji: "🔬",
    title: "Understanding U=U",
    body: "U=U stands for Undetectable = Untransmittable. When someone on HIV treatment achieves an undetectable viral load, they cannot sexually transmit HIV to a partner. This is one of the most important scientific advances in HIV care — and it changes everything about what it means to live and love with HIV.",
  },
  {
    emoji: "👶",
    title: "Reproductive Planning",
    body: "People with HIV have healthy pregnancies and HIV-negative children every day. With the right medical care, transmission to a baby during pregnancy or birth is nearly eliminated. Partners who are HIV-negative can take PrEP as an additional layer of protection. Talk to your provider about your options.",
  },
];

// ── Accordion component ───────────────────────────────────────────────────
function Accordion({ items, titleKey = "title", bodyKey = "body" }: {
  items: Record<string, string>[];
  titleKey?: string;
  bodyKey?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            ...card,
            padding: 0,
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px", gap: 12,
          }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "var(--text)", lineHeight: 1.45, flex: 1 }}>
              {item[titleKey]}
            </span>
            <span style={{ fontSize: 18, color: "color-mix(in srgb, var(--accent) 80%, transparent)", flexShrink: 0, transition: "transform 0.2s ease", transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}>
              ▾
            </span>
          </div>
          {open === i && (
            <div style={{ padding: "0 18px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--subtext)", lineHeight: 1.7, margin: "14px 0 0" }}>
                {item[bodyKey]}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function ResourceNavigatorPage() {
  const router = useRouter();

  const FINANCIAL_CARDS = [
    {
      emoji: "💊",
      title: "Medication Assistance",
      coming: false,
      body: "The AIDS Drug Assistance Program (ADAP) is a state-run program that provides HIV medications to people who are uninsured or underinsured. Most major HIV drug manufacturers also offer Patient Assistance Programs (PAPs) that provide medications free or at very low cost. Ask your clinic's social worker or case manager to help you apply — this is what they do.",
    },
    {
      emoji: "🍎",
      title: "Food Pantry Locator",
      coming: true,
      body: "Many HIV service organizations offer food assistance and nutrition support programs for people living with HIV. We're building a searchable locator so you can find resources near you.",
    },
    {
      emoji: "⚖️",
      title: "Legal Help",
      coming: false,
      body: "HIV is a protected disability under the Americans with Disabilities Act (ADA) and the Rehabilitation Act. You have legal protections around employment, housing, and healthcare. Lambda Legal and the ACLU HIV Project both offer free legal assistance — if you face discrimination, you don't have to face it alone.",
    },
    {
      emoji: "📋",
      title: "Case Manager",
      coming: true,
      body: "A case manager is a trained professional who helps you navigate the healthcare system, apply for benefits, access housing and food resources, and connect with community support. We're building a tool to help you find one.",
    },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--text)",
      overflowY: "auto",
      overscrollBehavior: "none",
    }}>
      {/* Sticky header */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "color-mix(in srgb, var(--bg) 95%, transparent)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 20px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", color: "var(--text)", fontSize: 16, flexShrink: 0,
          }}
        >
          ←
        </button>
        <div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: "var(--text)" }}>
            Resource Navigator
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 120px" }}>

        {/* ── 1. Hero ── */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 500, color: "var(--text)", margin: "0 0 10px", lineHeight: 1.2 }}>
            Your Resource Navigator
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--subtext)", margin: 0, lineHeight: 1.65 }}>
            You don't have to figure this out alone. Everything here was made for you.
          </p>
        </div>

        {/* ── 2. Q&A ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Questions You're Probably Already Asking</div>
          <p style={sectionSub}>The questions you're too scared to Google. Answered honestly.</p>
          <Accordion items={QA} titleKey="q" bodyKey="a" />
        </section>

        {/* ── 3. Roadmap ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Your Roadmap</div>
          <p style={sectionSub}>What the journey ahead actually looks like — one step at a time.</p>
          <div style={{ ...card }}>
            {[
              { time: "Week 1", color: "var(--accent)", steps: ["Understand HIV basics", "Schedule your first appointment"] },
              { time: "Month 1", color: "var(--accent)", steps: ["Start treatment", "Learn about viral suppression"] },
              { time: "Month 3", color: "var(--accent)", steps: ["Lab monitoring check-in", "Understanding U=U"] },
              { time: "Month 6", color: "var(--accent)", steps: ["Long-term care planning", "Building your support system"] },
            ].map((milestone, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 16, position: "relative" }}>
                {/* Line + dot */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 20 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: milestone.color, border: "2px solid var(--bg)", flexShrink: 0, marginTop: 2 }} />
                  {i < arr.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: "rgba(255,255,255,0.12)", minHeight: 32, margin: "4px 0" }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ paddingBottom: i < arr.length - 1 ? 20 : 0 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "color-mix(in srgb, var(--accent) 85%, transparent)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
                    {milestone.time}
                  </div>
                  {milestone.steps.map((s, si) => (
                    <div key={si} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. Ryan White ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Ryan White Program</div>
          <p style={sectionSub}>Federal support designed specifically for people living with HIV.</p>
          <div style={card}>
            <Accordion items={RW_SECTIONS} titleKey="title" bodyKey="body" />
          </div>
        </section>

        {/* ── 5. Financial ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Financial & Practical Help</div>
          <p style={sectionSub}>Resources that exist specifically to remove financial barriers to care.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {FINANCIAL_CARDS.map(fc => (
              <div key={fc.title} style={{ ...card, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{fc.emoji}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                    {fc.title}
                  </span>
                  {fc.coming && <span style={comingSoonBadge}>Coming Soon</span>}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.65, margin: 0 }}>
                  {fc.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 6. Disclosure & Relationships ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Sex, Love & Disclosure</div>
          <p style={sectionSub}>Your relationships — romantic and otherwise — don't have to end here.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {DISCLOSURE_CARDS.map(dc => (
              <div key={dc.title} style={{ ...card, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{dc.emoji}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                    {dc.title}
                  </span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.65, margin: 0 }}>
                  {dc.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7. Coming Soon ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Coming Soon</div>
          <p style={sectionSub}>We're building more for you.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ ...card, display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>📖</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                    Stories from People Living with HIV
                  </span>
                  <span style={comingSoonBadge}>Coming Soon</span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.6, margin: 0 }}>
                  Real voices, real journeys. First-person stories from people who were exactly where you are — and found their way through.
                </p>
              </div>
            </div>
            <div style={{ ...card, display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>🤝</span>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
                    Buddy System
                  </span>
                  <span style={comingSoonBadge}>Coming Soon</span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.6, margin: 0 }}>
                  Get matched with someone who's been where you are. Someone who gets it — not because they read about it, but because they lived it.
                </p>
              </div>
            </div>
          </div>
        </section>

      </div>

      <CrisisButton />
    </div>
  );
}
