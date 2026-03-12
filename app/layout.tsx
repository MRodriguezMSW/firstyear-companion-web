import "./globals.css";
import ThemeInitializer from "./ThemeInitializer";
import FeedbackButton from "./components/FeedbackButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap"
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
