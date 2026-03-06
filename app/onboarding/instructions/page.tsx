"use client";

import { useRouter } from "next/navigation";
import CrisisButton from "../../components/CrisisButton";

const SCREEN: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  overflow: "hidden", padding: "16px",
  fontFamily: "'DM Sans', sans-serif",
};
const CONTENT: React.CSSProperties = {
  width: "100%", maxWidth: 480, position: "relative", zIndex: 1,
};
const CARD: React.CSSProperties = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 24,
  padding: 32,
};

export default function InstructionsPage() {
  const router = useRouter();

  return (
    <div style={SCREEN}>
      <div style={CONTENT}>
        <div style={CARD}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c4956a", marginBottom: 6 }}>
            You're almost there
          </p>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 22, fontWeight: 500, color: "#f5ede0", lineHeight: 1.35, marginBottom: 16 }}>
            Meet your AI Buddy
          </h1>
          <p style={{ fontSize: 14, color: "rgba(245,237,224,0.6)", lineHeight: 1.7, marginBottom: 16 }}>
            When you enter the chat, a few tiles will appear to help you get started — no pressure to use them.
            Tap one or more that feel right. After a few seconds your Buddy will respond.
          </p>
          <p style={{ fontSize: 14, color: "rgba(245,237,224,0.6)", lineHeight: 1.7, marginBottom: 16 }}>
            Or just type whatever's on your mind — whatever feels easiest.
          </p>
          <p style={{ fontSize: 15, color: "#f5ede0", fontWeight: 500, marginBottom: 32 }}>
            You're in control here.
          </p>
          <button
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #c4956a 0%, #a87a52 100%)",
              border: "none", borderRadius: 12, padding: "15px 24px",
              color: "#fff", fontFamily: "'DM Sans', sans-serif",
              fontSize: 15, fontWeight: 500, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(196,149,106,0.3)",
            }}
            onClick={() => router.push("/chat")}
          >
            Let's go
          </button>
        </div>
      </div>

      <CrisisButton />
    </div>
  );
}
