"use client";

import { useState, useEffect } from "react";

// ── Translations for UI chrome ────────────────────────────────────────────────
const T: Record<string, {
  btn: string; title: string; submit: string; sending: string;
  cancel: string; thanks: string; optional: string;
}> = {
  en:    { btn: "Feedback", title: "Share your feedback", submit: "Send feedback", sending: "Sending…", cancel: "Maybe later", thanks: "Thank you. Your feedback helps us make this better for everyone who comes after you.", optional: "Optional" },
  es:    { btn: "Comentarios", title: "Comparte tus comentarios", submit: "Enviar comentarios", sending: "Enviando…", cancel: "Quizás después", thanks: "Gracias. Tus comentarios nos ayudan a mejorar esto para todos.", optional: "Opcional" },
  ptBR:  { btn: "Comentários", title: "Compartilhe seu feedback", submit: "Enviar feedback", sending: "Enviando…", cancel: "Talvez depois", thanks: "Obrigado. Seu feedback nos ajuda a melhorar para todos.", optional: "Opcional" },
  fr:    { btn: "Commentaires", title: "Partagez vos commentaires", submit: "Envoyer", sending: "Envoi…", cancel: "Plus tard", thanks: "Merci. Vos commentaires nous aident à améliorer pour tous.", optional: "Facultatif" },
  ht:    { btn: "Kòmantè", title: "Pataje kòmantè ou", submit: "Voye kòmantè", sending: "Ap voye…", cancel: "Pita", thanks: "Mèsi. Kòmantè ou ede nou amelyore sa pou tout moun.", optional: "Opsyonèl" },
  zhCN:  { btn: "反馈", title: "分享您的反馈", submit: "发送反馈", sending: "发送中…", cancel: "稍后再说", thanks: "谢谢。您的反馈帮助我们为后来的每个人改进应用。", optional: "可选" },
};

function getLangKey(code: string): keyof typeof T {
  if (code.startsWith("es"))  return "es";
  if (code === "pt-BR")       return "ptBR";
  if (code === "fr")          return "fr";
  if (code === "ht")          return "ht";
  if (code === "zh-CN")       return "zhCN";
  return "en";
}

// ── Form state ────────────────────────────────────────────────────────────────
interface FormState {
  q1Ans: string; q1Text: string;   // Emotional — less anxious
  q2Ans: string; q2Text: string;   // Emotional — less alone
  q3Ans: string; q3Text: string;   // Ease of use
  q4Ans: string; q4Text: string;   // Clarity — easy to understand
  q5Text: string;                   // Clarity — confusing (free)
  q6Ans: string; q6Text: string;   // Trust
  q7Text: string;                   // Trust — concerns (free)
  q8Ans: string; q8Text: string;   // Real world — clinic question
  q9Text: string;                   // Real world — what question (free)
  q10Text: string;                  // Feature — most helpful (free)
  q11Text: string;                  // Feature — add (free)
  q12Text: string;                  // Developer (large)
}

const EMPTY: FormState = {
  q1Ans: "", q1Text: "", q2Ans: "", q2Text: "",
  q3Ans: "", q3Text: "", q4Ans: "", q4Text: "",
  q5Text: "", q6Ans: "", q6Text: "", q7Text: "",
  q8Ans: "", q8Text: "", q9Text: "", q10Text: "",
  q11Text: "", q12Text: "",
};

// ── Shared style atoms ────────────────────────────────────────────────────────
const baseTextareaStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 8,
  padding: "10px 14px",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 16,          // 16px prevents iOS zoom; globals.css also enforces this
  color: "rgba(255,255,255,0.85)",
  outline: "none",
  resize: "none",
  boxSizing: "border-box" as const,
  lineHeight: 1.6,
  display: "block",
};

