"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { articleProps, track } from "@/lib/analytics";
import { TOPIC_LABEL, formatTimestamp, lib } from "@/lib/content";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { ArticleRow } from "@/components/ArticleRow";
import { BUBBLE_CLASS } from "@/components/CommentBubble";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { IconBookmark, IconChevron, IconPen, IconTrash } from "@/components/icons";

type Seg = "hl" | "notes" | "thoughts" | "saved" | "expr";

type Item =
  | { kind: "hl"; key: string; quote: string; ko: string; sid: string }
  | { kind: "comment"; key: string; quote: string; ko: string; text: string; id: string }
  | { kind: "thought"; key: string; text: string; id: string; at: number };

export default function ArchivePage() {
  const { ready, notes, hl, savedA, savedX, removeNote, editNote, toggleHl, toggleX } = useStore();
  const [seg, setSeg] = useState<Seg>("hl");
  const [del, setDel] = useState<Item | null>(null);

  // 하이라이트: 코멘트 유무와 관계없이 하이라이트한 모든 문장
  const hlItems = (a: Article): Item[] =>
    a.paras
      .flat()
      .filter((s) => hl[s.id])
      .map((s) => ({ kind: "hl", key: `h-${s.id}`, quote: s.plain, ko: s.ko, sid: s.id }));

  // 코멘트: 문장에 남긴 코멘트(문장 순서)
  const commentItems = (a: Article): Item[] => {
    const out: Item[] = [];
    for (const s of a.paras.flat()) {
      for (const n of notes.filter((n) => n.sid === s.id)) {
        out.push({ kind: "comment", key: n.id, quote: s.plain, ko: s.ko, text: n.text, id: n.id });
      }
    }
    return out;
  };

  // 내 생각: 글 아래 "내 생각"에 직접 적은 글 전체 단위 생각
  const thoughtItems = (a: Article): Item[] =>
    notes
      .filter((n) => n.aid === a.id && !n.sid)
      .map((n) => ({ kind: "thought", key: n.id, text: n.text, id: n.id, at: n.at }));

  const group = (fn: (a: Article) => Item[]) =>
    lib.arts.map((a) => ({ a, items: fn(a) })).filter((g) => g.items.length > 0);
  const hlGroups = group(hlItems);
  const commentGroups = group(commentItems);
  const thoughtGroups = group(thoughtItems);
  const count = (g: { items: Item[] }[]) => g.reduce((n, x) => n + x.items.length, 0);

  // 저장한 글 목록은 이 화면에 들어오거나 탭을 열 때의 상태를 기준으로 고정한다.
  // 저장을 해제해도 카드는 그대로 두고 아이콘만 바뀌며, 화면을 벗어났다 돌아오면 사라진다.
  const [snap, setSnap] = useState<string[] | null>(null);
  useEffect(() => {
    if (ready && seg === "saved") setSnap(Object.keys(savedA));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, seg]);
  const savedArts = lib.arts.filter((a) => (snap ? snap.includes(a.id) : savedA[a.id]));
  const savedExprs = lib.exprList.filter((x) => savedX[x.id]);
  const groups = seg === "notes" ? commentGroups : seg === "thoughts" ? thoughtGroups : hlGroups;

  const tabs: [Seg, string, number][] = [
    ["hl", "하이라이트", count(hlGroups)],
    ["notes", "코멘트", count(commentGroups)],
    ["thoughts", "내 생각", count(thoughtGroups)],
    ["saved", "아티클", lib.arts.filter((a) => savedA[a.id]).length],
    ["expr", "표현", savedExprs.length],
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 px-5 pb-7">
        <div className="ns sticky top-14 z-20 -mx-5 -mb-3 flex gap-2 overflow-x-auto bg-surface px-5 pb-3">
          {tabs.map(([key, label, n]) => (
            <Button
              key={key}
              variant={seg === key ? "default" : "secondary"}
              aria-pressed={seg === key}
              onClick={() => setSeg(key)}
              className="shrink-0 gap-1.5 px-4"
            >
              <span>{label}</span>
              <span className="text-label-sm">{n}</span>
            </Button>
          ))}
        </div>

        {seg === "hl" && ready && hlGroups.length === 0 && (
          <Empty
            title="아직 하이라이트한 문장이 없어요"
            body="글을 읽다가 기억하고 싶은 문장을 눌러 하이라이트해 보세요."
          />
        )}
        {seg === "notes" && ready && commentGroups.length === 0 && (
          <Empty title="아직 남긴 코멘트가 없어요" body="글을 읽다가 문장을 눌러 코멘트를 남겨 보세요." />
        )}
        {seg === "thoughts" && ready && thoughtGroups.length === 0 && (
          <Empty title="아직 남긴 생각이 없어요" body="글 아래 '내 생각'에 느낀 점과 적용해볼 점을 적어 보세요." />
        )}
        {seg === "saved" && ready && savedArts.length === 0 && (
          <Empty
            title="아직 저장한 아티클이 없어요"
            body="다시 읽고 싶은 아티클은 본문 오른쪽 위 책갈피로 저장해 두세요."
          />
        )}

        {seg === "expr" && ready && savedExprs.length === 0 && (
          <Empty
            title="아직 저장한 표현이 없어요"
            body="아티클 아래 '눈여겨볼 표현'에서 복습하고 싶은 표현의 책갈피를 눌러 보세요."
          />
        )}

        {seg === "expr" && savedExprs.length > 0 && (
          <ul className="m-0 flex list-none flex-col gap-4 p-0">
            {savedExprs.map((x, i) => (
            <li key={x.id} className="flex flex-col gap-2 rounded-card bg-surface-muted pt-3.5 pr-1.5 pb-1 pl-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col items-start pt-1">
                  <span lang="en" className="text-headline font-semibold tracking-headline">
                    {x.term}
                  </span>
                  <span className="mt-0.5 text-body-md font-semibold">{x.meaning}</span>
                </div>
                <button
                  onClick={() => toggleX(x.id)}
                  aria-label="표현 저장 해제"
                  aria-pressed="true"
                  className="-mt-1 flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-on-surface"
                >
                  <IconBookmark filled />
                </button>
              </div>
              <p className="m-0 mr-2.5 text-body-sm text-on-surface-muted">{x.note}</p>
              {x.ctx && (
                <div className="mt-2 mr-2.5 flex flex-col gap-1 border-t border-border-strong pt-4">
                  <p lang="en" className="m-0 text-body-md">
                    {x.ctx.segs.map((g, gi) =>
                      g.xid === x.id ? (
                        <span key={gi} className="rounded bg-lime px-[3px] text-on-surface">
                          {g.t}
                        </span>
                      ) : (
                        <span key={gi}>{g.t}</span>
                      ),
                    )}
                  </p>
                  <p className="m-0 text-body-sm text-on-surface-muted">{x.ctx.ko}</p>
                </div>
              )}
              <Link
                href={`/contents/${x.aid}`}
                onClick={() => track("Article Opened", { ...articleProps(x.aid), entry_point: "expressions", position: i })}
                className="mr-2.5 flex min-h-11 items-center justify-between gap-2 text-label-md font-semibold text-on-surface no-underline"
              >
                <span lang="en">{lib.byId[x.aid].titleEn}</span>
                <IconChevron size={16} />
              </Link>
            </li>
          ))}
          </ul>
        )}

        {(seg === "hl" || seg === "notes" || seg === "thoughts") && groups.length > 0 && (
          <div className="flex flex-col gap-7">
            {groups.map(({ a, items }, gi) => (
              <section key={a.id} className="flex flex-col gap-2">
                <Link
                  href={`/contents/${a.id}`}
                  onClick={() => track("Article Opened", { ...articleProps(a.id), entry_point: "archive", position: gi })}
                  className="flex flex-col items-start gap-2 py-1 text-left text-on-surface no-underline"
                >
                  <Badge variant="secondary" className="h-7 rounded-md px-3 text-label-sm">
                    {TOPIC_LABEL[a.topic]}
                  </Badge>
                  <span className="flex w-full items-start gap-2">
                    <span lang="en" className="min-w-0 flex-1 text-body-md font-bold">
                      {a.titleEn}
                    </span>
                    <span className="flex h-5 shrink-0 items-center">
                      <IconChevron size={18} />
                    </span>
                  </span>
                  <span className="-mt-1 text-body-sm text-on-surface-muted">{a.titleKo}</span>
                </Link>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {items.map((it) => (
                    <li
                      key={it.key}
                      className="flex flex-col gap-2 rounded-card bg-surface-muted pt-3.5 pr-1 pb-0.5 pl-3.5"
                    >
                      {it.kind !== "thought" && (
                        <div className="mr-2.5 flex flex-col gap-1.5">
                          <p lang="en" className="m-0 text-body-md">
                            {it.kind === "hl" ? (
                              <span className="rounded-[3px] box-decoration-clone bg-accent-sub px-[3px] py-px">
                                {it.quote}
                              </span>
                            ) : (
                              it.quote
                            )}
                          </p>
                          <p className="m-0 text-body-sm text-on-surface-muted">{it.ko}</p>
                        </div>
                      )}
                      {it.kind === "comment" && (
                        <div className="mr-2.5 flex">
                          <span className={BUBBLE_CLASS}>{it.text}</span>
                        </div>
                      )}
                      {it.kind === "thought" && (
                        <p className="m-0 mr-2.5 text-body-md whitespace-pre-wrap">{it.text}</p>
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-label-sm text-on-surface-muted">
                          {it.kind === "thought" ? formatTimestamp(it.at) : ""}
                        </span>
                        <div className="flex items-center">
                          {it.kind !== "hl" && (
                            <button
                              onClick={() => editNote(it.id)}
                              aria-label="수정"
                              className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-on-surface-muted"
                            >
                              <IconPen size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => setDel(it)}
                            aria-label={it.kind === "hl" ? "하이라이트 해제" : "삭제"}
                            className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-on-surface-muted"
                          >
                            <IconTrash size={18} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {seg === "saved" && savedArts.length > 0 && (
          <div className="-mx-5 -mt-5 flex flex-col">
            {savedArts.map((a, i) => (
              <ArticleRow key={a.id} a={a} position={i} entryPoint="saved" />
            ))}
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={!!del}
        onOpenChange={(o) => !o && setDel(null)}
        onConfirm={() => {
          if (!del) return;
          if (del.kind === "hl") toggleHl(del.sid);
          else removeNote(del.id);
        }}
      />
    </div>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-card bg-surface-muted px-5 py-6">
      <h2 className="m-0 text-headline font-bold tracking-headline">{title}</h2>
      <p className="m-0 text-body-sm text-on-surface-muted">{body}</p>
      <Link
        href="/"
        className={buttonVariants({
          variant: "accent",
          className: "mt-2.5 flex h-12 rounded-pill px-[22px] text-body-md font-semibold no-underline",
        })}
      >
        글 읽으러 가기
      </Link>
    </div>
  );
}
