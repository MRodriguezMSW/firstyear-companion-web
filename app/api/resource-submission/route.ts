import { Resend } from "resend";
import { NextResponse } from "next/server";

const TO_EMAIL = "modriguez0426@gmail.com";

function buildCorrectionText(f: Record<string, string>, timestamp: string): string {
  const date = new Date(timestamp).toLocaleString("en-US", {
    dateStyle: "full", timeStyle: "short", timeZone: "America/New_York",
  });
  const submitter = f.submitterName?.trim() || "Anonymous";
  const email = f.submitterEmail?.trim() || "(not provided)";
  return [
    `Resource Correction — ${f.state || "Unknown State"}`,
    "",
    `Date: ${date}`,
    "",
    `Resource Name: ${f.resourceName || "(not provided)"}`,
    `State: ${f.state || "(not provided)"}`,
    "",
    `What needs to be corrected:`,
    f.correction || "(not provided)",
    "",
    `Submitted by: ${submitter} (${email})`,
  ].join("\n");
}

function buildResourceText(f: Record<string, string>, timestamp: string): string {
  const date = new Date(timestamp).toLocaleString("en-US", {
    dateStyle: "full", timeStyle: "short", timeZone: "America/New_York",
  });
  const submitter = f.submitterName?.trim() || "Anonymous";
  const email = f.submitterEmail?.trim() || "(not provided)";
  return [
    `New Resource Submission — ${f.state || "Unknown State"}`,
    "",
    `Date: ${date}`,
    "",
    `Resource Name: ${f.resourceName || "(not provided)"}`,
    `Address: ${f.address || "(not provided)"}`,
    `City: ${f.city || "(not provided)"}`,
    `State: ${f.state || "(not provided)"}`,
    `Zip: ${f.zip || "(not provided)"}`,
    `Phone: ${f.phone?.trim() || "(not provided)"}`,
    `Fax: ${f.fax?.trim() || "(not provided)"}`,
    `Website: ${f.website?.trim() || "(not provided)"}`,
    `Resources Provided: ${f.description || "(not provided)"}`,
    "",
    `Submitted by: ${submitter} (${email})`,
  ].join("\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, fields, timestamp } = body;

    if (!type || !fields) {
      return NextResponse.json({ ok: false, error: "Missing type or fields" }, { status: 400 });
    }

    const isCorrection = type === "correction";
    const subject = isCorrection
      ? `Resource Correction — ${fields.state || "Unknown State"}`
      : `New Resource Submission — ${fields.state || "Unknown State"}`;
    const text = isCorrection
      ? buildCorrectionText(fields, timestamp || new Date().toISOString())
      : buildResourceText(fields, timestamp || new Date().toISOString());

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log(`[Resource Submission — no RESEND_API_KEY]\n`, text);
      return NextResponse.json({ ok: true, note: "logged_only" });
    }

    const resend = new Resend(apiKey);
    const replyTo = fields.submitterEmail?.trim() || undefined;
    const { data, error } = await resend.emails.send({
      from: "FirstYear Companion <onboarding@resend.dev>",
      to: [TO_EMAIL],
      ...(replyTo && { replyTo }),
      subject,
      text,
    });

    if (error) {
      console.error("[Resource submission email error]", JSON.stringify(error));
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err: any) {
    console.error("[Resource submission route error]", err?.message || err);
    return NextResponse.json({ ok: false, error: "Internal error" }, { status: 500 });
  }
}