// ── Sub-components ────────────────────────────────────────────────────────────
function AnsBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.07)",
        border: `1px solid ${active ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: 20,
        padding: "7px 18px",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        color: active ? "#fff" : "rgba(255,255,255,0.6)",
        cursor: "pointer",
        transition: "all 0.15s ease",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

// Expands smoothly when `show` is true — 200ms ease, never jumps
function ExpandField({ show, value, onChange, placeholder }: {
  show: boolean; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div style={{
      overflow: "hidden",
      maxHeight: show ? "80px" : "0",
      opacity: show ? 1 : 0,
      marginTop: show ? 8 : 0,
      transition: "max-height 200ms ease, opacity 200ms ease, margin-top 200ms ease",
    }}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={2}
        style={baseTextareaStyle}
      />
    </div>
  );
}

function FreeField({ value, onChange, placeholder, rows = 2 }: {
  value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{ ...baseTextareaStyle, marginBottom: 16 }}
    />
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.11em",
      textTransform: "uppercase" as const,
      color: "rgba(255,255,255,0.32)",
      padding: "12px 0 10px",
      borderTop: "1px solid rgba(255,255,255,0.07)",
      marginTop: 4,
    }}>
      {children}
    </div>
  );
}

function QLabel({ children }: { children: string }) {
  return (
    <p style={{
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 14,
      color: "rgba(255,255,255,0.8)",
      lineHeight: 1.55,
      margin: "0 0 10px 0",
    }}>
      {children}
    </p>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [langCode, setLangCode] = useState("en-US");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("companion_language") || "en-US";
    setLangCode(lang);
  }, []);

  const t = T[getLangKey(langCode)];
  const setF = (key: keyof FormState, val: string) => setForm(p => ({ ...p, [key]: val }));

  const openModal = () => {
    setForm(EMPTY);
    setSubmitted(false);
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const submit = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form,
          language: langCode,
          page: typeof window !== "undefined" ? window.location.pathname : "unknown",
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Email failure is silent — still show thanks
    }
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => { setOpen(false); setSubmitted(false); }, 3000);
  };

  // Pill row for answer choices
  const PillRow = ({ opts, active, setKey }: { opts: string[]; active: string; setKey: keyof FormState }) => (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 4 }}>
      {opts.map(opt => (
        <AnsBtn
          key={opt}
          label={opt}
          active={active === opt}
          onClick={() => setF(setKey, active === opt ? "" : opt)}
        />
      ))}
    </div>
  );

  return (
    <>
      {/* ── Fixed pill button bottom-left ── */}
      <style>{`
        @media (max-width: 767px) {
          .feedback-pill { bottom: 90px !important; left: 16px !important; }
        }
      `}</style>
      <button
        onClick={openModal}
        className="feedback-pill"
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          zIndex: 9998,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 20,
          padding: "8px 14px",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "var(--text, #E8F5E2)",
          cursor: "pointer",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: "0 2px 14px rgba(0,0,0,0.25)",
          transition: "opacity 0.2s",
        }}
      >
        <span>💬</span>
        <span>{t.btn}</span>
      </button>

      {/* ── Modal ── */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.78)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div style={{
            background: "var(--bg, #1A2E1E)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            width: "100%",
            maxWidth: 480,
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 28px 72px rgba(0,0,0,0.55)",
          }}>

            {/* Sticky header */}
            <div style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "18px 20px 14px",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}>
              <h2 style={{
                fontFamily: "'Lora', serif",
                fontSize: 18,
                fontWeight: 500,
                color: "var(--text, #E8F5E2)",
                margin: 0,
              }}>
                💬 {t.title}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: "50%",
                  width: 32, height: 32,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 15,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", padding: "16px 20px 4px" }}>

              {submitted ? (
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: "36px 16px", textAlign: "center", gap: 18,
                }}>
                  <div style={{ fontSize: 48 }}>💙</div>
                  <p style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 16,
                    color: "var(--text, #E8F5E2)",
                    lineHeight: 1.7,
                    margin: 0,
                  }}>
                    {t.thanks}
                  </p>
                </div>
              ) : (
                <>
                  {/* ── Section 1: Emotional Impact ── */}
                  <SectionLabel>Emotional Impact</SectionLabel>
                  <QLabel>Did the app help you feel less anxious or overwhelmed?</QLabel>
                  <PillRow opts={["Yes", "Somewhat", "No"]} active={form.q1Ans} setKey="q1Ans" />
                  <ExpandField show={!!form.q1Ans} value={form.q1Text} onChange={v => setF("q1Text", v)} placeholder={t.optional} />
                  <div style={{ marginBottom: 16 }} />

                  <QLabel>Did it help you feel less alone?</QLabel>
                  <PillRow opts={["Yes", "Somewhat", "No"]} active={form.q2Ans} setKey="q2Ans" />
                  <ExpandField show={!!form.q2Ans} value={form.q2Text} onChange={v => setF("q2Text", v)} placeholder={t.optional} />
                  <div style={{ marginBottom: 16 }} />

                  {/* ── Section 2: Ease of Use ── */}
                  <SectionLabel>Ease of Use</SectionLabel>
                  <QLabel>Did you find the app easy to use?</QLabel>
                  <PillRow opts={["Yes", "Somewhat", "No"]} active={form.q3Ans} setKey="q3Ans" />
                  <ExpandField show={!!form.q3Ans} value={form.q3Text} onChange={v => setF("q3Text", v)} placeholder={t.optional} />
                  <div style={{ marginBottom: 16 }} />

                  {/* ── Section 3: Clarity ── */}
                  <SectionLabel>Clarity</SectionLabel>
                  <QLabel>Was the information easy to understand?</QLabel>
                  <PillRow opts={["Yes", "Somewhat", "No"]} active={form.q4Ans} setKey="q4Ans" />
                  <ExpandField show={!!form.q4Ans} value={form.q4Text} onChange={v => setF("q4Text", v)} placeholder={t.optional} />
                  <div style={{ marginBottom: 16 }} />

                  <QLabel>Were any explanations confusing?</QLabel>
                  <FreeField value={form.q5Text} onChange={v => setF("q5Text", v)} placeholder={t.optional} />

                  {/* ── Section 4: Trust and Safety ── */}
                  <SectionLabel>Trust and Safety</SectionLabel>
                  <QLabel>Did you trust the information provided?</QLabel>
                  <PillRow opts={["Yes", "Mostly", "No"]} active={form.q6Ans} setKey="q6Ans" />
                  <ExpandField show={!!form.q6Ans} value={form.q6Text} onChange={v => setF("q6Text", v)} placeholder={t.optional} />
                  <div style={{ marginBottom: 16 }} />

                  <QLabel>Did anything feel inaccurate or concerning?</QLabel>
                  <FreeField value={form.q7Text} onChange={v => setF("q7Text", v)} placeholder={t.optional} />

                  {/* ── Section 5: Real World Helpfulness ── */}
                  <SectionLabel>Real World Helpfulness</SectionLabel>
                  <QLabel>Did the app answer a question you had after leaving the clinic?</QLabel>
                  <PillRow opts={["Yes", "No"]} active={form.q8Ans} setKey="q8Ans" />
                  <ExpandField show={!!form.q8Ans} value={form.q8Text} onChange={v => setF("q8Text", v)} placeholder={t.optional} />
                  <div style={{ marginBottom: 16 }} />

                  <QLabel>What question were you trying to answer?</QLabel>
                  <FreeField value={form.q9Text} onChange={v => setF("q9Text", v)} placeholder={t.optional} />

                  {/* ── Section 6: Feature Feedback ── */}
                  <SectionLabel>Feature Feedback</SectionLabel>
                  <QLabel>What feature did you find most helpful?</QLabel>
                  <FreeField value={form.q10Text} onChange={v => setF("q10Text", v)} placeholder={t.optional} />

                  <QLabel>What would you like to see added?</QLabel>
                  <FreeField value={form.q11Text} onChange={v => setF("q11Text", v)} placeholder={t.optional} />

                  {/* ── Section 7: Direct to Developer ── */}
                  <SectionLabel>Direct to Developer</SectionLabel>
                  <p style={{
                    fontFamily: "'Lora', serif",
                    fontSize: 15,
                    color: "var(--text, #E8F5E2)",
                    lineHeight: 1.7,
                    margin: "0 0 12px 0",
                  }}>
                    If you could speak directly to the developer of this app, what would you ask them to improve?
                  </p>
                  <FreeField
                    value={form.q12Text}
                    onChange={v => setF("q12Text", v)}
                    placeholder={t.optional}
                    rows={5}
                  />
                </>
              )}
            </div>

            {/* Sticky footer */}
            {!submitted && (
              <div style={{
                flexShrink: 0,
                padding: "12px 20px 20px",
                borderTop: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}>
                <button
                  onClick={submit}
                  disabled={submitting}
                  style={{
                    width: "100%",
                    background: "linear-gradient(135deg, var(--accent, #6BAF7A) 0%, color-mix(in srgb, var(--accent, #6BAF7A) 72%, #000) 100%)",
                    border: "none",
                    borderRadius: 12,
                    padding: "14px 20px",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#fff",
                    cursor: submitting ? "not-allowed" : "pointer",
                    opacity: submitting ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {submitting ? t.sending : t.submit}
                </button>
                <button
                  onClick={closeModal}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.32)",
                    cursor: "pointer",
                    padding: "6px 0",
                  }}
                >
                  {t.cancel}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
