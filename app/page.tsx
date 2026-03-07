"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const skipWelcome = localStorage.getItem("firstyear_skip_welcome") === "true";
    const onboardingDone = localStorage.getItem("onboarding_complete") === "true";

    if (skipWelcome || onboardingDone) {
      router.replace("/chat");
    } else {
      router.replace("/onboarding/welcome");
    }
  }, [router]);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{ fontSize: 40 }}>🌱</div>
    </div>
  );
}
