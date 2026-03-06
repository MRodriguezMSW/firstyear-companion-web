"use client";

import { useState, useEffect } from "react";
import { getStrings, readLang } from "../i18n";

export default function CrisisButton({ pulsing = false }: { pulsing?: boolean }) {
  const [open, setOpen] = useState(false);
  const [flashDismissed, setFlashDismissed] = useState(false);
  const [t, setT] = useState(() => getStrings("en-US"));

  useEffect(() => { setT(getStrings(readLang())); }, []);

  // Reset dismissed state when pulsing stops
  useEffect(() => {
    if (!pulsing) setFlashDismissed(false);
  }, [pulsing]);

  const isFlashing = pulsing && !flashDismissed;

  const handleCalm = () => {
    setFlashDismissed(true);
  };

  return (
    <>
      {/* Fixed bottom-right: "I am okay" above + phone icon below */}
      <div style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 9999,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
      }}>
        {isFlashing && (
          <button
            onClick={handleCalm}
            style={{
              background: "#4CAF50",
              border: "none",
              borderRadius: 14,
              padding: "14px 20px",
              minHeight: 48,
              color: "#fff",
              fontFamily: "DM Sans, sans-serif",
              fontSize: 14, fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(76,175,80,0.5)",
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
            }}
          >
            ✓ {t.crisis_calm}
          </button>
        )}

        {/* Sonar rings — only visible when flashing */}
        {isFlashing && (
          <div style={{ position: "relative", width: 100, height: 100, flexShrink: 0 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "rgba(255,0,0,0.4)",
              animation: "sonarRing1 1s ease-out infinite",
            }} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              background: "rgba(255,0,0,0.3)",
              animation: "sonarRing2 1s ease-out infinite 0.4s",
            }} />
            <button
              onClick={() => setOpen(true)}
              aria-label="Crisis resources"
              style={{
                position: "absolute", inset: 0,
                borderRadius: "50%",
                background: "#FF0000",
                border: "2px solid rgba(255,255,255,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 36,
                cursor: "pointer", padding: 0,
                boxShadow: "0 0 40px rgba(255,0,0,0.9)",
                filter: "drop-shadow(0 0 20px rgba(255,0,0,1))",
                animation: "phoneShake 0.5s infinite",
              }}
            >
              📞
            </button>
          </div>
        )}

        {!isFlashing && (
          <button
            onClick={() => setOpen(true)}
            aria-label="Crisis resources"
            style={{
              width: 56, height: 56,
              borderRadius: "50%",
              background: "#FF6B6B",
              border: "2px solid rgba(255,255,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22,
              cursor: "pointer", padding: 0,
              boxShadow: "0 4px 20px rgba(255,107,107,0.5)",
              animation: pulsing ? "crisisPulse 1.4s ease-in-out infinite" : "none",
            }}
          >
            📞
          </button>
        )}
      </div>

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
                {t.crisis_title}
              </h2>
              <p style={{ fontSize: 15, color: "rgba(245,237,224,0.7)", lineHeight: 1.65 }}>
                {t.crisis_sub}
              </p>
            </div>

            {/* Resources */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {t.crisis_resources.map((r) => (
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
                          background: "rgba(255,107,107,0.18)", border: "1px solid rgba(255,107,107,0.4)",
                          borderRadius: 10, color: "#fca5a5", fontSize: 12, fontWeight: 500,
                          textDecoration: "none", fontFamily: "DM Sans, sans-serif",
                        }}
                      >
                        {t.crisis_call}
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
                        {t.crisis_text}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 11, color: "rgba(245,237,224,0.25)", textAlign: "center", marginTop: 8, lineHeight: 1.6 }}>
              {t.crisis_close_hint}
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes crisisPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.7), 0 4px 20px rgba(255,107,107,0.4); }
          50%       { box-shadow: 0 0 0 14px rgba(255,107,107,0), 0 4px 24px rgba(255,107,107,0.7); }
        }
        @keyframes phoneShake {
          0%,100% { transform: rotate(0deg) scale(1.8); }
          10%     { transform: rotate(-15deg) scale(1.8); }
          20%     { transform: rotate(15deg) scale(1.8); }
          30%     { transform: rotate(-15deg) scale(1.8); }
          40%     { transform: rotate(15deg) scale(1.8); }
          50%     { transform: rotate(-10deg) scale(1.8); }
          60%     { transform: rotate(10deg) scale(1.8); }
        }
        @keyframes sonarRing1 {
          0%   { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        @keyframes sonarRing2 {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </>
  );
}
