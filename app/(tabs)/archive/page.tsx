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
import { IconChevron, IconPen, IconTrash } from "@/components/icons";

type Seg = "hl" | "notes" | "thoughts" | "saved";

/** Archive Filter Selected 의 filter 값 */
const SEG_KEY: Record<Seg, string> = {
  hl: "highlights",
  notes: "comments",
  thoughts: "thoughts",
  saved: "articles",
};

type Item =
  | { kind: "hl"; key: string; quote: string; ko: string; sid: string }
  | { kind: "comment"; key: string; quote: string; ko: string; text: string; id: string }
  | { kind: "thought"; key: string; text: string; id: string; at: number };

export default function ArchivePage() {
  const { ready, notes, hl, savedA, removeNote, editNote, toggleHl } = useStore();
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

  // 저장한 글 목록은 이 화면에 들어오거나 탭을 열 때의 상태를 기준으로 고정한다.
  // 저장을 해제해도 카드는 그대로 두고 아이콘만 바뀌며, 화면을 벗어났다 돌아오면 사라진다.
  const [snap, setSnap] = useState<string[] | null>(null);
  useEffect(() => {
    if (ready && seg === "saved") setSnap(Object.keys(savedA));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, seg]);
  const savedArts = lib.arts.filter((a) => (snap ? snap.includes(a.id) : savedA[a.id]));
  const groups = seg === "notes" ? commentGroups : seg === "thoughts" ? thoughtGroups : hlGroups;

  const tabs: [Seg, string][] = [
    ["hl", "하이라이트"],
    ["notes", "코멘트"],
    ["thoughts", "내 생각"],
    ["saved", "아티클"],
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 px-5 pb-7">
        <div className="ns sticky top-14 z-20 -mx-5 -mb-3 flex gap-2 overflow-x-auto bg-surface px-5 pb-3">
          {tabs.map(([key, label]) => (
            <Button
              key={key}
              variant={seg === key ? "default" : "secondary"}
              aria-pressed={seg === key}
              onClick={() => {
                if (key !== seg) track("Archive Filter Selected", { filter: SEG_KEY[key] });
                setSeg(key);
              }}
              className="shrink-0 gap-1.5 px-4"
            >
              {label}
            </Button>
          ))}
        </div>

        {seg === "hl" && ready && hlGroups.length === 0 && (
          <Empty title="아직 하이라이트한 문장이 없어요" body="아티클에서 기억하고 싶은 문장을 눌러 하이라이트해 보세요." />
        )}
        {seg === "notes" && ready && commentGroups.length === 0 && (
          <Empty title="아직 남긴 코멘트가 없어요" body="아티클에서 생각을 남기고 싶은 문장을 눌러 코멘트해 보세요." />
        )}
        {seg === "thoughts" && ready && thoughtGroups.length === 0 && (
          <Empty title="아직 남긴 생각이 없어요" />
        )}
        {seg === "saved" && ready && savedArts.length === 0 && (
          <Empty title="아직 저장한 아티클이 없어요" />
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
                              <span className="-mx-[3px] rounded-[3px] box-decoration-clone bg-accent-sub px-[3px] py-px">
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

function Empty({ title, body }: { title: string; body?: string }) {
  return (
    <div className="flex min-h-[55dvh] flex-col items-center justify-center gap-5 text-center">
      <div className="flex flex-col items-center gap-2">
        <h2 className="m-0 text-body-lg font-semibold">{title}</h2>
        {body && <p className="m-0 text-body-sm text-on-surface-muted">{body}</p>}
      </div>
      <Link
        href="/"
        className={buttonVariants({
          variant: "accent",
          className: "flex h-12 rounded-pill px-[22px] text-body-md font-semibold no-underline",
        })}
      >
        글 읽으러 가기
      </Link>
    </div>
  );
}
