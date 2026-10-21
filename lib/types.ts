export type SourceKey = "figma" | "medium" | "hn" | "nng" | "lenny";

/** data/raw.ts 의 원본 형태. 문장은 [영어, 한국어] 쌍이며 영어 안의 [[표현|키]] 가 주요 표현 */
export type RawArticle = {
  id: string;
  src: SourceKey;
  kind?: "video";
  sourceLine: string;
  date: string;
  url: string;
  titleKo: string;
  titleEn: string;
  summary: string;
  x: Record<string, [term: string, meaning: string, note: string]>;
  paras: [en: string, ko: string][][];
};

export type Segment = { t: string; xid: string };

export type Sentence = {
  id: string;
  aid: string;
  segs: Segment[];
  plain: string;
  ko: string;
};

export type Expression = {
  id: string;
  aid: string;
  term: string;
  meaning: string;
  note: string;
  /** 이 표현이 처음 등장하는 문장 */
  ctx: Sentence | null;
};

export type Article = {
  id: string;
  src: SourceKey;
  kind: "article" | "video";
  sourceLine: string;
  date: string;
  url: string;
  titleKo: string;
  titleEn: string;
  summary: string;
  xs: Expression[];
  paras: Sentence[][];
  min: number;
};

/** 사용자가 남긴 기록. sid 가 비어 있으면 글 전체에 대한 "읽고 난 생각" */
export type Note = { id: string; aid: string; sid: string; text: string; at: number };
