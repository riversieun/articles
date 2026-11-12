export type TopicKey = "process" | "collab" | "ux" | "system" | "mindset";
export type SourceKey = "figma" | "medium" | "hn" | "nng" | "lenny";

/** data/raw.ts 의 원본 형태. 문장은 [영어, 한국어] 쌍 */
export type RawArticle = {
  id: string;
  src: SourceKey;
  topic: TopicKey;
  kind?: "video";
  sourceLine: string;
  date: string;
  url: string;
  titleKo: string;
  titleEn: string;
  summary: string;
  /** 아티클 상세(요약형)의 "핵심 인사이트". 보통 3개 */
  insights?: Insight[];
  /** 아티클 상세의 "원문은 이렇게 말해요". 영어 원문 인용과 한국어 번역 */
  quotes?: Quote[];
  /** 아티클 상세의 "업무에 적용해보세요" */
  actions?: string[];
  /** 문단은 [영어, 한국어] 문장 쌍의 배열, 소제목은 { h: [영어, 한국어] }, 원문에서 건너뛴 자리는 { gap: true } */
  paras: RawBlock[];
};

export type Insight = { title: string; body: string };
export type Quote = { en: string; ko: string };

export type RawBlock = [en: string, ko: string][] | { h: [en: string, ko: string] } | { gap: true };

export type Sentence = {
  id: string;
  aid: string;
  plain: string;
  ko: string;
};

export type Block = { type: "p"; sentences: Sentence[] } | { type: "h"; en: string; ko: string } | { type: "gap" };

export type Article = {
  id: string;
  src: SourceKey;
  topic: TopicKey;
  kind: "article" | "video";
  sourceLine: string;
  date: string;
  url: string;
  titleKo: string;
  titleEn: string;
  summary: string;
  insights: Insight[];
  quotes: Quote[];
  actions: string[];
  /** 문장 문단만 모은 목록(아카이브·분석용). 소제목은 없다 */
  paras: Sentence[][];
  /** 화면에 그리는 순서 그대로의 문단·소제목 */
  blocks: Block[];
  min: number;
};

/** 사용자가 남긴 기록. sid 가 비어 있으면 글 전체에 대한 "읽고 난 생각" */
export type Note = { id: string; aid: string; sid: string; text: string; at: number };
