"use client";

import { useState, useEffect } from "react";
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

// ── All US states + DC ─────────────────────────────────────────────────────
const ALL_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","District of Columbia","Florida","Georgia","Hawaii","Idaho","Illinois",
  "Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts",
  "Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
  "New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota",
  "Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina",
  "South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington",
  "West Virginia","Wisconsin","Wyoming",
];

// ── State-specific medication program data ─────────────────────────────────
type Program = { name: string; desc: string; apply: string; contact?: string };
type StateEntry = { programs: Program[]; legal?: string[] };

const MANUFACTURER_PAPS: Program[] = [
  {
    name: "Gilead Advancing Access®",
    desc: "Gilead Sciences offers free HIV medications (Biktarvy, Descovy, Truvada, and others) to eligible uninsured and underinsured patients through their patient assistance program.",
    apply: "Apply online at GileadAdvancingAccess.com or call 1-800-226-2056. Your provider can also initiate the application on your behalf.",
    contact: "1-800-226-2056 · GileadAdvancingAccess.com",
  },
  {
    name: "ViiV Healthcare Positive Pathways™",
    desc: "ViiV Healthcare offers free medications (Cabenuva, Dovato, Triumeq, and others) to patients who are uninsured or cannot afford their medications.",
    apply: "Apply through your healthcare provider at PositivePathways.com or call 1-844-588-3288.",
    contact: "1-844-588-3288 · PositivePathways.com",
  },
  {
    name: "Janssen CarePath",
    desc: "Janssen offers free medications (Symtuza, Prezista, Edurant, and others) through their patient assistance program for qualifying uninsured patients.",
    apply: "Call 1-800-652-6227 or visit JanssenCarePath.com. Your provider can also help you apply.",
    contact: "1-800-652-6227 · JanssenCarePath.com",
  },
];

function genericStatePrograms(stateName: string): Program[] {
  return [
    {
      name: `${stateName} AIDS Drug Assistance Program (ADAP)`,
      desc: `${stateName}'s ADAP provides free or low-cost HIV medications to residents who are uninsured or underinsured. Funded through the federal Ryan White Program, ADAP covers a formulary of antiretroviral medications.`,
      apply: `Contact your local Ryan White-funded clinic or HIV case manager to begin the ADAP application process. You can also search for your state's ADAP contact through the National Alliance of State & Territorial AIDS Directors at nastad.org.`,
      contact: "NASTAD State ADAP Directory · nastad.org/adap",
    },
    ...MANUFACTURER_PAPS,
    {
      name: "Ryan White Program Case Manager",
      desc: "A Ryan White case manager can connect you with all state-specific programs, including emergency financial assistance, housing support, and local drug assistance programs not listed here.",
      apply: "Ask your HIV provider for a referral to a Ryan White-funded case manager, or contact your local health department.",
    },
  ];
}

