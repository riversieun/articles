"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { articleProps, track } from "@/lib/analytics";
import { SOURCE_LABEL, TOPIC_LABEL, formatTimestamp, lib } from "@/lib/content";
import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { CommentBubble } from "./CommentBubble";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { MenuBtn } from "./MenuBtn";
import { ToggleSwitch } from "./ToggleSwitch";
import { Textarea } from "@/components/ui/textarea";
import {
  IconBack,
  IconBookmark,
  IconClose,
  IconComment,
  IconHighlighter,
  IconPen,
  IconSparkle,
  IconTrash,
} from "./icons";

const TIP_W = 268;
const COMPLETE_AT = 90; // 완독 기준: 본문 영역 스크롤 90% (PRD F-41의 95%에서 변경)

type Tip = { sid: string; xid: string; top: number; left: number; arrow: number };

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function Reader({ aid }: { aid: string }) {
  const art = lib.byId[aid];
  const router = useRouter();
  const {
    showKo,
    hl,
    notes,
    savedX,
    savedA,
    toggleKo,
    toggleHl,
    openComment,
    editNote,
    toggleX,
    toggleA,
    addThought,
    removeNote,
  } = useStore();

  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState<Tip | null>(null);
  const [menu, setMenu] = useState("");
  const [thought, setThought] = useState("");
  const [delId, setDelId] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const maxPctRef = useRef(0);
  const completedRef = useRef(false);

  // 상단 프로그레스: 본문 끝 표식까지의 스크롤 진행률
  useEffect(() => {
    const update = () => {
      const end = endRef.current;
      if (!end) return;
      const endTop = end.getBoundingClientRect().top + window.scrollY;
      const span = Math.max(1, endTop - window.innerHeight + 40);
      const pct = Math.round(clamp(window.scrollY / span, 0, 1) * 100);
      setProgress(pct);
      maxPctRef.current = Math.max(maxPctRef.current, pct);
      if (pct >= COMPLETE_AT) {
        if (!completedRef.current) {
          completedRef.current = true;
          track("Article Completed", articleProps(aid));
        }
      }
    };
    maxPctRef.current = 0;
    completedRef.current = false;
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [aid]);

  // 체류 시간: 탭이 보이는 동안만 센다. 글을 떠나거나 탭을 닫을 때 한 번 보낸다.
  useEffect(() => {
    let visibleMs = 0;
    let since = document.visibilityState === "visible" ? Date.now() : 0;
    let sent = false;

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        since = Date.now();
      } else if (since) {
        visibleMs += Date.now() - since;
        since = 0;
      }
    };
    const send = () => {
      if (sent) return;
      sent = true;
      if (since) visibleMs += Date.now() - since;
      if (visibleMs < 1000) return;
      track("Article Read", {
        ...articleProps(aid),
        seconds_visible: Math.round(visibleMs / 1000),
        max_scroll_pct: maxPctRef.current,
        completed: completedRef.current,
      });
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", send);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", send);
      send();
    };
  }, [aid]);

  // 툴팁/메뉴 바깥을 누르면 닫기
  useEffect(() => {
    if (!tip && !menu) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t && t.closest("[data-sent]")) return;
      setTip(null);
      setMenu("");
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [tip, menu]);

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const openTip = (sid: string, xid: string, e: React.MouseEvent<HTMLButtonElement>) => {
    if (tip && tip.sid === sid && tip.xid === xid) {
      setTip(null);
      return;
    }
    track("Expression Tooltip Opened", { ...articleProps(aid), expression_id: xid });
    const btn = e.currentTarget;
    const block = btn.closest<HTMLElement>("[data-sent]");
    let top = 44;
    let cx = 120;
    let bw = 370;
    if (block) {
      const b = btn.getBoundingClientRect();
      const r = block.getBoundingClientRect();
      top = b.bottom - r.top + 12;
      cx = b.left - r.left + b.width / 2;
      bw = r.width;
    }
    const left = clamp(cx - TIP_W / 2, 4, bw - TIP_W - 4);
    const arrow = clamp(cx - left - 6, 16, TIP_W - 28);
    setTip({ sid, xid, top, left, arrow });
    setMenu("");
  };

  const tapComment = (nid: string) => {
    setTip(null);
    setMenu((m) => (m === `c-${nid}` ? "" : `c-${nid}`));
  };

  const tapSentence = (sid: string) => {
    if (menu !== sid) track("Sentence Action Sheet Opened", { article_id: aid, sentence_id: sid });
    setTip(null);
    setMenu((m) => (m === sid ? "" : sid));
  };

  // 글을 읽고 든 생각 = 유저가 직접 입력한 글 전체 단위 텍스트만 (문장 코멘트·하이라이트 제외)
  const artNotes = notes.filter((n) => n.aid === aid && !n.sid);

  const [y, m, d] = art.date.split(".").map(Number);
  const dateLabel = `${y}년 ${m}월 ${d}일`;

  return (
    <div className="min-h-dvh bg-surface">
      {/* 상단 고정: 뒤로가기 / 읽기 진행 / 번역 토글 / 글 저장 */}
      <div className="sticky top-0 z-30 bg-surface">
        <div className="flex h-14 items-center gap-1 pr-2 pl-1.5">
          <button
            onClick={goBack}
            aria-label="목록으로 돌아가기"
            className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-on-surface"
          >
            <IconBack />
          </button>
          <div className="min-w-0 flex-1" />
          <button
            role="switch"
            aria-checked={showKo}
            onClick={() => {
              setTip(null);
              setMenu("");
              toggleKo(aid);
            }}
            className="flex h-11 shrink-0 items-center gap-2 border-0 bg-transparent px-2 text-label-md font-medium text-on-surface"
          >
            <span>번역 켜기</span>
            <ToggleSwitch on={showKo} />
          </button>
          <button
            onClick={() => toggleA(aid)}
            aria-label="이 글 저장"
            aria-pressed={!!savedA[aid]}
            className={`flex size-11 shrink-0 items-center justify-center border-0 bg-transparent ${
              savedA[aid] ? "text-on-surface" : "text-on-surface-muted"
            }`}
          >
            <IconBookmark filled={!!savedA[aid]} size={24} />
          </button>
        </div>
        <div
          role="progressbar"
          aria-label="읽은 정도"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-[3px] bg-border-strong"
        >
          <div className="h-[3px] bg-lime transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <article className="px-5 pt-6 pb-10">
        <Badge variant="secondary" className="h-7 rounded-md px-3 text-label-sm">
          {TOPIC_LABEL[art.topic]}
        </Badge>
        <h1
          lang="en"
          className="mt-2 mb-0 text-display font-bold tracking-display [text-wrap:pretty]"
        >
          {art.titleEn}
        </h1>
        <p className="mt-2.5 mb-0 text-body-md text-on-surface-muted">{art.titleKo}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-1 text-body-sm text-on-surface-muted">
            <IconSparkle className="shrink-0 text-on-surface" />
            <span className="truncate">
              <span className="text-on-surface">{SOURCE_LABEL[art.src]}</span> · {dateLabel}
            </span>
          </span>
          <a
            href={art.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("Original Article Clicked", articleProps(aid))}
            className={cn(buttonVariants({ variant: "outline" }), "px-4 no-underline")}
          >
            원문 읽기
          </a>
        </div>

        <section className="mt-7 flex flex-col gap-2 rounded-card bg-surface-muted px-[18px] pt-4 pb-[18px]">
          <h2 className="m-0 text-label-md font-semibold">원문 요약</h2>
          <p className="m-0 text-body-md [word-break:normal]">{art.summary}</p>
        </section>

        <div className="mt-8 flex flex-col gap-[18px]">
          {art.blocks.map((b, pi) =>
            b.type === "gap" ? (
              <p
                key={pi}
                role="separator"
                aria-label="원문 중략"
                className="m-0 -my-2 text-center text-label-sm text-border-strong italic"
              >
                - 중략 -
              </p>
            ) : b.type === "h" ? (
              <div key={pi} className="mt-4 flex flex-col gap-1">
                <h2 lang="en" className="m-0 text-headline font-bold tracking-headline">
                  {b.en}
                </h2>
                {showKo && <p className="m-0 text-body-sm text-on-surface-muted">{b.ko}</p>}
              </div>
            ) : (
            <div key={pi} className="flex flex-col gap-1">
              {b.sentences.map((st) => {
                const tipOpen = tip?.sid === st.id;
                const menuOpen = menu === st.id;
                const isHl = !!hl[st.id];
                const x = tipOpen && tip ? lib.expr[tip.xid] : null;
                const comments = notes.filter((n) => n.sid === st.id);
                const activeComment = comments.find((n) => menu === `c-${n.id}`);

                return (
                  <div
                    key={st.id}
                    data-sent={st.id}
                    className={`relative -mx-2.5 rounded-lg px-2.5 py-[9px] ${
                      tipOpen || menuOpen || activeComment ? "z-[5]" : "z-[1]"
                    }`}
                  >
                    <button
                      onClick={() => tapSentence(st.id)}
                      aria-label="이 문장에 하이라이트 또는 코멘트"
                      aria-expanded={menuOpen}
                      className="absolute inset-0 h-full w-full rounded-lg border-0 bg-transparent p-0"
                    />
                    <p
                      lang="en"
                      className="pointer-events-none relative m-0 text-body-lg text-on-surface"
                    >
                      <span
                        className={`-mx-0.5 rounded-[3px] box-decoration-clone px-0.5 py-[0.2em] ${
                          isHl ? "bg-accent-sub" : menuOpen ? "bg-surface-muted" : ""
                        }`}
                      >
                      {st.segs.map((g, gi) =>
                        g.xid ? (
                          <button
                            key={gi}
                            onClick={(e) => openTip(st.id, g.xid, e)}
                            aria-expanded={tipOpen && tip?.xid === g.xid}
                            className={`pointer-events-auto relative m-0 inline rounded border-0 px-[3px] leading-[1.3] ${
                              tipOpen && tip?.xid === g.xid ? "bg-accent-strong text-on-accent" : "bg-lime text-on-surface"
                            }`}
                            style={{ font: "inherit" }}
                          >
                            {g.t}
                          </button>
                        ) : (
                          <span key={gi}>{g.t}</span>
                        ),
                      )}
                      </span>
                    </p>

                    {showKo && (
                      <p className="pointer-events-none relative mt-1.5 mb-0 text-body-sm text-on-surface-muted">
                        {st.ko}
                      </p>
                    )}

                    {comments.map((n) => (
                      <CommentBubble
                        key={n.id}
                        className="pointer-events-none mt-2"
                        text={n.text}
                        open={activeComment?.id === n.id}
                        onToggle={() => tapComment(n.id)}
                        onEdit={() => {
                          setMenu("");
                          editNote(n.id);
                        }}
                        onDelete={() => {
                          setMenu("");
                          setDelId(n.id);
                        }}
                      />
                    ))}

                    {tipOpen && tip && x && (
                      <div
                        role="status"
                        className="pop absolute z-[3] box-border rounded-xl bg-lime pt-3.5 pr-1 pb-3.5 pl-4 text-on-accent shadow-lg"
                        style={{ top: tip.top, left: tip.left, width: TIP_W }}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -top-[5px] block size-[11px] rotate-45 bg-lime"
                          style={{ left: tip.arrow }}
                        />
                        <div className="flex items-center justify-between gap-2">
                          <div lang="en" className="text-body-lg font-semibold text-on-accent">
                            {x.term}
                          </div>
                          <button
                            onClick={() => setTip(null)}
                            aria-label="뜻 닫기"
                            className="-my-2.5 flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-on-accent"
                          >
                            <IconClose size={17} />
                          </button>
                        </div>
                        <div className="mt-0.5 mr-3 text-body-md font-semibold">{x.meaning}</div>
                        <div className="mt-2 mr-3 text-body-sm text-on-surface-muted">{x.note}</div>
                      </div>
                    )}

                    {menuOpen && (
                      <div className="pop pointer-events-none absolute inset-x-0 bottom-full z-[3] -mb-1 flex justify-center">
                        <div className="pointer-events-auto flex items-center rounded-pill bg-primary px-1.5 whitespace-nowrap shadow-[0_12px_28px_rgba(17,17,17,0.28)]">
                          <MenuBtn
                            icon={<IconHighlighter size={18} />}
                            label={isHl ? "하이라이트 해제" : "하이라이트"}
                            onClick={() => {
                              setMenu("");
                              toggleHl(st.id);
                            }}
                          />
                          {comments.length === 0 && (
                            <>
                              <span aria-hidden="true" className="block h-5 w-px bg-surface/30" />
                              <MenuBtn
                                icon={<IconComment size={18} />}
                                label="코멘트"
                                onClick={() => {
                                  setMenu("");
                                  openComment(st.id);
                                }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 본문 끝 표식 — 프로그레스 100%의 기준 */}
        <div ref={endRef} />

        <section className="mt-20 flex flex-col gap-3">
          <h2 className="m-0 text-headline font-bold tracking-headline">내 생각</h2>
          {artNotes.length > 0 && (
          <ul className="m-0 mb-2 flex list-none flex-col gap-2 p-0">
            {artNotes.map((n) => {
              return (
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
              );
            })}
          </ul>
          )}
          <div className="flex flex-col gap-2">
            <label htmlFor="thought-input" className="sr-only">
              내 생각
            </label>
            <Textarea
              id="thought-input"
              rows={4}
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="느낀 점, 내 일에 적용해볼 점은?"
            />
            <div className="flex items-center justify-between gap-3 pl-2">
              <span className="text-body-sm text-on-surface-muted">입력한 내용은 나만 봐요.</span>
              <Button
                className="px-4"
                disabled={!thought.trim()}
                onClick={() => {
                  addThought(aid, thought);
                  setThought("");
                }}
              >
                생각 남기기
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-20 flex flex-col">

          <div className="flex items-center justify-between gap-3">
            <h2 className="m-0 text-headline font-bold tracking-headline">눈여겨볼 표현</h2>
          </div>
          <ul className="mx-0 mt-1 mb-0 flex list-none flex-col p-0">
            {art.xs.map((x) => {
              const on = !!savedX[x.id];
              return (
                <li key={x.id} className="flex flex-col border-b border-border py-5 last:border-b-0">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      lang="en"
                      className="text-body-lg font-semibold"
                    >
                      {x.term}
                    </span>
                    <button
                      onClick={() => toggleX(x.id)}
                      aria-label={on ? "표현 저장 해제" : "표현 저장"}
                      aria-pressed={on}
                      className={`-mt-2.5 -mr-2.5 -mb-2.5 flex size-11 shrink-0 items-center justify-center border-0 bg-transparent ${
                        on ? "text-on-surface" : "text-on-surface-muted"
                      }`}
                    >
                      <IconBookmark filled={on} />
                    </button>
                  </div>
                  <span className="mt-0.5 text-body-md font-semibold">{x.meaning}</span>
                  <span className="mt-2 text-body-sm text-on-surface-muted">{x.note}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </article>


      <ConfirmDeleteDialog
        open={!!delId}
        onOpenChange={(o) => !o && setDelId("")}
        onConfirm={() => removeNote(delId)}
      />
    </div>
  );
}
