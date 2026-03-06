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
      {/* Fixed bottom-right: "I am okay" button + phone icon */}
      <div style={{
        position: "fixed", bottom: 20, right: 20, zIndex: 9999,
        display: "flex", alignItems: "center", gap: 10,
      }}>
        {isFlashing && (
          <button
            onClick={handleCalm}
            style={{
              background: "rgba(74,124,111,0.95)",
              border: "1px solid rgba(74,124,111,0.6)",
              borderRadius: 20,
              padding: "10px 16px",
              color: "#fff",
              fontFamily: "DM Sans, sans-serif",
              fontSize: 13, fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            ✓ {t.crisis_calm}
          </button>
        )}

        <button
          onClick={() => setOpen(true)}
          aria-label="Crisis resources"
          style={{
            width: isFlashing ? 80 : 48,
            height: isFlashing ? 80 : 48,
            borderRadius: "50%",
            background: "#FF6B6B",
            border: "2px solid rgba(255,255,255,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: isFlashing ? 32 : 20,
            cursor: "pointer", padding: 0,
            boxShadow: "0 4px 20px rgba(255,107,107,0.5)",
            transition: "width 0.3s ease, height 0.3s ease, font-size 0.3s ease",
            animation: isFlashing
              ? "crisisFlash 0.5s ease-in-out infinite"
              : pulsing
              ? "crisisPulse 1.4s ease-in-out infinite"
              : "none",
          }}
        >
          📞
        </button>
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
        @keyframes crisisFlash {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.9), 0 4px 20px rgba(255,107,107,0.6); opacity: 1; }
          50%       { box-shadow: 0 0 0 26px rgba(255,107,107,0), 0 4px 30px rgba(255,107,107,0.9); opacity: 0.7; }
        }
      `}</style>
    </>
  );
}
