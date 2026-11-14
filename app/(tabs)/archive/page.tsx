"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { articleProps, track } from "@/lib/analytics";
import { TOPIC_LABEL, formatTimestamp, lib } from "@/lib/content";
import { useStore } from "@/lib/store";
import { ArticleRow } from "@/components/ArticleRow";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { FilterChip } from "@/components/FilterChip";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { IconChevron, IconPen, IconTrash } from "@/components/icons";

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
  const thoughtGroups = lib.arts
    .map((a) => ({ a, items: notes.filter((n) => n.aid === a.id && !n.sid) }))
    .filter((g) => g.items.length > 0);

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
      <div className="ns sticky top-12 z-20 flex gap-2 overflow-x-auto bg-surface px-6 pt-3 pb-1">
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

      {seg === "thoughts" && ready && thoughtGroups.length === 0 && <Empty title="아직 남긴 생각이 없어요" />}
      {seg === "saved" && ready && savedArts.length === 0 && <Empty title="아직 저장한 아티클이 없어요" />}

      {seg === "thoughts" && thoughtGroups.length > 0 && (
        <div className="flex flex-col gap-7 px-6 pt-5 pb-7">
          {thoughtGroups.map(({ a, items }, gi) => (
            <section key={a.id} className="flex flex-col gap-2">
              <Link
                href={`/contents/${a.id}`}
                onClick={() => track("Article Opened", { ...articleProps(a.id), entry_point: "archive", position: gi })}
                className="flex flex-col items-start gap-2 py-1 text-left text-on-surface no-underline"
              >
                <Badge variant="secondary" className="h-7 rounded-md border-0 px-3 text-label-sm">
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
                {items.map((n) => (
                  <li key={n.id} className="flex flex-col gap-2 rounded-card bg-surface-muted pt-3.5 pr-1 pb-0.5 pl-3.5">
                    <p className="m-0 mr-2.5 text-body-md whitespace-pre-wrap">{n.text}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-label-sm text-on-surface-muted">{formatTimestamp(n.at)}</span>
                      <div className="flex items-center">
                        <button
                          onClick={() => editNote(n.id)}
                          aria-label="수정"
                          className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-on-surface-muted"
                        >
                          <IconPen size={18} />
                        </button>
                        <button
                          onClick={() => setDelId(n.id)}
                          aria-label="삭제"
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
        <h2 className="m-0 text-body-lg font-semibold">{title}</h2>
        {body && <p className="m-0 text-body-sm text-on-surface-muted">{body}</p>}
      </div>
      <Link
        href="/explore"
        className={buttonVariants({
          variant: "accent",
          className: "flex h-12 rounded-pill px-[22px] text-body-md font-semibold no-underline",
        })}
      >
        아티클 읽으러 가기
      </Link>
    </div>
  );
}
