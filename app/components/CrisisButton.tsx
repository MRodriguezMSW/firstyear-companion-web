"use client";

import { useState } from "react";

const RESOURCES = [
  { name: "988 Suicide and Crisis Lifeline", action: "Call or text 988", call: "988", text: "988", textMsg: "" },
  { name: "Crisis Text Line", action: "Text HOME to 741741", call: "", text: "741741", textMsg: "HOME" },
  { name: "Trevor Project (LGBTQ+)", action: "Call 1-866-488-7386 or text START to 678-678", call: "18664887386", text: "678678", textMsg: "START" },
  { name: "Trans Lifeline", action: "877-565-8860", call: "8775658860", text: "", textMsg: "" },
  { name: "SAMHSA Helpline", action: "1-800-662-4357", call: "18006624357", text: "", textMsg: "" },
  { name: "Local Emergency Services", action: "911", call: "911", text: "", textMsg: "" },
];

export default function CrisisButton({ pulsing = false }: { pulsing?: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Crisis resources"
        style={{
          position: "fixed", bottom: 20, right: 20, zIndex: 9999,
          width: 48, height: 48, borderRadius: "50%",
          background: "rgba(220,38,38,0.9)",
          border: "2px solid rgba(255,255,255,0.25)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, cursor: "pointer", padding: 0,
          boxShadow: "0 4px 20px rgba(220,38,38,0.45)",
          animation: pulsing ? "crisisPulse 1.4s ease-in-out infinite" : "none",
        }}
      >
        📞
      </button>

      {open && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 10000,
            background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)",
            display: "flex", flexDirection: "column", overflow: "hidden",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{
            flex: 1, overflowY: "auto", overscrollBehavior: "none",
            padding: "28px 20px 40px",
            maxWidth: 480, width: "100%", margin: "0 auto",
          }}>
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: "absolute", top: 20, right: 20,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "50%", width: 36, height: 36,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(245,237,224,0.7)", fontSize: 16, cursor: "pointer",
              }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>❤️</div>
              <h2 style={{
                fontFamily: "Lora, serif", fontSize: 22, fontWeight: 500,
                color: "#f5ede0", marginBottom: 8, lineHeight: 1.3,
              }}>
                You are not alone.
              </h2>
              <p style={{ fontSize: 15, color: "rgba(245,237,224,0.7)", lineHeight: 1.65 }}>
                Help is available right now. Reach out — you deserve support.
              </p>
            </div>

            {/* Resources */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {RESOURCES.map((r) => (
                <div
                  key={r.name}
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14, padding: "14px 16px",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#f5ede0", marginBottom: 3 }}>
                    {r.name}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(245,237,224,0.5)", marginBottom: 10 }}>
                    {r.action}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {r.call && (
                      <a
                        href={`tel:${r.call}`}
                        style={{
                          flex: 1, textAlign: "center", padding: "9px 12px",
                          background: "rgba(220,38,38,0.2)", border: "1px solid rgba(220,38,38,0.4)",
                          borderRadius: 10, color: "#fca5a5", fontSize: 12, fontWeight: 500,
                          textDecoration: "none", fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        📞 Call
                      </a>
                    )}
                    {r.text && (
                      <a
                        href={`sms:${r.text}${r.textMsg ? `&body=${encodeURIComponent(r.textMsg)}` : ""}`}
                        style={{
                          flex: 1, textAlign: "center", padding: "9px 12px",
                          background: "rgba(74,124,111,0.2)", border: "1px solid rgba(74,124,111,0.4)",
                          borderRadius: 10, color: "#8ecfbe", fontSize: 12, fontWeight: 500,
                          textDecoration: "none", fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        💬 Text
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, color: "rgba(245,237,224,0.25)", textAlign: "center", marginTop: 24, lineHeight: 1.6 }}>
              Tap outside or ✕ to close. This button is always available.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes crisisPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.7), 0 4px 20px rgba(220,38,38,0.4); }
          50%       { box-shadow: 0 0 0 14px rgba(220,38,38,0), 0 4px 24px rgba(220,38,38,0.7); }
        }
      `}</style>
    </>
  );
}
