import "./globals.css";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import ThemeInitializer from "./ThemeInitializer";
import FeedbackButton from "./components/FeedbackButton";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content"
        />
        {/* Lora & DM Sans for other pages */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ minHeight: "100%", width: "100%", display: "flex", flexDirection: "column", backgroundColor: "var(--bg)", color: "var(--text)" }}>
        <ThemeInitializer />
        {children}
        <FeedbackButton />
      </body>
    </html>
  );
}
