import { RAW } from "@/data/raw";
import type { Article, Expression, Sentence } from "./types";

const EXPR_RE = /\[\[(.+?)\|(\w+)\]\]/g;

function parse() {
  const arts: Article[] = [];
  const byId: Record<string, Article> = {};
  const sent: Record<string, Sentence> = {};
  const expr: Record<string, Expression> = {};
  const exprList: Expression[] = [];

  for (const r of RAW) {
    const xs: Expression[] = Object.keys(r.x).map((k) => ({
      id: `${r.id}-${k}`,
      aid: r.id,
      term: r.x[k][0],
      meaning: r.x[k][1],
      note: r.x[k][2],
      ctx: null,
    }));
    const xmap: Record<string, Expression> = {};
    for (const x of xs) {
      xmap[x.id] = x;
      expr[x.id] = x;
      exprList.push(x);
    }

    let words = 0;
    let count = 0;
    const paras = r.paras.map((p) =>
      p.map(([en, ko]) => {
        count += 1;
        const id = `${r.id}-s${count}`;
        const segs: Sentence["segs"] = [];
        let last = 0;
        for (const m of en.matchAll(EXPR_RE)) {
          const idx = m.index ?? 0;
          if (idx > last) segs.push({ t: en.slice(last, idx), xid: "" });
          segs.push({ t: m[1], xid: `${r.id}-${m[2]}` });
          last = idx + m[0].length;
        }
        if (last < en.length) segs.push({ t: en.slice(last), xid: "" });

        const s: Sentence = { id, aid: r.id, segs, plain: segs.map((g) => g.t).join(""), ko };
        for (const g of segs) {
          const x = g.xid && xmap[g.xid];
          if (x && !x.ctx) x.ctx = s;
        }
        words += s.plain.split(/\s+/).length;
        sent[id] = s;
        return s;
      }),
    );

    const art: Article = {
      id: r.id,
      src: r.src,
      kind: r.kind ?? "article",
      sourceLine: r.sourceLine,
      date: r.date,
      url: r.url,
      titleKo: r.titleKo,
      titleEn: r.titleEn,
      summary: r.summary,
      xs,
      paras,
      min: Math.max(1, Math.ceil(words / 70)),
    };
    arts.push(art);
    byId[r.id] = art;
  }
  return { arts, byId, sent, expr, exprList };
}

export const lib = parse();

export const FILTERS: [key: string, label: string][] = [
  ["all", "전체"],
  ["figma", "Figma"],
  ["medium", "Medium"],
  ["hn", "Hacker News"],
  ["nng", "NN/g"],
  ["lenny", "Lenny's Podcast"],
];
