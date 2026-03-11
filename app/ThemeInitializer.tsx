"use client";
import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    const t = localStorage.getItem("companion_theme") || "calm-sea";
    document.documentElement.setAttribute("data-theme", t);
  }, []);
  return null;
}
