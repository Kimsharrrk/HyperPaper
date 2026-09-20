/**
 * reading-store.ts
 * localStorage helpers for persisting reading session state.
 */

const PREFIX = "hyperpaper";

export function saveLastPosition(paperId: string, scrollY: number) {
  try {
    localStorage.setItem(`${PREFIX}:lastPaper`, paperId);
    localStorage.setItem(`${PREFIX}:scroll:${paperId}`, String(Math.round(scrollY)));
  } catch {}
}

export function loadLastPosition(): { paperId: string | null; scrollY: number } {
  try {
    const paperId = localStorage.getItem(`${PREFIX}:lastPaper`);
    const scrollY = Number(localStorage.getItem(`${PREFIX}:scroll:${paperId ?? ""}`) ?? 0);
    return { paperId, scrollY };
  } catch {
    return { paperId: null, scrollY: 0 };
  }
}

export function saveReadingMode(mode: "light" | "dark" | "sepia") {
  try { localStorage.setItem(`${PREFIX}:mode`, mode); } catch {}
}

export function loadReadingMode(): "light" | "dark" | "sepia" {
  try {
    return (localStorage.getItem(`${PREFIX}:mode`) as any) ?? "light";
  } catch { return "light"; }
}

export function saveFontSize(size: number) {
  try { localStorage.setItem(`${PREFIX}:fontSize`, String(size)); } catch {}
}

export function loadFontSize(): number {
  try { return Number(localStorage.getItem(`${PREFIX}:fontSize`) ?? 17); } catch { return 17; }
}

export function saveReadingSession(paperId: string, session: number) {
  try { localStorage.setItem(`${PREFIX}:session:${paperId}`, String(session)); } catch {}
}

export function loadReadingSession(paperId: string): number {
  try { return Number(localStorage.getItem(`${PREFIX}:session:${paperId}`) ?? 1); } catch { return 1; }
}

export function saveParagraphSummary(paperId: string, paraId: string, summary: string) {
  try {
    const key = `${PREFIX}:summary:${paperId}`;
    const existing = JSON.parse(localStorage.getItem(key) ?? "{}");
    existing[paraId] = summary;
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {}
}

export function loadParagraphSummaries(paperId: string): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(`${PREFIX}:summary:${paperId}`) ?? "{}");
  } catch { return {}; }
}
