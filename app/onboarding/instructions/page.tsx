"use client";

import { useRouter } from "next/navigation";

export default function InstructionsPage() {
  const router = useRouter();

  return (
    <div className="fyc-root">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="fyc-card">
        <div className="fyc-welcome-icon">🌱</div>
        <p className="fyc-eyebrow">You're almost there</p>
        <h1>Meet your AI Buddy</h1>

        <p style={{ fontSize: 14, color: "rgba(245,237,224,0.6)", lineHeight: 1.7, marginBottom: 16 }}>
          When you enter the chat, a few tiles will appear to help you get started — no pressure to use them.
          Tap one or more that feel right. After a few seconds your Buddy will respond.
        </p>
        <p style={{ fontSize: 14, color: "rgba(245,237,224,0.6)", lineHeight: 1.7, marginBottom: 16 }}>
          Or just type whatever's on your mind — whatever feels easiest.
        </p>
        <p style={{ fontSize: 15, color: "#f5ede0", fontWeight: 500, marginBottom: 36 }}>
          You're in control here.
        </p>

        <button className="fyc-btn-next fyc-btn-next-full" onClick={() => router.push("/chat")}>
          Let's go
        </button>
      </div>
    </div>
  );
}
