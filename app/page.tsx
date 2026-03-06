"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const lang = localStorage.getItem("companion_language");
    router.replace(lang ? "/onboarding/welcome" : "/onboarding/language");
  }, []);
  return null;
}
