"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Sparkles, X, Highlighter } from "lucide-react";
import { SelectionInsight, PaperDocument, ConceptEntity } from "@/lib/types";

interface SelectionTooltipProps {
  paper: PaperDocument;
  onUpdatePaper: (paper: PaperDocument) => void;
  onUpdateConcept: (conceptId: string, updates: Partial<ConceptEntity>) => void;
  onSelectConcept: (id: string | null) => void;
}

export const SelectionTooltip: React.FC<SelectionTooltipProps> = ({ 
  paper, 
  onUpdatePaper, 
  onUpdateConcept,
  onSelectConcept 
}) => {
  const [selection, setSelection] = useState<{ text: string; rect: DOMRect; context: string } | null>(null);
  const [insight, setInsight] = useState<SelectionInsight | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHighlight = async (color: string) => {
    if (!selection) return;
    
    const text = selection.text.trim();
    const lowerText = text.toLowerCase();

    // Check if it matches or is contained in an existing concept
    const existing = paper.concepts.find(c => {
      const cName = c.name.toLowerCase();
      return cName === lowerText || 
             c.aliases.some(a => a.toLowerCase() === lowerText) ||
             (lowerText.length >= 4 && cName.includes(lowerText)) ||
             (cName.length >= 4 && lowerText.includes(cName));
    });
    
    if (existing) {
      onSelectConcept(existing.id);
      setSelection(null);
      return;
    }

    const context = selection.context;
    const highlightType = color === '#ec4899' ? 'core-flow' : color === '#22c55e' ? 'unknown-term' : 'concept-definition';

    const loadingMsg =
      highlightType === 'core-flow'
        ? '🤖 이 개념의 논문 내 역할을 분석하는 중...'
        : highlightType === 'unknown-term'
        ? '🤖 쉬운 설명을 만드는 중...'
        : '🤖 개념 정의를 분석하는 중...';

    const tempId = `user-memo-${Date.now()}`;
    const newConcept: ConceptEntity = {
      id: tempId,
      name: text,
      color: color,
      aliases: [],
      operationalDefinition: loadingMsg,
      dictionaryContrast: "",
      eli5: "",
      significance: "",
      category: highlightType,
      firstIntroducedSectionId: paper.sections[0]?.id || "",
      relations: []
    };
    
    onUpdatePaper({ ...paper, concepts: [...paper.concepts, newConcept] });
    onSelectConcept(tempId);
    setSelection(null);

    try {
      const res = await fetch("/api/analyze-term", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "explain_selection",
          highlightType,
          text: `"${text}"`,
          contextParagraph: context,
          documentTitle: paper.title,
        }),
      });

      if (!res.ok) throw new Error("API failed");
      const data = await res.json();
      
      onUpdateConcept(tempId, {
        operationalDefinition: data.insight?.keyTakeaway || "분석 완료. 메모를 추가해보세요.",
        koreanMeaning: data.insight?.koreanMeaning || "",
        flowRole: data.insight?.flowRole || "",
        dictionaryContrast: data.insight?.explanation || "",
        eli5: data.insight?.simplified || "",
      });
      
    } catch (e) {
      onUpdateConcept(tempId, {
        operationalDefinition: "⚠️ 분석 실패. 클릭해서 직접 메모를 작성해주세요."
      });
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(() => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0 && sel.toString().trim().length > 0) {
          // Check if selection is inside our reading canvas
          const range = sel.getRangeAt(0);
          const container = range.commonAncestorContainer;
          const node = container.nodeType === Node.TEXT_NODE ? container.parentNode : container;
          if (node && (node as Element).closest?.('main')) {
            const rect = range.getBoundingClientRect();
            const context = (node as Element).closest?.('p')?.textContent || '';
            setSelection({ text: sel.toString().trim(), rect, context });
            setInsight(null);
            setError(null);
          }
        } else {
          setSelection(null);
        }
      }, 50);
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleExplain = async () => {
    if (!selection) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze-term", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "explain_selection",
          text: `"${selection.text}"`,
          contextParagraph: selection.context,
          documentTitle: paper.title,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setInsight(data.insight);
      } else {
        setError("Failed to analyze text.");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selection) return null;

  return (
    <div
      className="fixed z-50 animate-in fade-in duration-150"
      style={{
        top: selection.rect.bottom + 10,
        left: Math.min(Math.max(16, selection.rect.left + selection.rect.width / 2 - 140), window.innerWidth - 300),
      }}
    >
      <div className="w-[280px] bg-neutral-900 text-white rounded-xl shadow-2xl overflow-hidden border border-neutral-800">
        {!insight && !isLoading && !error && (
          <div className="p-1.5 flex items-center gap-1">
            <button 
              onClick={() => handleExplain()}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-[13px] font-medium text-neutral-200 hover:text-white"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Explain
            </button>
            
            <div className="w-px h-4 bg-neutral-700" />

            <button 
              onClick={() => handleHighlight('#d97706')} // Warm subtle amber
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-[13px] font-medium text-neutral-200 hover:text-white"
            >
              <Highlighter className="w-3.5 h-3.5 text-amber-400" />
              Highlight
            </button>

            <button 
              onClick={() => setSelection(null)} 
              className="p-1.5 text-neutral-500 hover:text-neutral-300 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {isLoading && (
          <div className="p-3.5 flex items-center justify-center gap-2.5 text-[12px] text-neutral-300">
            <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
            <span>분석 중...</span>
          </div>
        )}

        {error && (
          <div className="p-3 text-red-400 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setSelection(null)}><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

        {insight && (
          <div className="p-3.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-200 text-[13px]">
                {selection.text}
              </span>
              <button onClick={() => setSelection(null)} className="text-neutral-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            {insight.koreanMeaning && (
              <div className="text-[12px] text-neutral-400 font-medium">
                {insight.koreanMeaning.split("(")[0].trim()}
              </div>
            )}

            <p className="text-neutral-200 leading-relaxed font-sans pt-1 border-t border-neutral-800">
              {insight.keyTakeaway}
            </p>

            {insight.simplified && (
              <p className="text-neutral-400 leading-relaxed font-serif italic pt-1">
                "{insight.simplified}"
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
