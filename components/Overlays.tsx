"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { lib } from "@/lib/content";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { copyLink } from "@/lib/inapp";
import { GoogleLoginButton } from "./GoogleLoginButton";

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
    body: "앱 안에서는 구글 로그인이 불가해요. 외부 브라우저에서 로그인하면 내 기록을 계속 남길 수 있어요.",
  },
} as const;

/** 하단 시트(로그인·코멘트·앱 안 브라우저 안내)와 토스트. 앱 폭(430px)에 맞춰 고정 배치한다. */
export function Overlays() {
  const { sheet, closeSheet, login, saveComment, updateNote, notes, toast, showToast } = useStore();
  const pathname = usePathname();
  const [draft, setDraft] = useState("");
  const hasTabBar = ["/", "/archive"].includes(pathname);

  const commentSid = sheet?.type === "comment" ? sheet.sid : "";
  const editId = sheet?.type === "comment" ? sheet.editId : "";
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
      {sheet?.type === "login" && (
        <Sheet onClose={closeSheet} labelledBy="login-title">
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

      {sheet?.type === "inapp" && (
        <Sheet onClose={closeSheet} labelledBy="inapp-title">
          <h2 id="inapp-title" className="m-0 text-headline font-bold tracking-headline whitespace-pre-line">
            {INAPP_COPY[sheet.reason].title}
          </h2>
          <p className="m-0 text-body-md text-on-surface-muted">{INAPP_COPY[sheet.reason].body}</p>
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

      {sheet?.type === "comment" && (
        <Sheet onClose={closeSheet} labelledBy="comment-title">
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

      {toast && !sheet && (
        <div
          role="status"
          className={`pop fixed inset-x-0 z-[60] mx-auto w-full max-w-[430px] px-5 ${
            hasTabBar ? "bottom-24" : "bottom-6"
          }`}
        >
          <div className="rounded-pill bg-primary px-[18px] py-[13px] text-label-md font-medium text-on-primary shadow-[0_12px_28px_rgba(17,17,17,0.28)]">
            {toast}
          </div>
        </div>
      )}
    </>
  );
}

function Sheet({
  children,
  onClose,
  labelledBy,
}: {
  children: React.ReactNode;
  onClose: () => void;
  labelledBy: string;
}) {
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
        className="pop absolute inset-0 h-full w-full cursor-default border-0 bg-primary/50 p-0"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="up relative flex flex-col gap-2.5 rounded-t-[26px] bg-surface px-5 pt-7 pb-6"
      >
        {children}
      </div>
    </div>
  );
}
