"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { formatTimestamp, lib } from "@/lib/content";
import type { Note } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { copyLink } from "@/lib/inapp";
import { cn } from "@/lib/utils";
import { useDragDismiss } from "@/lib/useDragDismiss";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { FeedbackDialog } from "./FeedbackDialog";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { IconPencilFill, IconTrashFill } from "./icons";
import "./snackbar.css";

// 기록이 남는 첫 행동(코멘트·하이라이트·글 저장·내 생각) 직후에 뜨는 로그인 시트
const LOGIN_COPY = {
  title: "기록을 잃지 않게 로그인 해주세요",
  body: "로그인하고 내 기록을 안전하게 쌓아가요. 비로그인 상태에서는 기록이 없어질 위험이 있어요.",
};

// 앱 안 브라우저 안내 시트. 글자·버튼 스타일은 같고 문구만 다르다.
// manual: 프로필에서 구글 로그인 버튼을 눌렀을 때 / record: 기록이 남는 첫 행동 직후
const INAPP_COPY = {
  manual: {
    title: "외부 브라우저에서 열어주세요",
    body: "앱 안에서는 구글 로그인이 불가해요. Safari나 Chrome 같은 외부 브라우저에서 열어주세요.",
  },
  record: {
    title: "기록을 잃지 않게\n외부 브라우저에서 로그인 해주세요",
    body: "앱 안에서는 구글 로그인이 불가해요. 외부 브라우저에서 로그인하면 내 기록을 안전하게 쌓아갈 수 있어요.",
  },
} as const;

