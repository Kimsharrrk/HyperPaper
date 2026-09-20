"use client";

import React, { useState, useEffect } from "react";
import { Zap, Activity, Cpu, Sparkles } from "lucide-react";
import { PretextBenchmark } from "@/lib/types";

interface PerformanceMeterProps {
  benchmark: PretextBenchmark;
  activeWireCount: number;
}

export const PerformanceMeter: React.FC<PerformanceMeterProps> = ({
  benchmark,
  activeWireCount,
}) => {
  const [fps, setFps] = useState<number>(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = (currentTime: number) => {
      frameCount++;
      if (currentTime - lastTime >= 1000) {
        setFps(Math.min(60, Math.round((frameCount * 1000) / (currentTime - lastTime))));
        frameCount = 0;
        lastTime = currentTime;
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-[#18191f] text-neutral-200 border border-neutral-800/80 px-3 py-1.5 rounded-full shadow-lg text-xs font-mono select-none">
      {/* Pretext Indicator */}
      <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="tracking-tight">Pretext Engine</span>
      </div>

      <span className="text-neutral-600">|</span>

      {/* Microsecond Layout Benchmark */}
      <div className="flex items-center gap-1 text-neutral-300" title="Pure Canvas & arithmetic layout time">
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span>Layout:</span>
        <span className="text-amber-300 font-semibold">{benchmark.layoutTimeMs}ms</span>
      </div>

      <span className="text-neutral-600">|</span>

      {/* DOM Reflows Avoided */}
      <div className="flex items-center gap-1 text-neutral-300" title="Synchronous forced reflows eliminated">
        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
        <span className="hidden sm:inline">Reflows:</span>
        <span className="text-indigo-300 font-semibold">0 DOM thrash</span>
      </div>

      {/* Active Wires */}
      {activeWireCount > 0 && (
        <>
          <span className="text-neutral-600">|</span>
          <div className="flex items-center gap-1 text-pink-400 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{activeWireCount} wires</span>
          </div>
        </>
      )}

      <span className="text-neutral-600">|</span>

      {/* 60 FPS Gauge */}
      <div className="flex items-center gap-1 text-neutral-400">
        <Activity className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-neutral-200 font-semibold">{fps} FPS</span>
      </div>
    </div>
  );
};
