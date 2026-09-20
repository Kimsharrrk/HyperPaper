"use client";

import React from "react";
import { ConceptEntity, WordCoordinate } from "@/lib/types";

interface InlineTooltipProps {
  concept: ConceptEntity;
  coordinate: WordCoordinate;
  onClose: () => void;
}

export const InlineTooltip: React.FC<InlineTooltipProps> = ({ concept, coordinate, onClose }) => {
  // We want to position the tooltip right below the word.
  // The coordinate is relative to the container (ReaderCanvas).
  
  return (
    <div 
      className="absolute z-50 animate-in fade-in zoom-in-95 duration-200"
      style={{
        top: coordinate.y + coordinate.height + 8, // 8px spacing
        left: Math.max(0, coordinate.x - 120), // Center roughly, but prevent overflowing left
      }}
    >
      <div className="w-72 bg-white/95 backdrop-blur-xl border border-neutral-200/90 rounded-xl shadow-xl overflow-hidden text-left text-sm">
        <div className="px-3 py-2 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-xs"
              style={{ backgroundColor: concept.color }}
            />
            <span className="font-serif font-bold text-neutral-900">{concept.name}</span>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-neutral-400 hover:text-neutral-700">
            &times;
          </button>
        </div>
        <div className="p-3 space-y-2">
          <p className="text-neutral-700 text-xs leading-relaxed font-serif">
            {concept.operationalDefinition}
          </p>
          {concept.eli5 && (
            <div className="bg-amber-50/60 p-2 rounded-lg border border-amber-100/50">
              <p className="text-amber-900 text-[11px] leading-relaxed italic">
                💡 {concept.eli5}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Little upward triangle pointer */}
      <div 
        className="absolute w-3 h-3 bg-white border-t border-l border-neutral-200/90 transform rotate-45"
        style={{
          top: -6,
          left: coordinate.x - Math.max(0, coordinate.x - 120) + coordinate.width / 2 - 6,
        }}
      />
    </div>
  );
};