const STATE_DATA: Record<string, StateEntry> = {
  Pennsylvania: {
    programs: [
      {
        name: "Special Pharmaceutical Benefits Program (SPBP)",
        desc: "Pennsylvania's SPBP is the state's primary HIV drug assistance program, covering antiretroviral medications for PA residents who are uninsured or underinsured. It operates through both state and federal (ADAP) funding.",
        apply: "Apply through your HIV provider or a Ryan White-funded case manager. Call the PA SPBP program at 1-800-922-9384 or contact your local health department.",
        contact: "1-800-922-9384",
      },
      {
        name: "Medicaid / HealthyPA",
        desc: "Pennsylvania has expanded Medicaid under the ACA, meaning many low-income adults with HIV qualify for comprehensive coverage including HIV medications, specialist visits, dental, and mental health services.",
        apply: "Apply at compass.state.pa.us or call 1-866-550-4355. Many HIV clinics have navigators who can help you apply on the spot.",
        contact: "1-866-550-4355 · compass.state.pa.us",
      },
      ...MANUFACTURER_PAPS,
    ],
    legal: [
      "PA Health Law Project — Free legal help with health insurance, Medicaid, and HIV-related discrimination (pahealthlawproject.org · 1-800-274-3258)",
      "Mazzoni Center Legal Services — Philadelphia-based LGBTQ+ affirming legal services including HIV-related issues (mazzonicenter.org · 215-563-0652)",
      "Lambda Legal (national) — HIV discrimination cases, employment, housing (lambdalegal.org · 212-809-8585)",
      "ACLU HIV Project (national) — Civil rights and HIV-related legal advocacy (aclu.org/hiv-aids)",
    ],
  },

  "New York": {
    programs: [
      {
        name: "AIDS Drug Assistance Program (ADAP) — NYSDOH",
        desc: "New York's ADAP through the Department of Health covers a broad formulary of HIV medications for uninsured and underinsured New Yorkers. It is one of the most comprehensive ADAP programs in the country.",
        apply: "Contact the NY ADAP program at 1-800-542-2437 or apply through your HIV provider or clinic. Enrollment can also be initiated through any Ryan White-funded organization.",
        contact: "1-800-542-2437",
      },
      {
        name: "Medicaid HIV/AIDS Special Needs Plans (SNP)",
        desc: "New York offers Medicaid Managed Long-Term Care plans and HIV Special Needs Plans tailored specifically to people with HIV, providing comprehensive care coordination alongside medical coverage.",
        apply: "Enroll through the New York State of Health marketplace at nystateofhealth.ny.gov or call 1-855-355-5777.",
        contact: "1-855-355-5777 · nystateofhealth.ny.gov",
      },
      ...MANUFACTURER_PAPS,
    ],
    legal: [
      "Gay Men's Health Crisis (GMHC) Legal Services — NYC-based free legal assistance for people living with HIV (gmhc.org · 212-367-1000)",
      "Housing Works — Legal services + housing advocacy for people with HIV/AIDS in NYC (housingworks.org · 212-966-0466)",
      "Lambda Legal (national) — HIV discrimination, employment, housing (lambdalegal.org)",
      "ACLU HIV Project (national) — Civil rights and HIV-related advocacy (aclu.org/hiv-aids)",
    ],
  },

  Florida: {
    programs: [
      {
        name: "Florida ADAP — Florida Department of Health",
        desc: "Florida's AIDS Drug Assistance Program covers a formulary of antiretroviral medications for uninsured and underinsured Florida residents through Ryan White Part B funding.",
        apply: "Contact the Florida ADAP at 1-850-245-4334 or visit the Florida Department of Health HIV/AIDS program page. Your local county health department can also assist with enrollment.",
        contact: "1-850-245-4334 · floridahealth.gov",
      },
      {
        name: "Florida Medicaid",
        desc: "Florida has not expanded Medicaid under the ACA, which means eligibility is more limited. However, some people with HIV may still qualify based on disability or other criteria. It is worth checking your eligibility.",
        apply: "Apply at myflorida.com/accessflorida or call 1-866-762-2237. If you have a disability related to your HIV status, you may qualify even without Medicaid expansion.",
        contact: "1-866-762-2237 · myflorida.com/accessflorida",
      },
      ...MANUFACTURER_PAPS,
    ],
    legal: [
      "Legal Services of Greater Miami HIV/AIDS Project — Free legal services for people with HIV in South Florida (legalservicesmiami.org · 305-576-0080)",
      "Lambda Legal (national) — HIV discrimination, employment, housing (lambdalegal.org)",
      "ACLU HIV Project (national) — Civil rights and HIV-related advocacy (aclu.org/hiv-aids)",
      "Florida Legal Services — Statewide legal aid referrals (floridalegal.org)",
    ],
  },

  California: {
    programs: [
      {
        name: "ADAP — California Department of Public Health (CDPH)",
        desc: "California's ADAP through CDPH provides HIV medications at no cost to eligible Californians who are uninsured or whose insurance does not cover HIV medications. California has one of the most expansive ADAP formularies in the US.",
        apply: "Enroll through your HIV provider, local public health department, or Ryan White-funded organization. Call the CDPH ADAP program at 1-844-421-7050.",
        contact: "1-844-421-7050 · cdph.ca.gov",
      },
      {
        name: "Medi-Cal (California Medicaid)",
        desc: "California has fully expanded Medicaid (Medi-Cal), and many people with HIV qualify for comprehensive coverage including medications, specialist care, dental, mental health, and substance use treatment.",
        apply: "Apply online at coveredca.com or call 1-800-300-1506. Many counties also have HIV-specific enrollment navigators.",
        contact: "1-800-300-1506 · coveredca.com",
      },
      ...MANUFACTURER_PAPS,
    ],
    legal: [
      "AIDS Legal Referral Panel (ALRP) — San Francisco area free legal services for people with HIV (alrp.org · 415-701-1100)",
      "Lambda Legal (national) — HIV discrimination, employment, housing (lambdalegal.org)",
      "ACLU HIV Project (national) — Civil rights and HIV-related advocacy (aclu.org/hiv-aids)",
      "Bet Tzedek Legal Services — LA-based free legal services including HIV matters (bettzedek.org · 323-939-0506)",
    ],
  },

  Texas: {
    programs: [
      {
        name: "Texas HIV Medication Program (THMP)",
        desc: "Texas ADAP — known as THMP — provides free HIV medications to income-eligible Texans who are uninsured or underinsured. It is funded through Ryan White Part B.",
        apply: "Apply through your HIV provider or local Ryan White clinic. Contact THMP directly at 1-800-255-1090 or visit the Texas DSHS HIV/STD program website.",
        contact: "1-800-255-1090 · dshs.texas.gov/hivstd",
      },
      {
        name: "⚠️ Note: Texas Has Not Expanded Medicaid",
        desc: "Texas is one of the states that has not expanded Medicaid under the ACA. This means Medicaid eligibility is more limited in Texas. Many adults with HIV who would qualify in other states may not qualify here. THMP and manufacturer PAPs become especially important in Texas.",
        apply: "If you believe you may have a disability qualifying you for SSI-linked Medicaid, contact your local social services office. Otherwise, THMP and manufacturer PAPs are your primary options.",
        contact: "Texas HHSC · hhs.texas.gov",
      },
      ...MANUFACTURER_PAPS,
    ],
    legal: [
      "AIDS Legal Alliance of Houston (ALAH) — Free HIV legal services in Houston (aidslegalalliancetx.org)",
      "Disability Rights Texas — Legal advocacy including HIV-related disability rights (disabilityrightstx.org · 1-800-252-9108)",
      "Lambda Legal (national) — HIV discrimination, employment, housing (lambdalegal.org)",
      "ACLU HIV Project (national) — Civil rights and HIV-related advocacy (aclu.org/hiv-aids)",
    ],
  },
};

