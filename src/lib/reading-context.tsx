"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  saveReadingMode, loadReadingMode,
  saveFontSize, loadFontSize,
} from "@/lib/reading-store";

export type ReadingMode = "light" | "dark" | "sepia";

interface ReadingContextValue {
  mode: ReadingMode;
  setMode: (m: ReadingMode) => void;
  fontSize: number;
  setFontSize: (s: number) => void;
}

const ReadingContext = createContext<ReadingContextValue>({
  mode: "light",
  setMode: () => {},
  fontSize: 17,
  setFontSize: () => {},
});

export const useReading = () => useContext(ReadingContext);

export const ReadingProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ReadingMode>("light");
  const [fontSize, setFontSizeState] = useState(17);

  useEffect(() => {
    setModeState(loadReadingMode());
    setFontSizeState(loadFontSize());
  }, []);

  const setMode = (m: ReadingMode) => {
    setModeState(m);
    saveReadingMode(m);
  };

  const setFontSize = (s: number) => {
    setFontSizeState(s);
    saveFontSize(s);
  };

  // Apply mode class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("mode-dark", "mode-sepia");
    if (mode === "dark") root.classList.add("mode-dark");
    if (mode === "sepia") root.classList.add("mode-sepia");
  }, [mode]);

  return (
    <ReadingContext.Provider value={{ mode, setMode, fontSize, setFontSize }}>
      {children}
    </ReadingContext.Provider>
  );
};
