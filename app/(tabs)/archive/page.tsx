"use client";

import Link from "next/link";
import { useState } from "react";
import { articleProps, track } from "@/lib/analytics";
import { lib } from "@/lib/content";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { GuestNotice } from "@/components/GuestNotice";
import { IconChevron, IconPen, IconTrash } from "@/components/icons";

type Seg = "hl" | "notes" | "saved";

type Item =
  | { kind: "hl"; key: string; quote: string; sid: string }
  | { kind: "comment"; key: string; quote: string; text: string; id: string }
  | { kind: "thought"; key: string; text: string; id: string };

export default function ArchivePage() {
  const { ready, notes, hl, savedA, removeNote, editNote, toggleHl } = useStore();
  const [seg, setSeg] = useState<Seg>("hl");

  // 하이라이트: 코멘트 유무와 관계없이 하이라이트한 모든 문장
  const hlItems = (a: Article): Item[] =>
    a.paras
      .flat()
      .filter((s) => hl[s.id])
      .map((s) => ({ kind: "hl", key: `h-${s.id}`, quote: s.plain, sid: s.id }));

  // 코멘트: 문장 코멘트(문장 순서) → 글 전체 "읽고 난 생각"
  const noteItems = (a: Article): Item[] => {
    const out: Item[] = [];
    for (const s of a.paras.flat()) {
      for (const n of notes.filter((n) => n.sid === s.id)) {
        out.push({ kind: "comment", key: n.id, quote: s.plain, text: n.text, id: n.id });
      }
    }
    for (const n of notes.filter((n) => n.aid === a.id && !n.sid)) {
      out.push({ kind: "thought", key: n.id, text: n.text, id: n.id });
    }
    return out;
  };

  const group = (fn: (a: Article) => Item[]) =>
    lib.arts.map((a) => ({ a, items: fn(a) })).filter((g) => g.items.length > 0);
  const hlGroups = group(hlItems);
  const noteGroups = group(noteItems);
  const count = (g: { items: Item[] }[]) => g.reduce((n, x) => n + x.items.length, 0);

  const savedArts = lib.arts.filter((a) => savedA[a.id]);
  const groups = seg === "notes" ? noteGroups : hlGroups;

  const tabs: [Seg, string, number][] = [
    ["hl", "하이라이트", count(hlGroups)],
    ["notes", "코멘트", count(noteGroups)],
    ["saved", "저장한 글", savedArts.length],
  ];

  return (
    <div>
      <GuestNotice />

      <div className="flex flex-col gap-5 px-5 pb-7">
        <div className="grid grid-cols-3 gap-1 rounded-[26px] bg-panel p-1">
          {tabs.map(([key, label, n]) => {
            const on = seg === key;
            return (
              <button
                key={key}
                aria-pressed={on}
                onClick={() => setSeg(key)}
                className={`flex h-11 items-center justify-center gap-[5px] rounded-[22px] border-0 text-sm whitespace-nowrap ${
                  on ? "bg-ink font-bold text-white" : "bg-transparent font-medium text-ink"
                }`}
              >
                <span>{label}</span>
                <span className="text-[12.5px] font-medium">{n}</span>
              </button>
            );
          })}
        </div>

        {seg === "hl" && ready && hlGroups.length === 0 && (
          <Empty
            title="아직 하이라이트한 문장이 없어요"
            body="글을 읽다가 기억하고 싶은 문장을 눌러 하이라이트해 보세요."
          />
        )}
        {seg === "notes" && ready && noteGroups.length === 0 && (
          <Empty
            title="아직 남긴 코멘트가 없어요"
            body="문장을 눌러 코멘트를 남기거나, 글 맨 아래에 읽고 난 생각을 적어 보세요."
          />
        )}
        {seg === "saved" && ready && savedArts.length === 0 && (
          <Empty
            title="아직 저장한 글이 없어요"
            body="다시 읽고 싶은 글은 본문 오른쪽 위 책갈피로 저장해 두세요."
          />
        )}

        {seg !== "saved" && groups.length > 0 && (
          <div className="flex flex-col gap-7">
            {groups.map(({ a, items }, gi) => (
              <section key={a.id} className="flex flex-col gap-2">
                <Link
                  href={`/contents/${a.id}`}
                  onClick={() => track("Article Opened", { ...articleProps(a.id), entry_point: "archive", position: gi })}
                  className="flex min-h-11 items-center justify-between gap-3 text-left text-ink no-underline"
                >
                  <span className="flex flex-col gap-[3px]">
                    <span className="text-[12.5px] text-sub">{a.sourceLine}</span>
                    <span lang="en" className="text-[17px] leading-[1.3] font-bold tracking-[-0.02em]">
                      {a.titleEn}
                    </span>
                  </span>
                  <IconChevron size={18} />
                </Link>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {items.map((it) => (
                    <li
                      key={it.key}
                      className="flex flex-col gap-2 rounded-2xl bg-panel pt-3.5 pr-1 pb-0.5 pl-3.5"
                    >
                      {it.kind !== "thought" && (
                        <p lang="en" className="m-0 mr-2.5 font-serif text-[16.5px] leading-[1.6]">
                          <span
                            className={`rounded-[3px] box-decoration-clone px-[3px] py-px ${
                              it.kind === "hl" ? "bg-lilac" : "bg-lilac-strong"
                            }`}
                          >
                            {it.quote}
                          </span>
                        </p>
                      )}
                      {it.kind !== "hl" && (
                        <p className="m-0 mr-2.5 text-[15px] leading-[1.65] whitespace-pre-wrap">{it.text}</p>
                      )}
                      <div className="flex items-center justify-end">
                        {it.kind !== "hl" && (
                          <button
                            onClick={() => editNote(it.id)}
                            aria-label="수정"
                            className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-sub"
                          >
                            <IconPen size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => (it.kind === "hl" ? toggleHl(it.sid) : removeNote(it.id))}
                          aria-label={it.kind === "hl" ? "하이라이트 해제" : "삭제"}
                          className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-sub"
                        >
                          <IconTrash size={18} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {seg === "saved" && savedArts.length > 0 && (
          <ul className="m-0 flex list-none flex-col p-0">
            {savedArts.map((a, i) => (
              <li key={a.id} className="flex border-t border-line">
                <Link
                  href={`/contents/${a.id}`}
                  onClick={() => track("Article Opened", { ...articleProps(a.id), entry_point: "saved", position: i })}
                  className="flex flex-1 flex-col gap-1.5 py-[18px] text-left text-ink no-underline"
                >
                  <span className="text-[12.5px] text-sub">{a.sourceLine}</span>
                  <span lang="en" className="text-[19px] leading-[1.25] font-bold tracking-[-0.02em] [text-wrap:pretty]">
                    {a.titleEn}
                  </span>
                  <span className="text-[13.5px] leading-normal text-sub">{a.titleKo}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-[20px] bg-panel px-5 py-6">
      <h2 className="m-0 text-lg leading-[1.4] font-bold tracking-[-0.02em]">{title}</h2>
      <p className="m-0 text-[14.5px] leading-[1.65] text-sub">{body}</p>
      <Link
        href="/"
        className="mt-2.5 flex h-12 items-center rounded-3xl bg-lime px-[22px] text-[15px] font-semibold text-ink no-underline"
      >
        글 읽으러 가기
      </Link>
    </div>
  );
}
