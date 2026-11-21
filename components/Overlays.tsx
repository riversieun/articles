"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { lib } from "@/lib/content";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { copyLink } from "@/lib/inapp";
import { cn } from "@/lib/utils";
import { GoogleLoginButton } from "./GoogleLoginButton";
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
  const { sheet, closeSheet, login, saveComment, addThought, updateNote, notes, toast, showToast } = useStore();
  const pathname = usePathname();
  const [draft, setDraft] = useState("");
  const [thoughtDraft, setThoughtDraft] = useState("");
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

  // 내 생각 시트는 열 때마다 빈 입력으로 시작
  // 이미 적은 생각을 다시 열면(editId) 기존 내용으로 시작
  const thoughtAid = cur?.type === "thought" ? cur.aid : "";
  const thoughtEditId = cur?.type === "thought" ? (cur.editId ?? "") : "";
  useEffect(() => {
    setThoughtDraft(thoughtEditId ? (notes.find((n) => n.id === thoughtEditId)?.text ?? "") : "");
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
            <Button variant="outline" size="lg" onClick={closeSheet} className="h-12">
              취소
            </Button>
            <Button
              size="lg"
              disabled={!thoughtDraft.trim()}
              onClick={() => {
                if (cur.editId) {
                  updateNote(cur.editId, thoughtDraft);
                  return;
                }
                closeSheet(); // 백업 제안 시트가 이어서 뜰 수 있어서 먼저 닫는다
                addThought(cur.aid, thoughtDraft);
              }}
              className="h-12"
            >
              {cur.editId ? "수정하기" : "생각 남기기"}
            </Button>
          </div>
        </Sheet>
      )}

      {snack && (
        <div
          role="status"
          data-open={snackIn}
          className={`snack pointer-events-none fixed inset-x-0 z-[60] mx-auto w-full max-w-[430px] px-5 ${
            hasTabBar ? "bottom-24" : hasFloatBar ? "bottom-[calc(max(16px,env(safe-area-inset-bottom))+64px)]" : "bottom-6"
          }`}
        >
          <div className="snack-pill rounded-pill bg-pd-snack px-[18px] py-[13px] text-label-md font-medium text-on-primary shadow-[0_2px_8px_rgba(17,17,17,0.2),0_8px_16px_-6px_rgba(17,17,17,0.18)]">
            {snack}
          </div>
        </div>
      )}
    </>
  );
}

/** 시트가 나가는 시간(ms). Sheet 의 닫힘 transition 과 같아야 한다. */
const SHEET_EXIT_MS = 300;
/** 스낵바가 나가는 시간(ms). snackbar.css 의 닫힘 transition(180ms)보다 조금 길게. */
const SNACK_EXIT_MS = 220;

/**
 * 하단 시트. 아래에서 올라오고, 닫을 때(바깥·닫기 버튼·Esc)는 같은 길로 아래로 내려간다.
 * 키프레임이 아니라 transition 이라 여는 도중에 닫아도 그 자리에서 되돌아간다.
 * 들어올 때는 iOS 시트 곡선(0.32, 0.72, 0, 1) 480ms, 나갈 때는 더 빠르게 300ms. 어두운 배경은 같이 사라진다.
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
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[430px] flex-col justify-end">
      <button
        aria-label="닫기"
        onClick={onClose}
        tabIndex={closing ? -1 : 0}
        className={cn(
          "absolute inset-0 h-full w-full cursor-default border-0 bg-primary/50 p-0 transition-opacity ease-out",
          open ? "opacity-100 duration-[320ms]" : "opacity-0 duration-[240ms]",
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        inert={closing}
        className={cn(
          "relative flex flex-col gap-2.5 rounded-t-[26px] bg-surface px-5 pt-7 pb-6 transition-[transform,opacity] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-opacity",
          open ? "translate-y-0 opacity-100 duration-[480ms]" : "translate-y-full opacity-0 duration-[300ms] motion-reduce:translate-y-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}
