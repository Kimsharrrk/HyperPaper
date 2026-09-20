import React, { forwardRef, useState, useEffect } from "react";
import { ConceptEntity } from "@/lib/types";
import { PenLine } from "lucide-react";

interface MarginNoteProps {
  concept: ConceptEntity;
  top: number;
  isPrimary?: boolean;
  onUpdateMemo?: (memo: string) => void;
}

export const MarginNote = forwardRef<HTMLDivElement, MarginNoteProps>(
  ({ concept, top, isPrimary = false, onUpdateMemo }, ref) => {
    const isUserMemo = concept.category === "user-memo";
    const [isEditing, setIsEditing] = useState(isUserMemo && concept.operationalDefinition === "Click to add a memo...");
    const [memoText, setMemoText] = useState(concept.operationalDefinition);

    useEffect(() => {
      setMemoText(concept.operationalDefinition);
    }, [concept.operationalDefinition]);

    const handleSave = () => {
      setIsEditing(false);
      if (onUpdateMemo && memoText !== concept.operationalDefinition) {
        onUpdateMemo(memoText);
      }
    };

    return (
      <div
        ref={ref}
        onClick={(e) => e.stopPropagation()}
        className={`
          animate-in fade-in duration-200
          lg:absolute lg:right-0 lg:w-72 lg:bottom-auto lg:left-auto
          ${!isPrimary ? "hidden lg:block opacity-60 hover:opacity-100 transition-opacity" : "fixed bottom-6 left-4 right-4 z-50 lg:z-auto w-auto shadow-xl lg:shadow-sm"}
          p-4 rounded-xl
          ${isPrimary 
            ? "bg-[#faf8f5] border border-amber-900/10 shadow-sm" 
            : "bg-white border border-neutral-200/70"}
        `}
        style={{
          ...(typeof window !== 'undefined' && window.innerWidth >= 1024 ? { top } : {})
        }}
      >
        {/* Header: Title + Subtle Korean translation */}
        <div className="mb-2 pb-2 border-b border-neutral-150 flex items-baseline justify-between gap-2">
          <div className="min-w-0">
            <span className="font-serif font-bold text-[16px] text-neutral-900 leading-snug">
              {concept.name}
            </span>
            {concept.koreanMeaning && (
              <span className="block text-[12px] font-sans text-neutral-500 font-medium mt-0.5">
                {concept.koreanMeaning.split("(")[0].trim()}
              </span>
            )}
          </div>
          <span 
            className="w-2 h-2 rounded-full shrink-0" 
            style={{ backgroundColor: concept.color || "#4f46e5" }} 
          />
        </div>

        {/* Content: Clean, Human Editorial Note */}
        {isEditing ? (
          <textarea
            autoFocus
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); } }}
            className="w-full bg-white border border-neutral-300 rounded-lg p-2.5 text-[13px] text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-900 resize-none font-sans"
            rows={3}
            placeholder="메모를 입력하세요..."
          />
        ) : (
          <div className="space-y-2.5 text-[13px] text-neutral-700 leading-relaxed font-sans">
            <p 
              onClick={() => isUserMemo && setIsEditing(true)}
              className={isUserMemo ? "cursor-text hover:bg-neutral-100/60 rounded p-1" : ""}
            >
              {concept.operationalDefinition}
            </p>

            {concept.flowRole && (
              <p className="text-[12px] text-neutral-500 border-l-2 border-neutral-200 pl-2 py-0.5">
                {concept.flowRole}
              </p>
            )}

            {concept.eli5 && (
              <p className="text-[12px] text-neutral-600 bg-neutral-100/70 rounded-lg p-2 font-serif italic">
                "{concept.eli5}"
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);
MarginNote.displayName = "MarginNote";
