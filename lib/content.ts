import { RAW } from "@/data/raw";
import type { Article, Block, Sentence, SourceKey } from "./types";

/** 제목에서 소문자로 두는 짧은 관사·접속사·전치사 (맨 앞·맨 뒤 단어는 예외) */
const MINOR_WORDS = new Set(["a", "an", "the", "and", "but", "or", "nor", "for", "so", "yet", "as", "at", "by", "in", "of", "on", "per", "to", "up", "via", "vs"]);

/**
 * 영어 제목 표기(Title Case). 원문 제목을 "첫 글자만 대문자"로 넣어도 단어마다 대문자로 바꾼다.
 * 짧은 관사·접속사·전치사는 소문자, 맨 앞·맨 뒤·콜론 뒤 단어는 대문자, AI·iOS처럼 이미 섞인 대문자는 그대로 둔다.
 */
export function toTitleCase(title: string) {
  const cap = (w: string) => w.replace(/^([^A-Za-z]*)([A-Za-z])/, (_, pre: string, c: string) => pre + c.toUpperCase());
  const words = title.trim().split(/\s+/);
  return words
    .map((w, i) => {
      if (/[A-Z]/.test(w.slice(1))) return w;
      const bare = w.toLowerCase().replace(/[^a-z]/g, "");
      const edge = i === 0 || i === words.length - 1 || words[i - 1].endsWith(":");
      if (!edge && MINOR_WORDS.has(bare)) return w.toLowerCase();
      return w.split("-").map(cap).join("-");
    })
    .join(" ");
}

function parse() {
  const arts: Article[] = [];
  const byId: Record<string, Article> = {};
  const sent: Record<string, Sentence> = {};

  for (const r of RAW) {
    let words = 0;
    let count = 0;
    const paras: Sentence[][] = [];
    const blocks: Block[] = [];
    for (const b of r.paras) {
      if (!Array.isArray(b)) {
        blocks.push("gap" in b ? { type: "gap" } : { type: "h", en: b.h[0], ko: b.h[1] });
        continue;
      }
      const sentences = b.map(([en, ko]) => {
        count += 1;
        const id = `${r.id}-s${count}`;
        const s: Sentence = { id, aid: r.id, plain: en, ko };
        words += s.plain.split(/\s+/).length;
        sent[id] = s;
        return s;
      });
      paras.push(sentences);
      blocks.push({ type: "p", sentences });
    }

    const art: Article = {
      id: r.id,
      src: r.src,
      topic: r.topic,
      kind: r.kind ?? "article",
      sourceLine: r.sourceLine,
      date: r.date,
      url: r.url,
      titleKo: r.titleKo,
      titleEn: toTitleCase(r.titleEn),
      summary: r.summary,
      paras,
      blocks,
      min: Math.max(1, Math.ceil(words / 70)),
    };
    arts.push(art);
    byId[r.id] = art;
  }
  return { arts, byId, sent };
}

export const lib = parse();

export const TOPICS: [key: string, label: string][] = [
  ["all", "전체"],
  ["process", "디자인 프로세스"],
  ["collab", "협업"],
  ["ux", "UX 원칙"],
  ["system", "디자인 시스템"],
];

export const TOPIC_LABEL: Record<string, string> = Object.fromEntries(TOPICS);

export const SOURCE_LABEL: Record<SourceKey, string> = {
  figma: "Figma",
  medium: "Medium",
  hn: "Hacker News",
  nng: "NN/g",
  lenny: "Lenny's Podcast",
};

/** "2026.10.08" → "2026년 10월 8일" */
export function formatDate(date: string) {
  const [y, m, d] = date.split(".").map(Number);
  return `${y}년 ${m}월 ${d}일`;
}

/** 저장 시각(ms) → "2026년 10월 8일" */
export function formatTimestamp(at: number) {
  const d = new Date(at);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}
