"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { lib } from "@/lib/content";
import { useStore } from "@/lib/store";
import {
  IconBack,
  IconBookmark,
  IconClose,
  IconComment,
  IconHighlighter,
  IconPen,
  IconTrash,
} from "./icons";

const TIP_W = 268;
const COMPLETE_AT = 95; // PRD F-41: 본문 영역 스크롤 95%

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
    loggedIn,
    toggleKo,
    toggleHl,
    openComment,
    editNote,
    toggleX,
    toggleA,
    addThought,
    removeNote,
    openLogin,
  } = useStore();

  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [tip, setTip] = useState<Tip | null>(null);
  const [menu, setMenu] = useState("");
  const [thought, setThought] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // 상단 프로그레스: 본문 끝 표식까지의 스크롤 진행률
  useEffect(() => {
    const update = () => {
      const end = endRef.current;
      if (!end) return;
      const endTop = end.getBoundingClientRect().top + window.scrollY;
      const span = Math.max(1, endTop - window.innerHeight + 40);
      const pct = Math.round(clamp(window.scrollY / span, 0, 1) * 100);
      setProgress(pct);
      if (pct >= COMPLETE_AT) setDone(true);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

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

  const tapSentence = (sid: string) => {
    setTip(null);
    setMenu((m) => (m === sid ? "" : sid));
  };

  // 글을 읽고 든 생각 = 유저가 직접 입력한 글 전체 단위 텍스트만 (문장 코멘트·하이라이트 제외)
  const artNotes = notes.filter((n) => n.aid === aid && !n.sid);
  const isVideo = art.kind === "video";

  const [y, m, d] = art.date.split(".").map(Number);
  const dateLabel = `${y}년 ${m}월 ${d}일`;

  return (
    <div className="min-h-dvh bg-white">
      {/* 상단 고정: 뒤로가기 / 읽기 진행 / 번역 토글 / 글 저장 */}
      <div className="sticky top-0 z-30 bg-white">
        <div className="flex h-14 items-center gap-1 pr-2 pl-1.5">
          <button
            onClick={goBack}
            aria-label="목록으로 돌아가기"
            className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-ink"
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
              toggleKo();
            }}
            className="flex h-11 shrink-0 items-center gap-2 border-0 bg-transparent px-2 text-[13.5px] font-medium text-ink"
          >
            <span>한글 번역</span>
            <span
              aria-hidden="true"
              className={`relative block h-[22px] w-[38px] rounded-[11px] transition-colors ${
                showKo ? "bg-ink" : "bg-off"
              }`}
            >
              <span
                className={`absolute top-0.5 block size-[18px] rounded-full bg-white transition-[left] ${
                  showKo ? "left-[18px]" : "left-0.5"
                }`}
              />
            </span>
          </button>
          <button
            onClick={() => toggleA(aid)}
            aria-label="이 글 저장"
            aria-pressed={!!savedA[aid]}
            className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-ink"
          >
            <IconBookmark filled={!!savedA[aid]} />
          </button>
        </div>
        <div
          role="progressbar"
          aria-label="읽은 정도"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          className="h-[3px] bg-line"
        >
          <div className="h-[3px] bg-ink transition-[width] duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <article className="px-5 pt-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[12.5px] text-sub">{art.sourceLine}</span>
          <span className="text-[12.5px] text-sub">{dateLabel}</span>
        </div>
        <h1
          lang="en"
          className="mt-1 mb-0 text-[29px] leading-[1.14] font-bold tracking-[-0.03em] [text-wrap:pretty]"
        >
          {art.titleEn}
        </h1>
        <p className="mt-2.5 mb-0 text-[15px] leading-normal text-sub">{art.titleKo}</p>

        {isVideo && (
          <div className="mt-[22px] flex aspect-video flex-col items-center justify-center gap-1 rounded-[18px] bg-ink px-4 text-center text-white">
            <span className="text-sm font-semibold">영상 임베드 영역</span>
            <span className="text-xs leading-normal text-tip">
              실제 서비스에서는 YouTube 영상이 여기에 임베드됩니다. (타임스탬프 링크 없음)
            </span>
          </div>
        )}

        <section className="mt-[22px] flex flex-col gap-2 rounded-[18px] bg-panel px-[18px] pt-4 pb-[18px]">
          <h2 className="m-0 text-[12.5px] font-bold">원문 내용 요약</h2>
          <p className="m-0 text-[15px] leading-[1.75]">{art.summary}</p>
          <p className="m-0 mt-1 text-xs leading-normal text-sub">AI로 요약한 내용입니다.</p>
        </section>
        <p className="mt-2 mb-0 text-xs leading-normal text-sub">
          한국어 번역은 AI 초안을 운영자가 검수한 것입니다.
        </p>

        <div className="mt-[22px] flex flex-col gap-[18px]">
          {art.paras.map((p, pi) => (
            <div key={pi} className="flex flex-col gap-1">
              {p.map((st) => {
                const tipOpen = tip?.sid === st.id;
                const menuOpen = menu === st.id;
                const isHl = !!hl[st.id];
                const x = tipOpen && tip ? lib.expr[tip.xid] : null;
                const comments = notes.filter((n) => n.sid === st.id);

                return (
                  <div
                    key={st.id}
                    data-sent={st.id}
                    className={`relative -mx-2.5 rounded-[10px] px-2.5 py-[9px] ${
                      tipOpen || menuOpen ? "z-[5]" : "z-[1]"
                    } ${isHl ? "bg-lilac" : menuOpen ? "bg-panel" : "bg-transparent"} ${
                      menuOpen ? "shadow-[inset_0_0_0_1.5px_var(--color-ink)]" : ""
                    }`}
                  >
                    <button
                      onClick={() => tapSentence(st.id)}
                      aria-label="이 문장에 하이라이트 또는 코멘트"
                      aria-expanded={menuOpen}
                      className="absolute inset-0 h-full w-full rounded-[10px] border-0 bg-transparent p-0"
                    />
                    <p
                      lang="en"
                      className="pointer-events-none relative m-0 font-serif text-xl leading-[1.6] text-ink"
                    >
                      {st.segs.map((g, gi) =>
                        g.xid ? (
                          <button
                            key={gi}
                            onClick={(e) => openTip(st.id, g.xid, e)}
                            aria-expanded={tipOpen && tip?.xid === g.xid}
                            className={`pointer-events-auto relative m-0 inline rounded border-0 px-[3px] leading-[1.3] ${
                              tipOpen && tip?.xid === g.xid ? "bg-ink text-lime" : "bg-lime text-ink"
                            }`}
                            style={{ font: "inherit" }}
                          >
                            {g.t}
                          </button>
                        ) : (
                          <span key={gi}>{g.t}</span>
                        ),
                      )}
                    </p>

                    {showKo && (
                      <p
                        className={`pointer-events-none relative mt-1.5 mb-0 text-sm leading-[1.7] ${
                          isHl ? "text-[#2e2e36]" : "text-sub"
                        }`}
                      >
                        {st.ko}
                      </p>
                    )}

                    {comments.map((n) => (
                      <div key={n.id} className="pointer-events-none relative mt-2 flex">
                        <span className="rounded-[4px_14px_14px_14px] bg-lilac-strong px-3 py-2 text-[13.5px] leading-[1.55] font-medium">
                          {n.text}
                        </span>
                      </div>
                    ))}

                    {tipOpen && tip && x && (
                      <div
                        role="status"
                        className="pop absolute z-[3] box-border rounded-[14px] bg-ink pt-1.5 pr-1 pb-3.5 pl-4 text-white shadow-[0_12px_28px_rgba(17,17,17,0.28)]"
                        style={{ top: tip.top, left: tip.left, width: TIP_W }}
                      >
                        <span
                          aria-hidden="true"
                          className="absolute -top-[5px] block size-[11px] rotate-45 bg-ink"
                          style={{ left: tip.arrow }}
                        />
                        <div className="flex items-center justify-between gap-2">
                          <div lang="en" className="font-serif text-xl leading-[1.3] font-semibold text-lime">
                            {x.term}
                          </div>
                          <button
                            onClick={() => setTip(null)}
                            aria-label="뜻 닫기"
                            className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-white"
                          >
                            <IconClose size={17} />
                          </button>
                        </div>
                        <div className="mr-3 text-[15px] leading-normal font-bold">{x.meaning}</div>
                        <div className="mt-1.5 mr-3 text-[13px] leading-[1.65] text-tip">{x.note}</div>
                      </div>
                    )}

                    {menuOpen && (
                      <div className="pop pointer-events-none absolute inset-x-0 bottom-full z-[3] -mb-1 flex justify-center">
                        <div className="pointer-events-auto flex items-center rounded-3xl bg-ink px-1.5 whitespace-nowrap shadow-[0_12px_28px_rgba(17,17,17,0.28)]">
                          <MenuBtn
                            icon={<IconHighlighter size={18} />}
                            label={isHl ? "하이라이트 해제" : "하이라이트"}
                            onClick={() => {
                              setMenu("");
                              toggleHl(st.id);
                            }}
                          />
                          <span aria-hidden="true" className="block h-5 w-px bg-white/30" />
                          {comments.length === 0 ? (
                            <MenuBtn
                              icon={<IconComment size={18} />}
                              label="코멘트"
                              onClick={() => {
                                setMenu("");
                                openComment(st.id);
                              }}
                            />
                          ) : (
                            <>
                              <MenuBtn
                                icon={<IconPen size={18} />}
                                label="코멘트 수정"
                                onClick={() => {
                                  setMenu("");
                                  editNote(comments[comments.length - 1].id);
                                }}
                              />
                              <span aria-hidden="true" className="block h-5 w-px bg-white/30" />
                              <MenuBtn
                                icon={<IconTrash size={18} />}
                                label="삭제"
                                onClick={() => {
                                  setMenu("");
                                  removeNote(comments[comments.length - 1].id);
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
        {/* 본문 끝 표식 — 프로그레스 100%의 기준 */}
        <div ref={endRef} />
        <div className="mt-8 flex justify-center">
          <a
            href={art.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-[50px] items-center rounded-[25px] border-[1.5px] border-ink px-6 text-[15px] font-semibold text-ink no-underline"
          >
            원문 읽기
          </a>
        </div>

        <section className="mt-10 flex flex-col">
          {done && !loggedIn && (
            <div className="pop mb-5 flex flex-col items-start gap-2 rounded-[18px] bg-panel p-4">
              <div className="text-[15px] font-semibold">끝까지 읽었어요</div>
              <p className="m-0 text-[13.5px] leading-[1.6] text-sub">
                지금까지의 기록은 이 기기에만 저장돼 있어요. 구글 로그인으로 백업해 둘까요?
              </p>
              <button
                onClick={openLogin}
                className="mt-1 h-11 rounded-[22px] border-0 bg-lime px-[18px] text-sm font-semibold text-ink"
              >
                기록 백업하기
              </button>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <h2 className="m-0 text-xl leading-[1.35] font-bold tracking-[-0.02em]">이 글의 주요 표현</h2>
          </div>
          <ul className="mx-0 mt-1 mb-0 flex list-none flex-col p-0">
            {art.xs.map((x) => {
              const on = !!savedX[x.id];
              return (
                <li key={x.id} className="flex flex-col gap-1.5 border-b border-line py-3.5 last:border-b-0">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      lang="en"
                      className="rounded bg-lime px-1 font-serif text-[19px] leading-[1.3] font-semibold"
                    >
                      {x.term}
                    </span>
                    <button
                      onClick={() => toggleX(x.id)}
                      aria-label={on ? "표현 저장 해제" : "표현 저장"}
                      aria-pressed={on}
                      className="-mt-2.5 -mr-2.5 flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-ink"
                    >
                      <IconBookmark filled={on} />
                    </button>
                  </div>
                  <span className="text-[15px] leading-normal font-semibold">{x.meaning}</span>
                  <span className="text-[13.5px] leading-[1.6] text-sub">{x.note}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </article>

      <section className="mt-10 flex flex-col gap-3.5 bg-panel px-5 pt-[26px] pb-9">
        <h2 className="m-0 text-xl leading-[1.35] font-bold tracking-[-0.02em]">글을 읽고 든 생각</h2>
        {artNotes.length === 0 && (
          <p className="-mt-1.5 mb-0 text-[14.5px] leading-[1.65] text-sub">
            직접 적은 생각이 여기에 모여요. 문장 코멘트는 아카이브에서 볼 수 있어요.
          </p>
        )}
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {artNotes.map((n) => {
            return (
              <li key={n.id} className="flex flex-col gap-2 rounded-2xl bg-white pt-3.5 pr-1 pb-0.5 pl-3.5">
                <p className="m-0 mr-2.5 text-[15px] leading-[1.65] whitespace-pre-wrap">{n.text}</p>
                <div className="flex items-center justify-end">
                  <button
                    onClick={() => editNote(n.id)}
                    aria-label="수정"
                    className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-sub"
                  >
                    <IconPen size={18} />
                  </button>
                  <button
                    onClick={() => removeNote(n.id)}
                    aria-label="삭제"
                    className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-sub"
                  >
                    <IconTrash size={18} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-2">
          <label htmlFor="thought-input" className="sr-only">
            글을 읽고 든 생각
          </label>
          <textarea
            id="thought-input"
            rows={4}
            value={thought}
            onChange={(e) => setThought(e.target.value)}
            placeholder="떠오른 생각, 우리 제품에 적용해 볼 점을 적어 보세요"
            className="box-border w-full resize-none rounded-2xl border-[1.5px] border-ink bg-white px-3.5 py-3 text-[15px] leading-[1.6] text-ink"
          />
          <button
            disabled={!thought.trim()}
            onClick={() => {
              addThought(aid, thought);
              setThought("");
            }}
            className="h-[50px] rounded-[25px] border-0 bg-ink text-[15px] font-semibold text-white disabled:opacity-40"
          >
            생각 남기기
          </button>
        </div>
      </section>
    </div>
  );
}

function MenuBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 items-center gap-2 border-0 bg-transparent px-3 text-sm font-medium text-white"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
