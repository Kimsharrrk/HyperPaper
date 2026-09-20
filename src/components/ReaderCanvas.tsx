"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  PaperDocument,
  WordCoordinate,
  PretextBenchmark,
  ConceptEntity,
} from "@/lib/types";
import { layoutParagraphWithPretext, benchmarkPretext } from "@/lib/pretext-engine";
import { MarginNote } from "./MarginNote";
import { AnnotationOverlay } from "./AnnotationOverlay";
import { useReading } from "@/lib/reading-context";

interface ReaderCanvasProps {
  paper: PaperDocument;
  activeConceptId: string | null;
  onSelectConcept: (conceptId: string | null) => void;
  onBenchmarkUpdate: (bench: PretextBenchmark) => void;
  onUpdatePaper: (paper: PaperDocument) => void;
}

export const ReaderCanvas: React.FC<ReaderCanvasProps> = ({
  paper,
  activeConceptId,
  onSelectConcept,
  onBenchmarkUpdate,
  onUpdatePaper,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wordCoordinates, setWordCoordinates] = useState<WordCoordinate[]>([]);
  const { fontSize } = useReading();
  
  // Calculate first appearances of concepts (globalIndex)
  const firstAppearances = React.useMemo(() => {
    const appearances = new Map<string, number>();
    let globalIndex = 0;
    
    paper.sections.forEach(section => {
      section.content.forEach(text => {
        const lowerText = text.toLowerCase();
        paper.concepts.forEach(concept => {
          if (!appearances.has(concept.id)) {
            const hasMatch = lowerText.includes(concept.name.toLowerCase()) || 
                             concept.aliases.some(a => lowerText.includes(a.toLowerCase()));
            if (hasMatch) {
              appearances.set(concept.id, globalIndex);
            }
          }
        });
        globalIndex++;
      });
    });
    return appearances;
  }, [paper]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const [notePositions, setNotePositions] = useState<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const [hoveredConcept, setHoveredConcept] = useState<{ id: string, rect: DOMRect } | null>(null);

  const MARGIN_WIDTH = 340;
  const NOTE_WIDTH = 288; // w-72 is 288px

  const recomputeLayout = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const contentWidth = Math.max(320, rect.width - MARGIN_WIDTH - 64);
    const font = '17px "Newsreader", "Lora", Georgia, serif';
    const lineHeight = 28;

    let fullText = "";
    paper.sections.forEach((sec) => {
      sec.content.forEach((para) => {
        fullText += para + " ";
      });
    });
    
    // Benchmark only for UI display, skip layout calculation
    const bench = benchmarkPretext(fullText, contentWidth, font, lineHeight);
    
    // Collect coordinates from actual DOM elements for pixel-perfect SVGs
    const allCoords: WordCoordinate[] = [];
    const containerRect = containerRef.current.getBoundingClientRect();
    const conceptSpans = containerRef.current.querySelectorAll('.concept-word');
    
    conceptSpans.forEach((span) => {
      const spanRect = span.getBoundingClientRect();
      const conceptId = span.getAttribute('data-concept-id');
      if (conceptId) {
        allCoords.push({
          word: span.textContent || "",
          conceptId: conceptId,
          paragraphIndex: 0, // Not strictly needed anymore for rendering
          sectionId: "",
          lineIndex: 0,
          x: spanRect.left - containerRect.left,
          y: spanRect.top - containerRect.top,
          width: spanRect.width,
          height: spanRect.height,
        });
      }
    });

    setWordCoordinates(allCoords);
    setContainerDimensions({ width: rect.width, height: containerRef.current.scrollHeight });
    onBenchmarkUpdate(bench);
  }, [paper, onBenchmarkUpdate]);

  useEffect(() => {
    const timer = setTimeout(recomputeLayout, 100);
    const handleResize = () => recomputeLayout();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [recomputeLayout, activeConceptId]);

  // Auto-select concept if user drags/highlights it
  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const text = sel.toString().trim().toLowerCase();
        
        if (text.length > 0 && text.length < 50) {
          const matchedConcept = paper.concepts.find(c => 
            c.name.toLowerCase() === text || c.aliases.some(a => a.toLowerCase() === text)
          );
          if (matchedConcept && matchedConcept.id !== activeConceptId) {
            onSelectConcept(matchedConcept.id);
          }
        }
      }, 10);
    };
    
    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [paper.concepts, activeConceptId, onSelectConcept]);

  const activeConcept = paper.concepts.find(c => c.id === activeConceptId) || null;

  const relatedConcepts = activeConcept 
    ? activeConcept.relations.map(r => paper.concepts.find(c => c.id === r.targetConceptId)).filter(Boolean) as ConceptEntity[]
    : [];

  // Calculate positions for MarginNotes when activeConcept changes
  useEffect(() => {
    if (!activeConcept || !containerRef.current) {
       setNotePositions({});
       return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const marginX = rect.width - MARGIN_WIDTH;
    const newPos: Record<string, { x: number; y: number; width: number; height: number }> = {};

    const activeCoords = wordCoordinates.filter(c => c.conceptId === activeConcept.id);
    let currentY = activeCoords.length > 0 ? activeCoords[0].y : 200;

    // Position Primary Note
    newPos[activeConcept.id] = {
       x: marginX,
       y: currentY,
       width: NOTE_WIDTH,
       height: 380 // increased from 120
    };

    currentY += 380; // padding below primary note

    // Position Related Notes sequentially below
    relatedConcepts.forEach(rc => {
       const rcCoords = wordCoordinates.filter(c => c.conceptId === rc.id);
       // Try to put it near its word, but if it overlaps with previous notes, push it down
       let targetY = rcCoords.length > 0 ? rcCoords[0].y : currentY;
       
       // Add a 20px minimum gap between notes
       if (targetY < currentY + 20) targetY = currentY + 20;

       newPos[rc.id] = {
         x: marginX,
         y: targetY,
         width: NOTE_WIDTH,
         height: 300 // increased from 80
       };
       currentY = targetY + 300;
    });

    setNotePositions(newPos);
  }, [activeConcept, wordCoordinates]);

  const renderParagraph = useCallback((text: string, paraIndex: number, sectionId: string) => {
    const chunks: { content: string; isConcept: boolean; conceptId?: string; color?: string }[] = [];
    
    // Sort concepts by length (descending) to match longest first
    const sortedConcepts = [...paper.concepts].sort((a, b) => b.name.length - a.name.length);
    
    let currentIndex = 0;
    const lowerText = text.toLowerCase();

    while (currentIndex < text.length) {
      let matched = false;

      for (const concept of sortedConcepts) {
        const terms = [concept.name, ...concept.aliases].sort((a, b) => b.length - a.length);
        
        for (const term of terms) {
          if (lowerText.startsWith(term.toLowerCase(), currentIndex)) {
            // Found a match
            chunks.push({
              content: text.slice(currentIndex, currentIndex + term.length),
              isConcept: true,
              conceptId: concept.id,
              color: concept.color
            });
            currentIndex += term.length;
            matched = true;
            break;
          }
        }
        if (matched) break;
      }

      if (!matched) {
        // Collect normal text until next concept
        let nextMatchIndex = text.length;
        for (const concept of sortedConcepts) {
          const terms = [concept.name, ...concept.aliases];
          for (const term of terms) {
            const idx = lowerText.indexOf(term.toLowerCase(), currentIndex + 1);
            if (idx !== -1 && idx < nextMatchIndex) {
              nextMatchIndex = idx;
            }
          }
        }
        chunks.push({
          content: text.slice(currentIndex, nextMatchIndex),
          isConcept: false
        });
        currentIndex = nextMatchIndex;
      }
    }

    const seenInThisPara = new Set<string>();

    return chunks.map((chunk, idx) => {
      if (chunk.isConcept) {
        const isCurrentActive = activeConceptId === chunk.conceptId;
        const isRelated = activeConceptId 
          ? paper.concepts.find(c => c.id === activeConceptId)?.relations.some(r => r.targetConceptId === chunk.conceptId)
          : false;

        const concept = paper.concepts.find(c => c.id === chunk.conceptId);
        const isFirstAppearance = firstAppearances.get(chunk.conceptId!) === paraIndex && !seenInThisPara.has(chunk.conceptId!);
        if (chunk.isConcept && chunk.conceptId) seenInThisPara.add(chunk.conceptId);

        const isKeySentence = concept?.category === "key-sentence" || concept?.highlightType === "key-sentence";
        const isUnknown = concept?.category === "unknown-term" || concept?.highlightType === "unknown-term";
        const isCoreFlow = concept?.category === "core-flow" || concept?.highlightType === "core-flow";

        // Clean editorial styling
        let styleClass = "";
        if (isCurrentActive) {
          styleClass = "bg-amber-100 text-neutral-950 font-semibold rounded px-1 -mx-0.5 shadow-2xs";
        } else if (isRelated) {
          styleClass = "bg-neutral-100 text-neutral-900 rounded px-1 -mx-0.5";
        } else if (isKeySentence) {
          styleClass = "bg-amber-50/70 border-b border-amber-300/80 text-neutral-900";
        } else {
          styleClass = "text-neutral-900 border-b border-neutral-300 hover:border-neutral-800 transition-colors";
        }

        return (
          <span
            key={`${paraIndex}-${idx}`}
            data-concept-id={chunk.conceptId}
            className={`concept-word cursor-pointer transition-all duration-150 relative inline ${styleClass}`}
            onMouseEnter={(e) => {
              if (isCurrentActive) return;
              setHoveredConcept({ id: chunk.conceptId!, rect: e.currentTarget.getBoundingClientRect() });
            }}
            onMouseLeave={() => setHoveredConcept(null)}
            onClick={(e) => {
              e.stopPropagation();
              setHoveredConcept(null);
              onSelectConcept(isCurrentActive ? null : chunk.conceptId!);
            }}
          >
            {chunk.content}
          </span>
        );
      }

      return <span key={`${paraIndex}-${idx}`}>{chunk.content}</span>;
    });
  }, [paper.concepts, activeConceptId, firstAppearances, onSelectConcept]);

  return (
    <div
      ref={containerRef}
      onClick={() => onSelectConcept(null)}
      className="relative w-full max-w-5xl mx-auto pl-8 sm:pl-12 py-16 bg-white rounded-3xl border border-neutral-200/60 shadow-sm transition-all"
    >
      <AnnotationOverlay 
         activeConcept={activeConcept}
         relatedConcepts={relatedConcepts}
         wordCoordinates={wordCoordinates}
         notePositions={notePositions}
         containerWidth={containerDimensions.width}
         containerHeight={containerDimensions.height}
      />

      {activeConcept && notePositions[activeConcept.id] && (
         <MarginNote 
           concept={activeConcept} 
           top={notePositions[activeConcept.id].y} 
           isPrimary={true} 
           onUpdateMemo={(newMemo) => {
             const updatedConcepts = paper.concepts.map(c => 
               c.id === activeConcept.id ? { ...c, operationalDefinition: newMemo } : c
             );
             onUpdatePaper({ ...paper, concepts: updatedConcepts });
           }}
         />
      )}

      {relatedConcepts.map(rc => (
         notePositions[rc.id] && (
           <MarginNote 
             key={rc.id}
             concept={rc} 
             top={notePositions[rc.id].y} 
           />
         )
      ))}

      {hoveredConcept && (() => {
        const c = paper.concepts.find(x => x.id === hoveredConcept.id);
        if (!c) return null;
        return (
          <div 
            className="fixed z-50 pointer-events-none animate-in fade-in duration-150"
            style={{
              top: Math.max(10, hoveredConcept.rect.top - 60),
              left: Math.min(Math.max(16, hoveredConcept.rect.left + (hoveredConcept.rect.width / 2) - 130), window.innerWidth - 280),
            }}
          >
            <div className="w-[260px] bg-neutral-900 text-white px-3 py-2.5 rounded-xl shadow-xl border border-neutral-800 text-[12px] leading-snug space-y-1">
              <div className="font-semibold text-amber-200 flex items-baseline justify-between">
                <span>{c.name}</span>
                {c.koreanMeaning && (
                  <span className="text-[10px] text-neutral-400 font-normal ml-2 truncate">
                    {c.koreanMeaning.split("(")[0].trim()}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-300 line-clamp-2">
                {c.operationalDefinition}
              </p>
            </div>
          </div>
        );
      })()}

      <div style={{ paddingRight: `${MARGIN_WIDTH}px` }}>
        <div className="mb-12 pb-10 border-b border-neutral-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-[11px] uppercase font-mono font-bold tracking-widest text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100/80">
              {paper.venue}
            </span>
            <span className="text-neutral-300 text-xs">•</span>
            <span className="text-xs text-neutral-500 font-mono">
              Published: {paper.published}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 leading-[1.15] mb-5">
            {paper.title}
          </h1>

          <p className="text-base text-neutral-600 font-serif italic mb-8">
            {paper.authors}
          </p>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-2">
              Abstract
            </span>
            <p className="text-neutral-800 text-[14.5px] leading-relaxed font-serif">
              {paper.executiveSummary}
            </p>
          </div>
        </div>

        <div className="space-y-16">
          {(() => {
            let globalParaCounter = 0;
            return paper.sections.map((section, secIdx) => (
              <section key={section.id} id={section.id} className="scroll-mt-32">
                <div className="flex items-baseline gap-3 mb-6">
                  <h2 className="font-serif text-2xl font-bold text-neutral-900 tracking-tight">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-6 text-neutral-800 leading-[1.8] font-serif" style={{ fontSize: `${fontSize}px` }}>
                  {section.content.map((paragraphText, pIdx) => {
                    const globalIndex = globalParaCounter++;
                    return (
                      <p
                        key={pIdx}
                        id={`para-${globalIndex}`}
                        className="relative text-justify"
                      >
                        {renderParagraph(paragraphText, globalIndex, section.id)}
                      </p>
                    );
                  })}
                </div>
              </section>
            ));
          })()}
        </div>
      </div>
    </div>
  );
};
