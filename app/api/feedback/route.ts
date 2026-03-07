// Add RESEND_API_KEY to .env.local and Vercel environment variables. Get free key at resend.com

import { Resend } from "resend";
import { NextResponse } from "next/server";

function fmt(label: string, answer: string, text?: string): string {
  if (!answer) return `${label}: (not answered)`;
  // If text was typed, append it — otherwise show answer only (no dash per spec)
  if (text?.trim()) return `${label}: ${answer} — '${text.trim()}'`;
  return `${label}: ${answer}`;
}

function free(label: string, text: string): string {
  return `${label}: ${text?.trim() || "(blank)"}`;
}

function buildEmailText(body: {
  form: Record<string, string>;
  language: string;
  page: string;
  timestamp: string;
}): string {
  const { form: f, language, page, timestamp } = body;
  const date = new Date(timestamp).toLocaleString("en-US", {
    dateStyle: "full", timeStyle: "short", timeZone: "America/New_York",
  });

  return [
    "New feedback submitted",
    "",
    `Date: ${date}`,
    `Language: ${language}`,
    `Screen submitted from: ${page}`,
    "",
    "────────────────────────────────────",
    "",
    "EMOTIONAL IMPACT:",
    fmt("Less anxious or overwhelmed", f.q1Ans, f.q1Text),
    fmt("Felt less alone", f.q2Ans, f.q2Text),
    "",
    "EASE OF USE:",
    fmt("Easy to use", f.q3Ans, f.q3Text),
    "",
    "CLARITY:",
    fmt("Easy to understand", f.q4Ans, f.q4Text),
    free("Confusing explanations", f.q5Text),
    "",
    "TRUST AND SAFETY:",
    fmt("Trusted information", f.q6Ans, f.q6Text),
    free("Concerns or inaccuracies", f.q7Text),
    "",
    "REAL WORLD HELPFULNESS:",
    fmt("Answered clinic question", f.q8Ans, f.q8Text),
    free("Question they were trying to answer", f.q9Text),
    "",
    "FEATURE FEEDBACK:",
    free("Most helpful feature", f.q10Text),
    free("Suggested addition", f.q11Text),
    "",
    "DIRECT TO DEVELOPER:",
    f.q12Text?.trim() || "(blank)",
    "",
    "────────────────────────────────────",
    "Sent from FirstYear Companion beta",
  ].join("\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const emailText = buildEmailText(body);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // No key configured — log the feedback to console so it isn't silently lost
      console.log("[Feedback received — no RESEND_API_KEY configured]\n", emailText);
      return NextResponse.json({ ok: true, note: "logged_only" });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "FirstYear Companion <onboarding@resend.dev>",
      to: ["Mrodriguez0426@gmail.com"],
      subject: "FirstYear Companion — New Feedback Received",
      text: emailText,
    });

    if (error) {
      console.error("[Feedback email error]", error);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[Feedback route error]", err?.message || err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
