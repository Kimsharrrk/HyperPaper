import type { Metadata } from "next";
import "./globals.css";
import { ReadingProvider } from "@/lib/reading-context";

export const metadata: Metadata = {
  title: "HyperPaper | AI Contextual Research Reader (Pretext Engine)",
  description:
    "Zero-DOM-thrashing contextual paper reader powered by Cheng Lou's @chenglou/pretext engine. Dynamic concept wires, live operational definitions, and fluid sidenotes.",
  keywords: [
    "HyperPaper",
    "Pretext",
    "AI Paper Reader",
    "Cheng Lou",
    "Contextual Reading",
    "Wanted Hackathon",
    "Text Layout Engine",
    "Knowledge Graph",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-[100dvh] antialiased selection:bg-amber-200 selection:text-amber-950">
        <ReadingProvider>
          {children}
        </ReadingProvider>
      </body>
    </html>
  );
}
