"use client";

import React from "react";
import { WordCoordinate, ConceptEntity } from "@/lib/types";

interface AnnotationOverlayProps {
  activeConcept: ConceptEntity | null;
  relatedConcepts: ConceptEntity[];
  wordCoordinates: WordCoordinate[];
  notePositions: Record<string, { x: number; y: number; width: number; height: number }>;
  containerWidth: number;
  containerHeight: number;
}

export const AnnotationOverlay: React.FC<AnnotationOverlayProps> = ({
  activeConcept,
  relatedConcepts,
  wordCoordinates,
  notePositions,
  containerWidth,
  containerHeight,
}) => {
  if (!activeConcept) return null;

  const paths = [];

  // 1. Draw arrow from Active Word to Active Note
  const activeWordCoords = wordCoordinates.filter(c => c.conceptId === activeConcept.id);
  const activeNotePos = notePositions[activeConcept.id];

  if (activeWordCoords.length > 0 && activeNotePos) {
    // A. Connect occurrences to each other sequentially
    for (let i = 0; i < activeWordCoords.length - 1; i++) {
      const current = activeWordCoords[i];
      const next = activeWordCoords[i + 1];
      const startX = current.x + current.width / 2;
      const startY = current.y + current.height;
      const endX = next.x + next.width / 2;
      const endY = next.y;
      
      const dx = endX - startX;
      const dy = endY - startY;
      const curve = Math.min(60, Math.abs(dy) * 0.4);
      
      paths.push(
        <path
          key={`wire-occurrence-${i}`}
          d={`M ${startX} ${startY} C ${startX} ${startY + curve}, ${endX} ${endY - curve}, ${endX} ${endY}`}
          fill="none"
          stroke={activeConcept.color}
          strokeWidth="2"
          strokeOpacity="0.3"
          className="animate-wire"
        />
      );
    }

    // B. Draw arrow from FIRST occurrence to Active Note
    const word = activeWordCoords[0]; // first occurrence
    const startX = word.x + word.width;
    const startY = word.y + word.height / 2 + 4; // slight offset for organic feel
    const endX = activeNotePos.x - 10;
    const endY = activeNotePos.y + 20;

    const controlX = startX + (endX - startX) * 0.5;
    const controlY = startY - 20; // curve upwards

    paths.push(
      <path
        key={`word-to-note-${activeConcept.id}`}
        d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
        fill="none"
        stroke={activeConcept.color}
        strokeWidth="1.5"
        strokeLinecap="round"
        className="opacity-70 drop-shadow-sm"
        style={{ filter: "url(#pencil-texture)" }}
        markerEnd={`url(#arrow-${activeConcept.id})`}
      />
    );
  }

  // 2. Draw arrows from Related Words to Related Notes
  // 3. Draw arrows from Active Note to Related Notes
  relatedConcepts.forEach(relConcept => {
    const relNotePos = notePositions[relConcept.id];
    if (!relNotePos || !activeNotePos) return;

    // Line from active note to related note
    const startX = activeNotePos.x + 20;
    const startY = activeNotePos.y + activeNotePos.height + 5;
    const endX = relNotePos.x + 20;
    const endY = relNotePos.y - 5;
    
    // Draw only if there's space vertically
    if (endY > startY) {
       const relationInfo = activeConcept.relations.find(r => r.targetConceptId === relConcept.id);
       
       paths.push(
         <g key={`note-to-note-${relConcept.id}`}>
           <path
             d={`M ${startX} ${startY} C ${startX - 30} ${startY + (endY - startY)/2}, ${endX - 30} ${startY + (endY - startY)/2}, ${endX} ${endY}`}
             fill="none"
             stroke="#9ca3af" // subtle neutral color
             strokeWidth="1.5"
             strokeDasharray="4 4"
             markerEnd="url(#arrow-neutral)"
           />
           <text
             x={startX - 40}
             y={startY + (endY - startY) / 2 + 5}
             fill="#4b5563"
             fontSize="16"
             fontFamily="'Caveat', cursive"
             textAnchor="end"
             className="drop-shadow-sm font-bold"
           >
             {relationInfo?.relationType || "relates to"}
           </text>
         </g>
       );
    }

    // Line from related word to related note
    const relWordCoords = wordCoordinates.filter(c => c.conceptId === relConcept.id);
    if (relWordCoords.length > 0) {
      const word = relWordCoords[0];
      const wStartX = word.x + word.width;
      const wStartY = word.y + word.height / 2;
      const wEndX = relNotePos.x - 10;
      const wEndY = relNotePos.y + 20;

      paths.push(
        <path
          key={`word-to-note-${relConcept.id}`}
          d={`M ${wStartX} ${wStartY} Q ${wStartX + 40} ${wStartY}, ${wEndX} ${wEndY}`}
          fill="none"
          stroke={relConcept.color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeOpacity="0.4"
          markerEnd={`url(#arrow-${relConcept.id})`}
        />
      );
    }
  });

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-10 overflow-visible"
      style={{ width: containerWidth, height: containerHeight }}
    >
      <defs>
        <filter id="pencil-texture" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        <marker id={`arrow-${activeConcept.id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill={activeConcept.color} className="opacity-70" />
        </marker>
        <marker id="arrow-neutral" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M 0 0 L 6 3 L 0 6 z" fill="#9ca3af" />
        </marker>
        
        {relatedConcepts.map(rc => (
          <marker key={`arrow-marker-${rc.id}`} id={`arrow-${rc.id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M 0 0 L 6 3 L 0 6 z" fill={rc.color} className="opacity-40" />
          </marker>
        ))}
      </defs>
      {paths}
    </svg>
  );
};
