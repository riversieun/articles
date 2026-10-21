"use client";

import Link from "next/link";
import { articleProps, track } from "@/lib/analytics";
import { lib } from "@/lib/content";
import { useStore } from "@/lib/store";
import { GuestNotice } from "@/components/GuestNotice";
import { IconBookmark, IconChevron } from "@/components/icons";

export default function ExpressionsPage() {
  const { ready, savedX, toggleX } = useStore();
  const saved = lib.exprList.filter((x) => savedX[x.id]);

  return (
    <div>
      <GuestNotice />

      {ready && saved.length === 0 && (
        <div className="mx-5 flex flex-col items-start gap-2 rounded-[20px] bg-panel px-5 py-6">
          <h2 className="m-0 text-lg leading-[1.4] font-bold tracking-[-0.02em]">아직 저장한 표현이 없어요</h2>
          <p className="m-0 text-[14.5px] leading-[1.65] text-sub">
            글을 끝까지 읽으면 본문의 주요 표현이 정리돼요. 복습하고 싶은 표현의 책갈피를 눌러 보세요.
          </p>
          <Link
            href="/"
            className="mt-2.5 flex h-12 items-center rounded-3xl bg-lime px-[22px] text-[15px] font-semibold text-ink no-underline"
          >
            글 읽으러 가기
          </Link>
        </div>
      )}

      {saved.length > 0 && (
        <>
        <div className="px-5 pb-2 text-[13px] font-medium text-sub">{saved.length}개</div>
        <ul className="m-0 flex list-none flex-col gap-2.5 px-5 pb-7">
          {saved.map((x, i) => (
            <li key={x.id} className="flex flex-col gap-2 rounded-[18px] bg-panel pt-3.5 pr-1.5 pb-1 pl-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col items-start gap-1.5 pt-1">
                  <span
                    lang="en"
                    className="rounded bg-lime px-1 font-serif text-xl leading-[1.3] font-semibold"
                  >
                    {x.term}
                  </span>
                  <span className="text-[15px] leading-normal font-semibold">{x.meaning}</span>
                </div>
                <button
                  onClick={() => toggleX(x.id)}
                  aria-label="표현 저장 해제"
                  aria-pressed="true"
                  className="-mt-1 flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-ink"
                >
                  <IconBookmark filled />
                </button>
              </div>
              <p className="m-0 mr-2.5 text-[13.5px] leading-[1.6] text-sub">{x.note}</p>
              {x.ctx && (
                <div className="mr-2.5 flex flex-col gap-1 border-t border-line-2 pt-2.5">
                  <p lang="en" className="m-0 font-serif text-base leading-[1.55]">
                    {x.ctx.plain}
                  </p>
                  <p className="m-0 text-[13.5px] leading-[1.6] text-sub">{x.ctx.ko}</p>
                </div>
              )}
              <Link
                href={`/contents/${x.aid}`}
                onClick={() => track("Article Opened", { ...articleProps(x.aid), entry_point: "expressions", position: i })}
                className="mr-2.5 flex min-h-11 items-center justify-between gap-2 text-[13.5px] font-semibold text-ink no-underline"
              >
                <span lang="en">{lib.byId[x.aid].titleEn}</span>
                <IconChevron size={16} />
              </Link>
            </li>
          ))}
        </ul>
        </>
      )}
    </div>
  );
}