/** 하단 시트(로그인·코멘트·앱 안 브라우저 안내)와 토스트. 앱 폭(430px)에 맞춰 고정 배치한다. */
export function Overlays() {
  const { sheet, closeSheet, login, saveComment, addThought, updateNote, removeNote, notes, toast, showToast, loginHelp, dismissLoginHelp } = useStore();
  const pathname = usePathname();
  const [draft, setDraft] = useState("");
  const [thoughtDraft, setThoughtDraft] = useState("");
  // 이미 적은 생각을 다시 열면 먼저 카드로 보여주고, 연필을 누르면 같은 시트에서 입력창으로 바뀐다
  const [thoughtMode, setThoughtMode] = useState<"view" | "edit">("view");
  const [delThought, setDelThought] = useState(false);
  const viewNoteCache = useRef<Note | undefined>(undefined);
  const hasTabBar = ["/", "/explore", "/archive"].includes(pathname);
  // 아티클 상세는 하단에 플로팅 바(52px, 아래 여백 16px)가 떠 있어서, 스낵바는 그 위(12px 간격)에 띄운다
  const hasFloatBar = /^\/contents\/[^/]+$/.test(pathname);

  // 시트가 닫히면 store 의 sheet 는 바로 null 이 된다. 나가는 모션이 끝날 때까지 마지막 시트를 그려 둔다.
  const [shown, setShown] = useState(sheet);
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    if (sheet) {
      setShown(sheet);
      setClosing(false);
      return;
    }
    if (!shown) return;
    setClosing(true);
    const t = setTimeout(() => {
      setShown(null);
      setClosing(false);
    }, SHEET_EXIT_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet]);
  const cur = sheet ?? shown;

  // 스낵바도 같다. store 의 toast 는 2.4초 뒤 바로 비워지니, 나가는 모션이 끝날 때까지 마지막 문구를 그려 둔다.
  const snackOpen = !!toast && !cur;
  const [snack, setSnack] = useState("");
  const [snackIn, setSnackIn] = useState(false);
  useEffect(() => {
    if (snackOpen) {
      setSnack(toast);
      // 닫힌 상태로 한 번 그린 뒤 다음 프레임에 열어야 올라오는 모션이 생긴다
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setSnackIn(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setSnackIn(false);
    const t = setTimeout(() => setSnack(""), SNACK_EXIT_MS);
    return () => clearTimeout(t);
  }, [snackOpen, toast]);

  // 구글 로그인 2번 연속 실패 시 뜨는 "로그인 문제가 있나요?" 스낵바. 스스로 사라지지 않고, 보이는 화면(경로)을 벗어나면 사라진다.
  const [fbOpen, setFbOpen] = useState(false);
  const failPill = useRef<HTMLDivElement>(null);
  const [failH, setFailH] = useState(0);
  useLayoutEffect(() => {
    if (snack && failPill.current) setFailH(failPill.current.offsetHeight);
  }, [snack]);
  const helpOpen = loginHelp && !cur;
  const [helpShown, setHelpShown] = useState(false);
  const [helpIn, setHelpIn] = useState(false);
  useEffect(() => {
    if (helpOpen) {
      setHelpShown(true);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => {
        r2 = requestAnimationFrame(() => setHelpIn(true));
      });
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setHelpIn(false);
    const t = setTimeout(() => setHelpShown(false), SNACK_EXIT_MS);
    return () => clearTimeout(t);
  }, [helpOpen]);
  const lastPath = useRef(pathname);
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      dismissLoginHelp();
    }
  }, [pathname, dismissLoginHelp]);

  // 내 생각 시트는 열 때마다 빈 입력으로 시작
  // 이미 적은 생각을 다시 열면(editId) 기존 내용으로 시작
  const thoughtAid = cur?.type === "thought" ? cur.aid : "";
  const thoughtEditId = cur?.type === "thought" ? (cur.editId ?? "") : "";
  useEffect(() => {
    setThoughtDraft(thoughtEditId ? (notes.find((n) => n.id === thoughtEditId)?.text ?? "") : "");
    setThoughtMode("view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thoughtAid, thoughtEditId]);

  const commentSid = cur?.type === "comment" ? cur.sid : "";
  const editId = cur?.type === "comment" ? cur.editId : "";
  // 새 코멘트는 빈 입력으로, 수정은 기존 내용으로 시작
  useEffect(() => {
    setDraft(editId ? (notes.find((n) => n.id === editId)?.text ?? "") : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentSid, editId]);

  const quote = commentSid ? lib.sent[commentSid]?.plain : "";
  const quoteKo = commentSid ? lib.sent[commentSid]?.ko : "";
  const empty = !draft.trim();
  const commentTitle = !editId ? "이 문장에 코멘트 남기기" : commentSid ? "코멘트 수정" : "내 생각 수정하기";

  return (
    <>
      {cur?.type === "login" && (
        <Sheet closing={closing} onClose={closeSheet} labelledBy="login-title">
          <h2 id="login-title" className="m-0 text-headline font-bold tracking-headline whitespace-pre-line">
            {LOGIN_COPY.title}
          </h2>
          <p className="m-0 text-body-md text-on-surface-muted">{LOGIN_COPY.body}</p>
          <GoogleLoginButton onClick={() => login()} className="mt-3" />
          <button onClick={closeSheet} className="h-12 border-0 bg-transparent text-label-md font-medium text-on-surface-muted">
            나중에 할게요
          </button>
        </Sheet>
      )}

      {cur?.type === "inapp" && (
        <Sheet closing={closing} onClose={closeSheet} labelledBy="inapp-title">
          <h2 id="inapp-title" className="m-0 text-headline font-bold tracking-headline whitespace-pre-line">
            {INAPP_COPY[cur.reason].title}
          </h2>
          <p className="m-0 text-body-md text-on-surface-muted">{INAPP_COPY[cur.reason].body}</p>
          <Button
            variant="accent"
            size="lg"
            onClick={async () => {
              if (!(await copyLink())) return;
              closeSheet(); // 토스트는 시트가 닫혀 있을 때만 보인다
              showToast("링크가 복사됐어요");
            }}
            className="mt-3 h-[52px] rounded-pill text-body-md font-semibold"
          >
            링크 복사하기
          </Button>
          <button onClick={closeSheet} className="h-12 border-0 bg-transparent text-label-md font-medium text-on-surface-muted">
            나중에 할게요
          </button>
        </Sheet>
      )}

      {cur?.type === "comment" && (
        <Sheet closing={closing} onClose={closeSheet} labelledBy="comment-title">
          <h2 id="comment-title" className="m-0 mb-2.5 text-headline font-bold tracking-headline">
            {commentTitle}
          </h2>
          {quote && (
            <div className="mb-2.5 flex flex-col gap-1.5">
              <p lang="en" className="m-0 text-body-md">
                {quote}
              </p>
              <p className="m-0 text-body-sm text-on-surface-muted">{quoteKo}</p>
            </div>
          )}
          <label htmlFor="comment-input" className="sr-only">
            {commentTitle}
          </label>
          <Textarea
            id="comment-input"
            rows={4}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="어떤 생각이 들었나요? 저장한 코멘트는 나만 볼 수 있어요."
          />
          <div className="mt-1.5 grid grid-cols-2 gap-2">
            <Button variant="outline" size="lg" onClick={closeSheet} className="h-12">
              취소
            </Button>
            <Button
              size="lg"
              onClick={() => (editId ? updateNote(editId, draft) : saveComment(commentSid, draft))}
              disabled={empty}
              className="h-12"
            >
              {editId ? "수정 완료" : "코멘트 저장"}
            </Button>
          </div>
        </Sheet>
      )}

      {cur?.type === "thought" && (
        <Sheet closing={closing} onClose={closeSheet} labelledBy="thought-title">
          {cur.editId && thoughtMode === "view" ? (
            (() => {
              // 삭제 직후 시트가 내려가는 동안에도 카드가 비지 않게 마지막으로 본 노트를 기억해 둔다
              const found = notes.find((n) => n.id === cur.editId);
              if (found) viewNoteCache.current = found;
              const note = found ?? viewNoteCache.current;
              return (
                <>
                  <h2 id="thought-title" className="m-0 mb-4 text-headline font-bold tracking-headline">
                    내 생각 기록
                  </h2>
                  {note && (
                    <div className="flex flex-col gap-4 rounded-card border border-pd-line bg-pd-tint px-5 pt-5 pb-6">
                      <div className="flex h-6 items-center justify-between">
                        <span className="text-caption text-pd-ink-muted">{formatTimestamp(note.at)}</span>
                        {/* 보이는 아이콘은 20px, 누르는 영역은 44px. 아이콘 사이 16px */}
                        <div className="-mr-3 flex items-center -space-x-2">
                          <button
                            onClick={() => {
                              setThoughtDraft(note.text);
                              setThoughtMode("edit");
                            }}
                            aria-label="수정"
                            className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-pd-ink-muted"
                          >
                            <IconPencilFill />
                          </button>
                          <button
                            onClick={() => setDelThought(true)}
                            aria-label="삭제"
                            className="flex size-11 shrink-0 items-center justify-center border-0 bg-transparent text-pd-ink-muted"
                          >
                            <IconTrashFill />
                          </button>
                        </div>
                      </div>
                      <p className="m-0 text-body-md leading-6 whitespace-pre-wrap text-pd-ink">{note.text}</p>
                    </div>
                  )}
                </>
              );
            })()
          ) : (
            <>
              <div className="mb-4 flex flex-col gap-1">
                <h2 id="thought-title" className="m-0 text-headline font-bold tracking-headline">
                  내 생각 기록
                </h2>
                <p className="m-0 text-body-md leading-6 text-on-surface-muted">입력한 내용은 나만 볼 수 있게 저장돼요.</p>
              </div>
              <label htmlFor="thought-sheet-input" className="sr-only">
                내 생각
              </label>
              <Textarea
                id="thought-sheet-input"
                rows={4}
                autoFocus
                value={thoughtDraft}
                onChange={(e) => setThoughtDraft(e.target.value)}
                placeholder="느낀 점, 내 일에 적용해볼 점은?"
              />
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => (cur.editId ? setThoughtMode("view") : closeSheet())}
                  className="h-12"
                >
                  취소
                </Button>
                <Button
                  size="lg"
                  disabled={!thoughtDraft.trim()}
                  onClick={() => {
                    if (cur.editId) {
                      updateNote(cur.editId, thoughtDraft, true); // 시트는 닫지 않고 수정된 생각 보기로 돌아간다
                      setThoughtMode("view");
                      return;
                    }
                    closeSheet(); // 백업 제안 시트가 이어서 뜰 수 있어서 먼저 닫는다
                    addThought(cur.aid, thoughtDraft);
                  }}
                  className="h-12"
                >
                  {cur.editId ? "수정 완료" : "기록 저장하기"}
                </Button>
              </div>
            </>
          )}
        </Sheet>
      )}

      <ConfirmDeleteDialog
        open={delThought}
        onOpenChange={setDelThought}
        onConfirm={() => {
          const id = cur?.type === "thought" ? cur.editId : undefined;
          if (!id) return;
          closeSheet(); // 시트를 먼저 닫아야 삭제 스낵바가 바로 뜬다
          removeNote(id);
        }}
      />

      {snack && (
        <div
          role="status"
          data-open={snackIn}
          className={`snack pointer-events-none fixed inset-x-0 z-[60] mx-auto flex w-full max-w-[430px] justify-center px-6 md:max-w-none ${
            hasTabBar ? "bottom-24 md:bottom-6 md:pl-54" : hasFloatBar ? "bottom-[calc(max(16px,env(safe-area-inset-bottom))+64px)]" : "bottom-6"
          }`}
        >
          <div ref={failPill} className="snack-pill w-fit rounded-panel bg-pd-snack/80 px-4 py-3 text-center text-label-md font-normal whitespace-pre-line text-on-primary backdrop-blur-md backdrop-saturate-120 shadow-[0_2px_8px_rgba(17,17,17,0.2),0_8px_16px_-6px_rgba(17,17,17,0.18)]">
            {snack}
          </div>
        </div>
      )}

      {helpShown && (
        <div
          data-open={helpIn}
          className={`snack pointer-events-none fixed inset-x-0 z-[61] mx-auto flex w-full max-w-[430px] justify-center px-6 md:max-w-none ${
            hasTabBar ? "bottom-24 md:bottom-6 md:pl-54" : hasFloatBar ? "bottom-[calc(max(16px,env(safe-area-inset-bottom))+64px)]" : "bottom-6"
          }`}
        >
          {/* 실패 스낵바가 떠 있는 동안은 그 위(8px 간격)로, 사라지면 자기 자리로 내려온다 */}
          <div
            className="max-w-full"
            style={{
              transform: snack ? `translateY(-${failH + 8}px)` : "none",
              transition: "transform 360ms cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <div
              role="status"
              className="snack-pill flex w-fit max-w-full items-center gap-4 rounded-panel bg-pd-snack/80 px-4 py-3 text-label-md font-normal text-on-primary backdrop-blur-md backdrop-saturate-120 shadow-[0_2px_8px_rgba(17,17,17,0.2),0_8px_16px_-6px_rgba(17,17,17,0.18)]"
              style={{ pointerEvents: helpIn ? "auto" : "none" }}
            >
              <span className="min-w-0">로그인 문제가 있나요?</span>
              <button
                type="button"
                tabIndex={helpIn ? 0 : -1}
                className="shrink-0 font-semibold underline underline-offset-[3px]"
                onClick={() => {
                  dismissLoginHelp();
                  setFbOpen(true);
                }}
              >
                피드백 보내기
              </button>
            </div>
          </div>
        </div>
      )}
      <FeedbackDialog open={fbOpen} onOpenChange={setFbOpen} />
    </>
  );
}

/** 시트가 나가는 시간(ms). Sheet 의 닫힘 transition 과 같아야 한다. */
const SHEET_EXIT_MS = 300;
/** 스낵바가 나가는 시간(ms). snackbar.css 의 닫힘 transition(180ms)보다 조금 길게. */
const SNACK_EXIT_MS = 220;

/**
 * 하단 시트. 아래에서 올라오고, 닫을 때(바깥·닫기 버튼·Esc)는 같은 길로 아래로 내려간다. 아래로 끌어서도 닫는다(useDragDismiss).
 * 키프레임이 아니라 transition 이라 여는 도중에 잡아도 그 자리에서 이어진다.
 * 들어올 때는 iOS 시트 곡선(0.32, 0.72, 0, 1) 500ms, 버튼으로 나갈 땐 300ms. 투명해지지 않고 화면 아래로 그대로 내려간다(들어온 방향 = 나가는 방향).
 * 어두운 배경은 끌린 만큼 같이 옅어진다.
 */
function Sheet({
  children,
  onClose,
  labelledBy,
  closing,
}: {
  children: React.ReactNode;
  onClose: () => void;
  labelledBy: string;
  closing: boolean;
}) {
  const [entered, setEntered] = useState(false);
  const drag = useDragDismiss(onClose);
  useEffect(() => {
    // 처음 그린 프레임을 "닫힘" 상태로 두고 다음 프레임에 열어야 올라오는 모션이 생긴다
    let r2 = 0;
    const r1 = requestAnimationFrame(() => {
      r2 = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(r1);
      cancelAnimationFrame(r2);
    };
  }, []);
  const open = entered && !closing;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    // 모바일은 하단 시트, md(768px) 이상은 가운데 모달
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[430px] flex-col justify-end md:max-w-none md:items-center md:justify-center md:px-6">
      <button
        ref={drag.backdrop}
        aria-label="닫기"
        onClick={onClose}
        tabIndex={closing ? -1 : 0}
        className={cn(
          "absolute inset-0 h-full w-full cursor-default border-0 bg-primary/50 p-0 transition-opacity ease-out",
          open ? "opacity-100 duration-[400ms]" : "opacity-0 duration-[300ms]",
        )}
      />
      <div
        ref={drag.surface}
        {...drag.bind}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        inert={closing}
        className={cn(
          "relative flex touch-none flex-col gap-2.5 rounded-t-sheet bg-surface px-6 pt-7 pb-6 transition-transform ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          // md 이상: 가운데 모달. 화면 아래로 빠지는 대신 8px 떠오르며 나타나고 같은 길로 사라진다(끌어 닫기 없음).
          "md:w-full md:max-w-md md:touch-auto md:rounded-sheet md:transition-[transform,opacity]",
          open
            ? "translate-y-0 duration-500 md:opacity-100 md:duration-200"
            : "translate-y-full duration-300 md:translate-y-2 md:opacity-0 md:duration-150",
        )}
      >
        {/* 끌어서 닫을 수 있다는 단서(모바일 시트에서만) */}
        <span aria-hidden="true" className="absolute top-2.5 left-1/2 h-1 w-9 -translate-x-1/2 rounded-full bg-pd-line md:hidden" />
        {children}
      </div>
    </div>
  );
}