// Build generic entries for all other states
ALL_STATES.forEach(state => {
  if (!STATE_DATA[state]) {
    STATE_DATA[state] = {
      programs: genericStatePrograms(state),
      legal: [
        "Lambda Legal (national) — HIV discrimination cases, employment, housing (lambdalegal.org · 212-809-8585)",
        "ACLU HIV Project (national) — Civil rights and HIV-related legal advocacy (aclu.org/hiv-aids)",
        "AIDS Law Project of Pennsylvania (if bordering PA) — Regional HIV legal services",
        "Contact your local Ryan White case manager for state-specific legal aid referrals",
      ],
    };
  }
});

// ── Q&A Data ──────────────────────────────────────────────────────────────
const QA = [
  { q: "Am I going to die?", a: "Modern HIV treatment has completely changed what a diagnosis means. People who start treatment today can expect to live a full, near-normal lifespan — many into their 70s, 80s, and beyond. This is not false hope; it is what the research consistently shows." },
  { q: "How did I get HIV?", a: "HIV is transmitted through specific body fluids — blood, semen, vaginal fluid, and breast milk — usually during unprotected sex or sharing needles. However you arrived at this moment, what matters most right now is where you go from here. This diagnosis does not define you." },
  { q: "Who do I have to tell about my diagnosis?", a: "Legally, disclosure laws vary by state — many require telling sexual or needle-sharing partners, but not employers, friends, or family. You don't owe anyone your medical history unless you choose to share it. This is your story, and you decide who becomes part of it." },
  { q: "Will people reject me if they find out?", a: "Some people may react out of fear or outdated beliefs, and that is real and painful. But many people — especially those who truly know you — will show up in ways that surprise you. You are so much more than this diagnosis, and the people who matter most tend to see that." },
  { q: "Can I still have sex?", a: "Yes — absolutely and fully. With treatment and an undetectable viral load, you cannot transmit HIV to your partners. Intimacy, connection, and a full love life are entirely possible, and something people with HIV experience every day." },
  { q: "Will I have to take medication for the rest of my life?", a: "Most people take one pill once a day, or for some, a monthly or bi-monthly injection — no daily pill at all. It becomes as routine as a vitamin. The medications work so well that many people say they rarely think about HIV in their day-to-day lives." },
  { q: "Will anyone know I have HIV from my medication or medical records?", a: "Medical records are protected by federal law (HIPAA), and your providers cannot share your diagnosis without your consent. Medication bottles typically display generic drug names, not the condition they treat. Your privacy is a legal right." },
  { q: "Can I still have children?", a: "Yes. With proper medical care, people with HIV have healthy pregnancies and give birth to HIV-negative children every day. Treatment during pregnancy reduces transmission risk to nearly zero. This door has not closed." },
  { q: "How much will treatment and care cost?", a: "HIV care can feel financially overwhelming, but there are programs built specifically for this. The Ryan White Program, ADAP, and pharmaceutical patient assistance programs can cover care and medication at nearly every income level. Your care team's case manager can help you navigate what's available to you." },
  { q: "Is my life over?", a: "No. It is not. What you're feeling right now makes complete sense given what you just learned. But people with HIV fall in love, raise families, build careers, travel, create, and live lives that are genuinely full and meaningful. This is the beginning of a new chapter — not the end of your story." },
];

