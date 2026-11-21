"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { articleProps, track } from "@/lib/analytics";
import { formatTimestamp, lib } from "@/lib/content";
import { useStore } from "@/lib/store";
import { ArticleRow } from "@/components/ArticleRow";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { FilterChip } from "@/components/FilterChip";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconCaretRight, IconPencilFill, IconTrashFill } from "@/components/icons";

/**
 * 아카이브는 "저장한 아티클"과 "내 생각" 두 칩만 보여준다(이 순서).
 * 하이라이트·코멘트 데이터와 기능은 그대로 두었고(문장 병기 리더 /contents/[id]/read), 이 화면에서만 뺐다.
 */
type Seg = "thoughts" | "saved";

/** Archive Filter Selected 의 filter 값 */
const SEG_KEY: Record<Seg, string> = {
  thoughts: "thoughts",
  saved: "articles",
};

const TABS: [Seg, string][] = [
  ["saved", "저장한 아티클"],
  ["thoughts", "내 생각"],
];

export default function ArchivePage() {
  const { ready, notes, savedA, removeNote, editNote } = useStore();
  const [seg, setSeg] = useState<Seg>("saved");
  const [delId, setDelId] = useState("");

  // 내 생각: 글 아래 "내 생각"에 직접 적은 글 전체 단위 생각
  const thoughtCards = lib.arts.flatMap((a) => notes.filter((n) => n.aid === a.id && !n.sid).map((n) => ({ a, n })));

  // 저장한 글 목록은 이 화면에 들어오거나 탭을 열 때의 상태를 기준으로 고정한다.
  // 저장을 해제해도 카드는 그대로 두고 아이콘만 바뀌며, 화면을 벗어났다 돌아오면 사라진다.
  const [snap, setSnap] = useState<string[] | null>(null);
  useEffect(() => {
    if (ready && seg === "saved") setSnap(Object.keys(savedA));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, seg]);
  const savedArts = lib.arts.filter((a) => (snap ? snap.includes(a.id) : savedA[a.id]));

  return (
    <div>
      <div className="ns sticky top-12 z-20 flex gap-2 overflow-x-auto bg-surface px-6 pt-2 pb-1">
        {TABS.map(([key, label]) => (
          <FilterChip
            key={key}
            on={seg === key}
            onClick={() => {
              if (key !== seg) track("Archive Filter Selected", { filter: SEG_KEY[key] });
              setSeg(key);
            }}
          >
            {label}
          </FilterChip>
        ))}
      </div>

      {seg === "thoughts" && ready && thoughtCards.length === 0 && <Empty title="아직 남긴 생각이 없어요" />}
      {seg === "saved" && ready && savedArts.length === 0 && <Empty title="아직 저장한 아티클이 없어요" />}

      {seg === "thoughts" && thoughtCards.length > 0 && (
        <ul className="m-0 flex list-none flex-col gap-6 px-6 pt-6 pb-28">
          {thoughtCards.map(({ a, n }, i) => (
            <li key={n.id} className="flex flex-col gap-6 rounded-card border border-pd-line bg-surface p-5">
              <div className="flex flex-col gap-6">
                <div className="flex h-6 items-center justify-between">
                  <span className="text-caption text-pd-ink-muted">{formatTimestamp(n.at)}</span>
                  {/* 보이는 아이콘은 20px, 누르는 영역은 44px. 아이콘 사이 16px */}
                  <div className="-mr-3 flex items-center -space-x-2">
                    <button
                      onClick={() => editNote(n.id)}
                      aria-label="수정"
                      className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-pd-ink-muted"
                    >
                      <IconPencilFill />
                    </button>
                    <button
                      onClick={() => setDelId(n.id)}
                      aria-label="삭제"
                      className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-pd-ink-muted"
                    >
                      <IconTrashFill />
                    </button>
                  </div>
                </div>
                <p className="m-0 text-body-md leading-6 whitespace-pre-wrap text-pd-ink">{n.text}</p>
              </div>
              <Link
                href={`/contents/${a.id}`}
                onClick={() => track("Article Opened", { ...articleProps(a.id), entry_point: "archive", position: i })}
                className="flex items-start gap-1.5 rounded-panel bg-pd-tint p-4 text-left no-underline"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="truncate text-body-sm leading-5 font-medium text-pd-ink">{a.titleKo}</span>
                  <span lang="en" className="truncate text-body-sm leading-5 text-pd-ink-muted">
                    {a.titleEn}
                  </span>
                </span>
                <IconCaretRight className="shrink-0 text-pd-ink-muted" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {seg === "saved" && savedArts.length > 0 && (
        <div className="flex flex-col pb-4">
          {savedArts.map((a, i) => (
            <ArticleRow key={a.id} a={a} position={i} entryPoint="saved" />
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!delId}
        onOpenChange={(o) => !o && setDelId("")}
        onConfirm={() => removeNote(delId)}
      />
    </div>
  );
}

function Empty({ title, body }: { title: string; body?: string }) {
  return (
    <div className="flex min-h-[55dvh] flex-col items-center justify-center gap-5 px-6 text-center">
      <div className="flex flex-col items-center gap-2">
        <h2 className="m-0 text-title-md font-semibold">{title}</h2>
        {body && <p className="m-0 text-body-sm text-on-surface-muted">{body}</p>}
      </div>
      <Link
        href="/explore"
        className={cn(buttonVariants({ variant: "accent" }), "flex h-12 rounded-pill px-[22px] text-body-md font-semibold no-underline")}
      >
        아티클 읽으러 가기
      </Link>
    </div>
  );
}
