"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ReaderCanvas } from "@/components/ReaderCanvas";
import { SelectionTooltip } from "@/components/SelectionTooltip";
import { PAPER_PRESETS } from "@/lib/paper-presets";
import { PaperDocument, PretextBenchmark, ConceptEntity } from "@/lib/types";
import {
  saveLastPosition, loadLastPosition,
  saveReadingSession, loadReadingSession,
} from "@/lib/reading-store";

export default function HyperPaperApp() {
  const [papers, setPapers] = useState<PaperDocument[]>(PAPER_PRESETS);
  const [currentPaperId, setCurrentPaperId] = useState<string>(PAPER_PRESETS[0].id);
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [readingSession, setReadingSession] = useState(1);
  const scrollSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [benchmark, setBenchmark] = useState<PretextBenchmark>({
    layoutTimeMs: 0.0,
    lineCount: 0,
    characterCount: 0,
    domReflowsAvoided: 0,
    estimatedDomMs: 0.0,
  });

  const currentPaper = papers.find((p) => p.id === currentPaperId) || papers[0];

  // Restore last reading position on mount
  useEffect(() => {
    const { paperId, scrollY } = loadLastPosition();
    if (paperId) {
      const exists = papers.find(p => p.id === paperId);
      if (exists) {
        setCurrentPaperId(paperId);
        setTimeout(() => window.scrollTo({ top: scrollY, behavior: "smooth" }), 300);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore reading session when paper changes
  useEffect(() => {
    setReadingSession(loadReadingSession(currentPaperId));
  }, [currentPaperId]);

  // Throttle-save scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (scrollSaveTimer.current) clearTimeout(scrollSaveTimer.current);
      scrollSaveTimer.current = setTimeout(() => {
        saveLastPosition(currentPaperId, window.scrollY);
      }, 1000);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollSaveTimer.current) clearTimeout(scrollSaveTimer.current);
    };
  }, [currentPaperId]);

  const handleNewSession = () => {
    const next = readingSession + 1;
    setReadingSession(next);
    saveReadingSession(currentPaperId, next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectPaper = (id: string) => {
    setCurrentPaperId(id);
    setActiveConceptId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUploadStart = () => {
    setIsUploading(true);
  };

  const handleUploadComplete = (newPaper: PaperDocument) => {
    setIsUploading(false);
    if (newPaper) {
      setPapers(prev => [newPaper, ...prev]);
      setCurrentPaperId(newPaper.id);
      setActiveConceptId(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleUpdatePaper = (updatedPaper: PaperDocument) => {
    // Only update if it's the current paper
    if (updatedPaper.id === currentPaper?.id) {
      setPapers(prev => prev.map(p => p.id === updatedPaper.id ? updatedPaper : p));
    }
  };

  const handleUpdateConcept = (conceptId: string, updates: Partial<ConceptEntity>) => {
    setPapers(prevPapers => prevPapers.map(p => {
      if (p.id !== currentPaperId) return p;
      const updatedConcepts = p.concepts.map(c => c.id === conceptId ? { ...c, ...updates } : c);
      return { ...p, concepts: updatedConcepts };
    }));
  };

  const handleSectionClick = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const headerOffset = 100;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
         top: offsetPosition,
         behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#fcfbf9] text-neutral-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      <Header
        papers={papers}
        currentPaperId={currentPaperId}
        onSelectPaper={handleSelectPaper}
        isUploading={false}
        onUploadStart={() => {}}
      />

      <div className="flex-1 flex max-w-[90rem] mx-auto w-full relative">
        <Sidebar 
          paper={currentPaper} 
          activeConceptId={activeConceptId} 
          onSectionClick={handleSectionClick} 
          onSelectConcept={setActiveConceptId}
          readingSession={readingSession}
          onNewSession={handleNewSession}
        />
        
        <main className="flex-1 min-w-0 py-8 px-4 sm:px-8">
          <ReaderCanvas
            paper={currentPaper}
            activeConceptId={activeConceptId}
            onSelectConcept={setActiveConceptId}
            onBenchmarkUpdate={setBenchmark}
            onUpdatePaper={handleUpdatePaper}
          />
        </main>
      </div>

      <SelectionTooltip 
        paper={currentPaper} 
        onUpdatePaper={handleUpdatePaper}
        onUpdateConcept={handleUpdateConcept}
        onSelectConcept={setActiveConceptId}
      />
      
      {/* Footer Benchmark Badge */}
      <div className="fixed bottom-4 right-4 z-40 bg-white/90 backdrop-blur border border-neutral-200/80 rounded-full px-4 py-2 shadow-sm text-[10px] font-mono text-neutral-500 flex items-center gap-3 pointer-events-none">
        <span>Pretext Render: {benchmark.layoutTimeMs.toFixed(2)}ms</span>
        <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
        <span className="text-indigo-600 font-semibold">{benchmark.domReflowsAvoided} DOM reflows bypassed</span>
      </div>
    </div>
  );
}