// ── Ryan White Sections ────────────────────────────────────────────────────
const RW_SECTIONS = [
  { title: "What is the Ryan White Program?", body: "The Ryan White HIV/AIDS Program is a federal initiative funded through HRSA (the Health Resources & Services Administration) that provides a comprehensive system of care for people living with HIV who have limited or no insurance coverage. It is the largest federal program specifically for HIV care in the United States, serving over half a million people each year. It fills the gaps that Medicaid, Medicare, and private insurance leave behind." },
  { title: "Who was Ryan White?", body: "Ryan White was a teenager from Kokomo, Indiana who was diagnosed with HIV in 1984 after receiving a contaminated blood transfusion for his hemophilia. He was 13. His school tried to ban him from attending class, and his family faced harassment and discrimination. Instead of retreating, Ryan became a national voice for compassion and education — appearing on television, testifying before Congress, and humanizing HIV at a time when fear and stigma dominated the conversation. He died in April 1990 at the age of 18. Six months later, Congress passed the Ryan White CARE Act in his name." },
  { title: "Services Covered", body: "The Ryan White Program covers: primary medical care and HIV specialist visits, antiretroviral medications through ADAP, dental care, mental health counseling and substance use treatment, case management services, medical transportation, emergency financial assistance, housing support, and health insurance premium assistance. Eligibility and available services vary by state — your local HIV clinic or case manager can help you understand exactly what you qualify for." },
];

// ── Disclosure Cards ──────────────────────────────────────────────────────
const DISCLOSURE_CARDS = [
  { emoji: "💬", title: "Disclosure Anxiety", body: "You do not owe anyone your status — not immediately, not ever, unless you choose to share it. When you do decide to tell someone, timing matters: choose a private moment when you feel calm and safe. Practice what you want to say. You control this narrative." },
  { emoji: "❤️", title: "Dating & Relationships", body: "HIV does not end your love life. Many people with HIV are in deeply fulfilling relationships — some with partners who are also HIV-positive, and many with partners who are HIV-negative. With U=U and PrEP, intimacy doesn't have to mean risk." },
  { emoji: "🔬", title: "Understanding U=U", body: "U=U stands for Undetectable = Untransmittable. When someone on HIV treatment achieves an undetectable viral load, they cannot sexually transmit HIV to a partner. This is one of the most important scientific advances in HIV care — and it changes everything about what it means to live and love with HIV." },
  { emoji: "👶", title: "Reproductive Planning", body: "People with HIV have healthy pregnancies and HIV-negative children every day. With the right medical care, transmission to a baby during pregnancy or birth is nearly eliminated. Partners who are HIV-negative can take PrEP as an additional layer of protection. Talk to your provider about your options." },
];

