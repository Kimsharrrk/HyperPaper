"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, Sun, Moon, BookMarked, Minus, Plus, Upload } from "lucide-react";
import { PaperDocument } from "@/lib/types";
import { useReading } from "@/lib/reading-context";
import type { ReadingMode } from "@/lib/reading-context";

interface HeaderProps {
  papers: PaperDocument[];
  currentPaperId: string;
  onSelectPaper: (id: string) => void;
  onUploadComplete?: (paper: PaperDocument) => void;
  isUploading: boolean;
  onUploadStart: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  papers,
  currentPaperId,
  onSelectPaper,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showPrototypeToast, setShowPrototypeToast] = useState(false);
  const { mode, setMode, fontSize, setFontSize } = useReading();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = (totalScroll / windowHeight) * 100;
      setScrollProgress(isNaN(scroll) ? 0 : scroll);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUploadClick = () => {
    setShowPrototypeToast(true);
    setTimeout(() => setShowPrototypeToast(false), 3500);
  };

  const modes: { id: ReadingMode; icon: React.ReactNode; label: string }[] = [
    { id: "light", icon: <Sun className="w-3.5 h-3.5" />, label: "Light" },
    { id: "dark",  icon: <Moon className="w-3.5 h-3.5" />, label: "Dark" },
    { id: "sepia", icon: <BookMarked className="w-3.5 h-3.5" />, label: "Sepia" },
  ];

  return (
    <>
      {/* Prototype Toast */}
      {showPrototypeToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-3 bg-neutral-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-neutral-700/50 max-w-[340px]">
            <div className="text-2xl shrink-0">🚧</div>
            <div>
              <div className="font-bold text-sm mb-1">프로토타입 버전입니다</div>
              <div className="text-neutral-300 text-xs leading-relaxed">
                실제 논문 업로드 기능은 현재 개발 중입니다.<br/>
                아래 데모 논문들로 모든 기능을 체험해보세요!
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 bg-[#fcfbf9]/95 backdrop-blur-md transition-all relative">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-neutral-900 text-amber-100 shadow-sm border border-neutral-800">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold tracking-tight text-neutral-900">
                HyperPaper
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-150/80 text-neutral-600 border border-neutral-200 font-medium hidden sm:inline-block">
                Research Edition
              </span>
            </div>
          </div>
        </div>

        {/* Paper Selector Tabs */}
        <div className="hidden md:flex items-center bg-neutral-100/90 p-1 rounded-xl border border-neutral-200/70 text-xs font-medium overflow-x-auto max-w-[360px]">
          {papers.map((p) => {
            const isSelected = p.id === currentPaperId;
            return (
              <button
                key={p.id}
                onClick={() => onSelectPaper(p.id)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? "bg-white text-indigo-700 shadow-sm ring-1 ring-neutral-200/50"
                    : "text-neutral-500 hover:text-neutral-800 hover:bg-neutral-200/50"
                }`}
              >
                <span className="truncate max-w-[100px]">{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Font Size */}
          <div className="hidden lg:flex items-center gap-1 bg-neutral-100/80 rounded-lg border border-neutral-200/60 px-1.5 py-1">
            <button
              onClick={() => setFontSize(Math.max(13, fontSize - 1))}
              className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-900 rounded transition-colors"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[11px] font-mono text-neutral-600 w-6 text-center">{fontSize}</span>
            <button
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
              className="w-6 h-6 flex items-center justify-center text-neutral-500 hover:text-neutral-900 rounded transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Reading Mode */}
          <div className="hidden lg:flex items-center bg-neutral-100/80 rounded-lg border border-neutral-200/60 p-0.5 gap-0.5">
            {modes.map(({ id, icon, label }) => (
              <button
                key={id}
                title={label}
                onClick={() => setMode(id)}
                className={`w-7 h-7 flex items-center justify-center rounded-md transition-all ${
                  mode === id
                    ? "bg-white shadow-sm text-indigo-700"
                    : "text-neutral-400 hover:text-neutral-700"
                }`}
              >
                {icon}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-neutral-300 hidden lg:block" />

          {/* Upload - Prototype Notice */}
          <button
            onClick={handleUploadClick}
            className="px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all flex items-center gap-2 bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95 shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Paper
          </button>
        </div>
      </div>

      {/* Reading Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-200/50">
        <div
          className="h-full bg-neutral-800 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </header>
    </>
  );
};
