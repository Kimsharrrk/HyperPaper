"use client";

import React, { useEffect, useState } from "react";
import { PaperDocument } from "@/lib/types";
import { useReading } from "@/lib/reading-context";
import { Minus, Plus } from "lucide-react";

interface SidebarProps {
  paper: PaperDocument;
  activeConceptId: string | null;
  onSectionClick: (id: string) => void;
  onSelectConcept: (id: string | null) => void;
  readingSession: number;
  onNewSession: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ paper, activeConceptId, onSectionClick, onSelectConcept, readingSession, onNewSession }) => {
  const [activeSection, setActiveSection] = useState<string>(paper.sections[0]?.id);
  const { fontSize, setFontSize } = useReading();

  const SESSION_COLORS = ["", "text-sky-600", "text-emerald-600", "text-amber-600", "text-rose-600"];
  const SESSION_LABELS = ["", "1회독 · 흐름 파악", "2회독 · 개념 정리", "3회독 · 심화 이해", "4회독 · 완전 습득"];
  const sessionColor = SESSION_COLORS[Math.min(readingSession, 4)] || "text-indigo-600";
  const sessionLabel = SESSION_LABELS[Math.min(readingSession, 4)] || `${readingSession}회독`;

  // Track scroll position to update active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = paper.sections.map(s => document.getElementById(s.id));
      let current = paper.sections[0]?.id;
      
      for (const section of sections) {
        if (section) {
          const rect = section.getBoundingClientRect();
          // If the section top is above the middle of the viewport
          if (rect.top <= window.innerHeight / 2) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [paper.sections]);

  // Find all sections where the active concept is present
  const sectionsWithConcept = new Set<string>();
  if (activeConceptId) {
    const concept = paper.concepts.find(c => c.id === activeConceptId);
    if (concept) {
       paper.sections.forEach(sec => {
          const text = sec.content.join(" ").toLowerCase();
          const hasMatch = text.includes(concept.name.toLowerCase()) || 
                           concept.aliases.some(a => text.includes(a.toLowerCase()));
          if (hasMatch) {
             sectionsWithConcept.add(sec.id);
          }
       });
    }
  }

  return (
    <aside className="w-64 shrink-0 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto border-r border-neutral-100 bg-[#fcfbf9]/80 backdrop-blur py-8 pl-6 pr-4 hidden lg:block scrollbar-hide">
      <div className="mb-6">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 mb-1">Outline</h3>
        <div className="h-0.5 w-8 bg-indigo-500/20 rounded-full"></div>
      </div>
      
      <nav className="space-y-1 pb-8">
        {paper.sections.map((section) => {
          const isActive = activeSection === section.id;
          const hasConcept = sectionsWithConcept.has(section.id);
          
          return (
            <button
              key={section.id}
              onClick={() => onSectionClick(section.id)}
              className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive ? "bg-white shadow-sm ring-1 ring-neutral-200/60" : "hover:bg-neutral-100/50"
              }`}
            >
              <span className={`text-[10px] font-mono font-bold mt-1 shrink-0 ${
                isActive ? "text-indigo-600" : "text-neutral-400 group-hover:text-neutral-500"
              }`}>
                §{section.number}
              </span>
              
              <div className="flex-1">
                <span className={`block text-[13px] font-medium leading-snug ${
                  isActive ? "text-neutral-900" : "text-neutral-500 group-hover:text-neutral-700"
                }`}>
                  {section.title}
                </span>
                
                {hasConcept && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <span className="text-[10px] font-medium text-indigo-600">Concept appears here</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      <div className="mb-6 mt-4">
        <h3 className="text-[11px] font-bold tracking-widest uppercase text-neutral-400 mb-1">Core Concepts</h3>
        <div className="h-0.5 w-8 bg-pink-500/20 rounded-full mb-4"></div>
        <div className="flex flex-wrap gap-1.5 pb-28">
          {paper.concepts.map(concept => {
            const isLong = concept.name.length > 22;
            const shortName = isLong ? concept.name.slice(0, 20) + "..." : concept.name;
            const isSelected = activeConceptId === concept.id;
            return (
              <button
                key={concept.id}
                title={`${concept.name}${concept.koreanMeaning ? ` (${concept.koreanMeaning})` : ''}`}
                onClick={() => onSelectConcept(isSelected ? null : concept.id)}
                className={`text-[11px] font-medium px-2 py-1 rounded-lg border transition-all flex items-center gap-1.5 max-w-full ${
                  isSelected
                    ? "bg-neutral-900 text-white border-neutral-900 shadow-2xs font-medium"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50"
                }`}
              >
                <span 
                  className="w-1.5 h-1.5 rounded-full shrink-0" 
                  style={{ backgroundColor: isSelected ? "white" : concept.color }}
                />
                <span className="truncate">{shortName}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="fixed bottom-6 left-6 w-[208px] p-3 rounded-xl bg-white/90 border border-neutral-200/80 shadow-sm backdrop-blur-md">
        <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Text Size</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setFontSize(Math.max(13, fontSize - 1))} className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors text-neutral-600">
            <Minus className="w-3 h-3" />
          </button>
          <span className="flex-1 text-center text-xs font-mono font-medium text-neutral-700">{fontSize}px</span>
          <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} className="w-7 h-7 flex items-center justify-center rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors text-neutral-600">
            <Plus className="w-3 h-3" />
          </button>
        </div>
        <div className="h-px bg-neutral-200 my-2.5" />

        {/* Stats */}
        <div className="flex justify-between text-[11px] text-neutral-400 font-mono">
          <span>{paper.readingTimeMinutes} min read</span>
          <span>{paper.concepts.length} concepts</span>
        </div>
      </div>
    </aside>
  );
};