// ── Accordion ─────────────────────────────────────────────────────────────
function Accordion({ items, titleKey = "title", bodyKey = "body" }: {
  items: Record<string, string>[];
  titleKey?: string;
  bodyKey?: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <div key={i} style={{ ...card, padding: 0, overflow: "hidden", cursor: "pointer" }}
          onClick={() => setOpen(open === i ? null : i)}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", gap: 12 }}>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "var(--text)", lineHeight: 1.45, flex: 1 }}>
              {item[titleKey]}
            </span>
            <span style={{ fontSize: 18, color: "color-mix(in srgb, var(--accent) 80%, transparent)", flexShrink: 0, transition: "transform 0.2s ease", transform: open === i ? "rotate(180deg)" : "rotate(0deg)" }}>▾</span>
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

// ── Program card with expandable "How to apply" ───────────────────────────
function ProgramCard({ prog }: { prog: Program }) {
  const [applyOpen, setApplyOpen] = useState(false);
  return (
    <div style={{ ...card, padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 18px 14px" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 6, lineHeight: 1.4 }}>
          {prog.name}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.65, margin: 0 }}>
          {prog.desc}
        </p>
        {prog.contact && (
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "color-mix(in srgb, var(--accent) 80%, transparent)", marginTop: 8 }}>
            {prog.contact}
          </div>
        )}
      </div>
      <div
        style={{ padding: "10px 18px 12px", borderTop: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
        onClick={() => setApplyOpen(v => !v)}
      >
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: "color-mix(in srgb, var(--accent) 75%, transparent)", letterSpacing: "0.04em" }}>
          How to apply
        </span>
        <span style={{ fontSize: 14, color: "color-mix(in srgb, var(--accent) 60%, transparent)", transition: "transform 0.2s", transform: applyOpen ? "rotate(180deg)" : "none" }}>▾</span>
      </div>
      {applyOpen && (
        <div style={{ padding: "0 18px 16px", background: "rgba(255,255,255,0.02)" }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.65, margin: 0 }}>
            {prog.apply}
          </p>
        </div>
      )}
    </div>
  );
}

