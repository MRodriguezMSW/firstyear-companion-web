"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function LandingPage() {
  const router = useRouter();
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.12 }
    );
    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const addSection = (el: HTMLDivElement | null, i: number) => {
    if (el) sectionsRef.current[i] = el;
  };

  const handleStart = () => {
    router.push("/onboarding/language");
  };

  const sectionStyle: React.CSSProperties = {
    opacity: 0,
    transform: "translateY(24px)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflowY: "auto",
        overflowX: "hidden",
        background: "#1A2E1E",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {/* Ambient orbs */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: -120,
          left: -120,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(107,175,122,.14) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "orbDrift1 14s ease-in-out infinite alternate",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(60,130,80,.10) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "orbDrift2 18s ease-in-out infinite alternate",
        }}
      />

      <style>{`
        @keyframes orbDrift1 { from { transform: translate(0,0); } to { transform: translate(40px,30px); } }
        @keyframes orbDrift2 { from { transform: translate(0,0); } to { transform: translate(-30px,-40px); } }
        @keyframes pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(107,175,122,0); } 50% { box-shadow: 0 0 0 8px rgba(107,175,122,0.12); } }
        .landing-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(107,175,122,0.35) !important; }
        .landing-btn:active { transform: translateY(0); }
      `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 680,
          margin: "0 auto",
          padding: "0 24px 80px",
        }}
      >
        {/* Header */}
        <header
          ref={(el) => addSection(el as HTMLDivElement, 0)}
          style={{
            ...sectionStyle,
            textAlign: "center",
            paddingTop: 72,
            paddingBottom: 56,
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              background: "rgba(107,175,122,0.15)",
              border: "1.5px solid rgba(107,175,122,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              fontSize: 34,
            }}
          >
            🌱
          </div>

          <h1
            style={{
              fontFamily: "'Lora', serif",
              fontSize: "clamp(26px, 6vw, 38px)",
              fontWeight: 500,
              color: "#E8F5E2",
              margin: "0 0 14px",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
            }}
          >
            FirstYear Companion
          </h1>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 17,
              color: "rgba(232,245,226,0.55)",
              margin: 0,
              fontWeight: 300,
              letterSpacing: "0.01em",
            }}
          >
            You are not alone in this.
          </p>
        </header>

        {/* Section 1 — What the app is */}
        <section
          ref={(el) => addSection(el as HTMLDivElement, 1)}
          style={{
            ...sectionStyle,
            transitionDelay: "0.1s",
            background: "rgba(232,245,226,0.04)",
            border: "1px solid rgba(232,245,226,0.08)",
            borderRadius: 20,
            padding: "32px 32px",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 20,
              fontWeight: 500,
              color: "#E8F5E2",
              marginBottom: 14,
              lineHeight: 1.35,
            }}
          >
            What is FirstYear Companion?
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "rgba(232,245,226,0.65)",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            FirstYear Companion is a free AI-powered wellness app designed specifically for people who have just been diagnosed with HIV. The first year after diagnosis can feel overwhelming — full of questions, fear, and uncertainty. This app exists to walk alongside you during that journey. Whether it is 2am and you cannot sleep, or you just left a doctor&apos;s appointment and do not know what to do next — we are here. No judgment. No stigma. Just support.
          </p>
        </section>

        {/* Section 2 — Nova */}
        <section
          ref={(el) => addSection(el as HTMLDivElement, 2)}
          style={{
            ...sectionStyle,
            transitionDelay: "0.15s",
            background: "rgba(232,245,226,0.04)",
            border: "1px solid rgba(232,245,226,0.08)",
            borderRadius: 20,
            padding: "32px 32px",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 20,
              fontWeight: 500,
              color: "#E8F5E2",
              marginBottom: 14,
              lineHeight: 1.35,
            }}
          >
            Meet your companion
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "rgba(232,245,226,0.65)",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Nova is your personal AI wellness companion. She is not a doctor or a therapist — but she is trained to listen with care, answer your questions honestly, and support you through the emotional and practical challenges of your first year. She knows about HIV treatment, undetectable viral loads, stigma, relationships, medications, and most importantly — she knows how to be present with you when things feel hard. You can talk to her anytime, about anything.
          </p>
        </section>

        {/* Section 3 — Privacy */}
        <section
          ref={(el) => addSection(el as HTMLDivElement, 3)}
          style={{
            ...sectionStyle,
            transitionDelay: "0.2s",
            background: "rgba(107,175,122,0.07)",
            border: "1px solid rgba(107,175,122,0.2)",
            borderRadius: 20,
            padding: "32px 32px",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 20,
              fontWeight: 500,
              color: "#E8F5E2",
              marginBottom: 14,
              lineHeight: 1.35,
            }}
          >
            🔒 Your privacy is protected
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "rgba(232,245,226,0.65)",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            Everything you share in this app is private and confidential. No names, no photos, no identifying information is required to use this app. Your conversations are not shared with anyone. This is your safe space.
          </p>
        </section>

        {/* Section 4 — Beta */}
        <section
          ref={(el) => addSection(el as HTMLDivElement, 4)}
          style={{
            ...sectionStyle,
            transitionDelay: "0.25s",
            background: "rgba(232,245,226,0.04)",
            border: "1px solid rgba(232,245,226,0.08)",
            borderRadius: 20,
            padding: "32px 32px",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 20,
              fontWeight: 500,
              color: "#E8F5E2",
              marginBottom: 14,
              lineHeight: 1.35,
            }}
          >
            🧪 This app is in beta — your voice matters
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "rgba(232,245,226,0.65)",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            FirstYear Companion is still being built. Every conversation, every piece of feedback, and every suggestion from real users shapes what this app becomes. You are not just a user — you are a co-creator. When something does not feel right, when Nova says something that misses the mark, or when you wish something existed that does not yet — tell us. That feedback button exists for a reason. Your experience will make this better for every person who comes after you.
          </p>
        </section>

        {/* Section 5 — Creator */}
        <section
          ref={(el) => addSection(el as HTMLDivElement, 5)}
          style={{
            ...sectionStyle,
            transitionDelay: "0.3s",
            background: "rgba(107,175,122,0.07)",
            border: "1px solid rgba(107,175,122,0.2)",
            borderRadius: 20,
            padding: "32px 32px",
            marginBottom: 48,
          }}
        >
          <h2
            style={{
              fontFamily: "'Lora', serif",
              fontSize: 20,
              fontWeight: 500,
              color: "#E8F5E2",
              marginBottom: 14,
              lineHeight: 1.35,
            }}
          >
            Built with purpose
          </h2>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 15,
              color: "rgba(232,245,226,0.65)",
              lineHeight: 1.75,
              margin: 0,
            }}
          >
            FirstYear Companion was created by a social worker who works directly with people living with HIV. This app was born from real clinical experience, real patient stories, and a deep belief that technology should serve the most vulnerable — not the other way around. This is personal. And that is exactly why it matters.
          </p>
        </section>

        {/* CTA */}
        <div
          ref={(el) => addSection(el as HTMLDivElement, 6)}
          style={{
            ...sectionStyle,
            transitionDelay: "0.35s",
            textAlign: "center",
          }}
        >
          <button
            className="landing-btn"
            onClick={handleStart}
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #6BAF7A 0%, #50946A 100%)",
              border: "none",
              borderRadius: 16,
              padding: "18px 48px",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 17,
              fontWeight: 500,
              color: "#fff",
              cursor: "pointer",
              letterSpacing: "0.01em",
              boxShadow: "0 6px 28px rgba(107,175,122,0.25)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              marginBottom: 20,
              animation: "pulse 3s ease-in-out infinite",
            }}
          >
            Let&apos;s get started →
          </button>

          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              color: "rgba(232,245,226,0.3)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            🧪 Beta version — Not a clinical tool. Does not replace medical advice or professional care.
          </p>
        </div>
      </div>
    </div>
  );
}
