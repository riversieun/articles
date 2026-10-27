export type TopicKey = "process" | "collab" | "ux" | "system";
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
  /** 문단은 [영어, 한국어] 문장 쌍의 배열, 소제목은 { h: [영어, 한국어] }, 원문에서 건너뛴 자리는 { gap: true } */
  paras: RawBlock[];
};

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
  /** 문장 문단만 모은 목록(아카이브·분석용). 소제목은 없다 */
  paras: Sentence[][];
  /** 화면에 그리는 순서 그대로의 문단·소제목 */
  blocks: Block[];
  min: number;
};

/** 사용자가 남긴 기록. sid 가 비어 있으면 글 전체에 대한 "읽고 난 생각" */
export type Note = { id: string; aid: string; sid: string; text: string; at: number };
