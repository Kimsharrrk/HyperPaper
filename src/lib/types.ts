export interface ConceptRelation {
  targetConceptId: string;
  relationType: "defines" | "uses" | "critiques" | "implements" | "optimizes";
  description: string;
}

export interface ConceptEntity {
  id: string;
  name: string;
  color: string;
  aliases: string[];
  operationalDefinition: string;
  dictionaryContrast: string;
  eli5: string;
  significance: string;
  category: "core-primitive" | "mechanism" | "architecture" | "metric" | "problem" | "user-memo" | "vocabulary" | "key-sentence" | "core-flow" | "unknown-term" | "concept-definition";
  relations: ConceptRelation[];
  firstIntroducedSectionId: string;
  koreanMeaning?: string; // 기본 뜻 (예: "숨겨진 / 은닉된", "가로막다 / 배제하다")
  importance?: 1 | 2 | 3; // 중요도 별표 (1~3개)
  highlightType?: "core-flow" | "concept-definition" | "unknown-term" | "key-sentence";
  badgeNumber?: number; // ①, ②, ③ 전개 순서 번호
  flowRole?: string; // 논문 흐름상 역할 (예: "기존 기술의 한계 제시 및 반박 근거")
}

export interface PaperSection {
  id: string;
  number: string;
  title: string;
  content: string[]; // array of paragraphs
}

export interface PaperDocument {
  id: string;
  title: string;
  authors: string;
  published: string;
  venue: string;
  readingTimeMinutes: number;
  executiveSummary: string;
  sections: PaperSection[];
  concepts: ConceptEntity[];
}

export interface WordCoordinate {
  word: string;
  conceptId: string;
  paragraphIndex: number;
  sectionId: string;
  lineIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PretextBenchmark {
  layoutTimeMs: number;
  lineCount: number;
  characterCount: number;
  domReflowsAvoided: number;
  estimatedDomMs: number;
}

export interface SelectionInsight {
  text: string;
  explanation: string;
  keyTakeaway: string;
  simplified: string;
  koreanMeaning?: string;
  flowRole?: string;
}
