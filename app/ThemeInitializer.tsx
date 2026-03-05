"use client";
import { useEffect } from "react";

export default function ThemeInitializer() {
  useEffect(() => {
    const t = localStorage.getItem("companion_theme") || "forest";
    document.documentElement.setAttribute("data-theme", t);
  }, []);
  return null;
}