// ── No-state placeholder ──────────────────────────────────────────────────
function NoStatePlaceholder() {
  return (
    <div style={{ ...card, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center", padding: "24px 20px" }}>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "color-mix(in srgb, var(--text) 45%, transparent)", lineHeight: 1.6, margin: 0 }}>
        Select your state above to see programs available to you.
      </p>
    </div>
  );
}

// ── Shared input style ────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  padding: "9px 12px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 14,
  color: "var(--text)",
  outline: "none",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: "vertical" as const,
  lineHeight: 1.6,
  minHeight: 80,
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12,
  fontWeight: 600,
  color: "color-mix(in srgb, var(--text) 60%, transparent)",
  letterSpacing: "0.04em",
  display: "block",
  marginBottom: 4,
};

// ── Submission forms ───────────────────────────────────────────────────────
function CorrectionForm({ state }: { state: string }) {
  const [open, setOpen] = useState(false);
  const [resourceName, setResourceName] = useState("");
  const [correction, setCorrection] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const submit = async () => {
    if (!resourceName.trim() || !correction.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/resource-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "correction",
          fields: { resourceName, state, correction, submitterName, submitterEmail },
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setStatus(data.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ ...card }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setOpen(v => !v)}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>✏️ Something look wrong?</div>
          {!open && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "color-mix(in srgb, var(--text) 45%, transparent)", marginTop: 2 }}>Help us keep these resources accurate for your community.</div>}
        </div>
        <span style={{ fontSize: 20, color: "color-mix(in srgb, var(--accent) 70%, transparent)", flexShrink: 0, marginLeft: 12, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </div>

      {open && (
        <div style={{ marginTop: 16 }}>
          {status === "success" ? (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--subtext)", lineHeight: 1.65, margin: 0, padding: "12px 0" }}>
              💙 Thank you. Your submission helps people in {state} find the support they need.
            </p>
          ) : (
            <>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.6, margin: "0 0 16px" }}>
                Help us keep these resources accurate for your community.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Name of the incorrect resource *</label>
                  <input style={inputStyle} value={resourceName} onChange={e => setResourceName(e.target.value)} placeholder="e.g. Pennsylvania ADAP" />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input style={{ ...inputStyle, opacity: 0.55, cursor: "not-allowed" }} value={state} readOnly />
                </div>
                <div>
                  <label style={labelStyle}>What needs to be corrected *</label>
                  <textarea style={textareaStyle} value={correction} onChange={e => setCorrection(e.target.value)} placeholder="Tell us what's wrong and what the correct information should be" />
                </div>
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input style={inputStyle} value={submitterName} onChange={e => setSubmitterName(e.target.value)} placeholder="Optional — only if you'd like us to follow up" />
                </div>
                <div>
                  <label style={labelStyle}>Your email</label>
                  <input style={inputStyle} type="email" value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} placeholder="Optional — only if you'd like us to follow up" />
                </div>
                {status === "error" && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#f9a8a8", margin: 0 }}>
                    Something didn't go through. Please try again or email us directly at miguelr@novusacs.com
                  </p>
                )}
                <button
                  onClick={submit}
                  disabled={status === "sending" || !resourceName.trim() || !correction.trim()}
                  style={{ background: "color-mix(in srgb, var(--accent) 22%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 45%, transparent)", borderRadius: 10, padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--accent)", cursor: status === "sending" ? "not-allowed" : "pointer", opacity: (status === "sending" || !resourceName.trim() || !correction.trim()) ? 0.5 : 1, transition: "opacity 0.2s" }}
                >
                  {status === "sending" ? "Sending…" : "Submit Correction"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function ResourceForm({ state }: { state: string }) {
  const [open, setOpen] = useState(false);
  const [resourceName, setResourceName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const canSubmit = resourceName.trim() && address.trim() && city.trim() && zip.trim() && description.trim();

  const submit = async () => {
    if (!canSubmit) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/resource-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "resource",
          fields: { resourceName, address, city, state, zip, phone, fax, website, description, submitterName, submitterEmail },
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setStatus(data.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ ...card }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => setOpen(v => !v)}>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>➕ Know a resource we're missing?</div>
          {!open && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "color-mix(in srgb, var(--text) 45%, transparent)", marginTop: 2 }}>Help other people in your state find the support they need.</div>}
        </div>
        <span style={{ fontSize: 20, color: "color-mix(in srgb, var(--accent) 70%, transparent)", flexShrink: 0, marginLeft: 12, transition: "transform 0.2s", transform: open ? "rotate(45deg)" : "none" }}>+</span>
      </div>

      {open && (
        <div style={{ marginTop: 16 }}>
          {status === "success" ? (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--subtext)", lineHeight: 1.65, margin: 0, padding: "12px 0" }}>
              💙 Thank you. Your submission helps people in {state} find the support they need.
            </p>
          ) : (
            <>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.6, margin: "0 0 16px" }}>
                Help other people in your state find the support they need.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Name of the resource *</label>
                  <input style={inputStyle} value={resourceName} onChange={e => setResourceName(e.target.value)} placeholder="Organization or program name" />
                </div>
                <div>
                  <label style={labelStyle}>Address *</label>
                  <input style={inputStyle} value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input style={inputStyle} value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
                  </div>
                  <div>
                    <label style={labelStyle}>Zip code *</label>
                    <input style={inputStyle} value={zip} onChange={e => setZip(e.target.value)} placeholder="Zip" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input style={{ ...inputStyle, opacity: 0.55, cursor: "not-allowed" }} value={state} readOnly />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input style={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} placeholder="Optional" />
                  </div>
                  <div>
                    <label style={labelStyle}>Fax</label>
                    <input style={inputStyle} value={fax} onChange={e => setFax(e.target.value)} placeholder="Optional" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Website</label>
                  <input style={inputStyle} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://" />
                </div>
                <div>
                  <label style={labelStyle}>Resources provided *</label>
                  <textarea style={textareaStyle} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what this resource offers — medications, food, legal help, mental health, housing, etc." />
                </div>
                <div>
                  <label style={labelStyle}>Your name</label>
                  <input style={inputStyle} value={submitterName} onChange={e => setSubmitterName(e.target.value)} placeholder="Optional" />
                </div>
                <div>
                  <label style={labelStyle}>Your email</label>
                  <input style={inputStyle} type="email" value={submitterEmail} onChange={e => setSubmitterEmail(e.target.value)} placeholder="Optional" />
                </div>
                {status === "error" && (
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#f9a8a8", margin: 0 }}>
                    Something didn't go through. Please try again or email us directly at miguelr@novusacs.com
                  </p>
                )}
                <button
                  onClick={submit}
                  disabled={status === "sending" || !canSubmit}
                  style={{ background: "color-mix(in srgb, var(--accent) 22%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 45%, transparent)", borderRadius: 10, padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--accent)", cursor: (status === "sending" || !canSubmit) ? "not-allowed" : "pointer", opacity: (status === "sending" || !canSubmit) ? 0.5 : 1, transition: "opacity 0.2s" }}
                >
                  {status === "sending" ? "Sending…" : "Submit Resource"}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function ResourceNavigatorPage() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("patient_state") || "";
    setSelectedState(saved);
  }, []);

  const handleStateChange = (s: string) => {
    setSelectedState(s);
    localStorage.setItem("patient_state", s);
  };

  const stateData = selectedState ? STATE_DATA[selectedState] : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", overflowY: "auto", overscrollBehavior: "none" }}>

      {/* Sticky header */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "color-mix(in srgb, var(--bg) 95%, transparent)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text)", fontSize: 16, flexShrink: 0 }}>←</button>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 500, color: "var(--text)" }}>Resource Navigator</div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px 120px" }}>

        {/* ── Hero ── */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 500, color: "var(--text)", margin: "0 0 10px", lineHeight: 1.2 }}>
            Your Resource Navigator
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, color: "var(--subtext)", margin: 0, lineHeight: 1.65 }}>
            You don't have to figure this out alone. Everything here was made for you.
          </p>
        </div>

        {/* ── State selector ── */}
        <div style={{ ...card, marginBottom: 44, background: "rgba(255,255,255,0.04)" }}>
          <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "color-mix(in srgb, var(--text) 70%, transparent)", display: "block", marginBottom: 10, letterSpacing: "0.04em" }}>
            Select your state to see resources available to you
          </label>
          <select
            value={selectedState}
            onChange={e => handleStateChange(e.target.value)}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
              borderRadius: 10,
              padding: "10px 14px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: selectedState ? "var(--text)" : "color-mix(in srgb, var(--text) 40%, transparent)",
              cursor: "pointer",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 14px center",
              paddingRight: 36,
            }}
          >
            <option value="" style={{ background: "#1a1a2e", color: "#aaa" }}>— Choose your state —</option>
            {ALL_STATES.map(s => (
              <option key={s} value={s} style={{ background: "#1a1a2e", color: "#fff" }}>{s}</option>
            ))}
          </select>
          {selectedState && (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "color-mix(in srgb, var(--accent) 70%, transparent)", margin: "8px 0 0", lineHeight: 1.5 }}>
              Showing resources for <strong>{selectedState}</strong>. All sections below are now filtered for your state.
            </p>
          )}
        </div>

        {/* ── Q&A ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Questions You're Probably Already Asking</div>
          <p style={sectionSub}>The questions you're too scared to Google. Answered honestly.</p>
          <Accordion items={QA} titleKey="q" bodyKey="a" />
        </section>

        {/* ── Roadmap ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Your Roadmap</div>
          <p style={sectionSub}>What the journey ahead actually looks like — one step at a time.</p>
          <div style={{ ...card }}>
            {[
              { time: "Week 1", steps: ["Understand HIV basics", "Schedule your first appointment"] },
              { time: "Month 1", steps: ["Start treatment", "Learn about viral suppression"] },
              { time: "Month 3", steps: ["Lab monitoring check-in", "Understanding U=U"] },
              { time: "Month 6", steps: ["Long-term care planning", "Building your support system"] },
            ].map((m, i, arr) => (
              <div key={i} style={{ display: "flex", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 20 }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: "var(--accent)", border: "2px solid var(--bg)", flexShrink: 0, marginTop: 2 }} />
                  {i < arr.length - 1 && <div style={{ width: 2, flex: 1, background: "rgba(255,255,255,0.12)", minHeight: 32, margin: "4px 0" }} />}
                </div>
                <div style={{ paddingBottom: i < arr.length - 1 ? 20 : 0 }}>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, color: "color-mix(in srgb, var(--accent) 85%, transparent)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{m.time}</div>
                  {m.steps.map((s, si) => <div key={si} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--text)", lineHeight: 1.6 }}>{s}</div>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Ryan White ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Ryan White Program</div>
          <p style={sectionSub}>Federal support designed specifically for people living with HIV.</p>
          <div style={card}>
            <Accordion items={RW_SECTIONS} titleKey="title" bodyKey="body" />
            {/* State disclosure notice */}
            <div style={{ marginTop: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.65, margin: 0 }}>
                🏛️ Ryan White is a federal program, so core services are available nationwide. However, the specific services offered, eligibility requirements, and providers vary by state and local area.{selectedState ? ` See the resources below for ${selectedState}-specific programs.` : " Select your state above to learn more."} You can also contact your local Ryan White grantee directly.
              </p>
            </div>
          </div>
        </section>

        {/* ── Medication Assistance ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>💊 Medication Assistance</div>
          <p style={sectionSub}>Programs that exist specifically so HIV medications never have to be out of reach.</p>
          {stateData ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {stateData.programs.map((prog, i) => <ProgramCard key={i} prog={prog} />)}
            </div>
          ) : (
            <NoStatePlaceholder />
          )}
        </section>

        {/* ── Food Pantry ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>🍎 Food Assistance</div>
          <p style={sectionSub}>Nutrition support — because your health depends on more than medication.</p>
          {selectedState ? (
            <div style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: "var(--text)", lineHeight: 1.65, margin: 0 }}>
                The Feeding America network has food banks across every state. Use their locator to find the nearest food bank to you — no judgment, no requirements.
              </p>
              <a
                href="https://www.feedingamerica.org/find-your-local-foodbank"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-block", background: "color-mix(in srgb, var(--accent) 18%, transparent)", border: "1px solid color-mix(in srgb, var(--accent) 40%, transparent)", borderRadius: 10, padding: "10px 18px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "var(--accent)", textDecoration: "none", width: "fit-content" }}
              >
                Find a food bank near you →
              </a>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.6, margin: 0 }}>
                Many local service organizations in {selectedState} also provide food assistance, grocery cards, and meal delivery programs for people living with HIV. Your Ryan White case manager can connect you with what's available in your area.
              </p>
            </div>
          ) : (
            <NoStatePlaceholder />
          )}
        </section>

        {/* ── Legal Help ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>⚖️ Legal Help</div>
          <p style={sectionSub}>HIV is a protected disability. You have rights — and people to enforce them.</p>
          {stateData ? (
            <div style={{ ...card }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.65, margin: "0 0 16px" }}>
                HIV is protected under the Americans with Disabilities Act (ADA) and the Rehabilitation Act. You have legal protections around employment, housing, and healthcare. The following organizations offer free legal assistance:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(stateData.legal ?? []).map((item, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "10px 14px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <NoStatePlaceholder />
          )}
        </section>

        {/* ── Community Submission Forms ── */}
        {selectedState && (
          <section style={{ marginBottom: 44 }}>
            <div style={sectionTitle}>Help Us Improve</div>
            <p style={sectionSub}>You know your community better than we do.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 14 }}>
              <CorrectionForm state={selectedState} />
              <ResourceForm state={selectedState} />
            </div>
          </section>
        )}

        {/* ── Case Manager ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={{ ...card, display: "flex", alignItems: "flex-start", gap: 14 }}>
            <span style={{ fontSize: 28, flexShrink: 0 }}>📋</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Case Manager Finder</span>
                <span style={comingSoonBadge}>Coming Soon</span>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.65, margin: 0 }}>
                A case manager is a trained professional who helps you navigate the healthcare system, apply for benefits, access housing and food resources, and connect with community support. We're building a tool to help you find one near you. For now, ask your HIV provider or local health department for a Ryan White referral.
              </p>
            </div>
          </div>
        </section>

        {/* ── Disclosure & Relationships ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Sex, Love & Disclosure</div>
          <p style={sectionSub}>Your relationships — romantic and otherwise — don't have to end here.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
            {DISCLOSURE_CARDS.map(dc => (
              <div key={dc.title} style={{ ...card, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 22 }}>{dc.emoji}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{dc.title}</span>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.65, margin: 0 }}>{dc.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Coming Soon ── */}
        <section style={{ marginBottom: 44 }}>
          <div style={sectionTitle}>Coming Soon</div>
          <p style={sectionSub}>We're building more for you.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { emoji: "📖", title: "Stories from People Living with HIV", body: "Real voices, real journeys. First-person stories from people who were exactly where you are — and found their way through." },
              { emoji: "🤝", title: "Buddy System", body: "Get matched with someone who's been where you are. Someone who gets it — not because they read about it, but because they lived it." },
            ].map(cs => (
              <div key={cs.title} style={{ ...card, display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 32, flexShrink: 0 }}>{cs.emoji}</span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{cs.title}</span>
                    <span style={comingSoonBadge}>Coming Soon</span>
                  </div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "var(--subtext)", lineHeight: 1.6, margin: 0 }}>{cs.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      <CrisisButton />
    </div>
  );
}
