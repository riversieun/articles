"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { lib } from "@/lib/content";
import { useStore, type PromptReason } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconGoogle } from "./icons";

const COPY: Record<PromptReason, { title: string; body: string }> = {
  manual: {
    title: "로그인하기",
    body: "로그인하면 다른 기기에서도 내 저장된 기록을 볼 수 있어요.",
  },
  expr3: {
    title: "표현을 3개 모았어요.\n기록을 백업해 둘까요?",
    body: "저장한 표현은 이 기기에만 있어요. 구글 로그인으로 연결하면 브라우저 데이터를 지워도 복구할 수 있어요.",
  },
  comment: {
    title: "첫 생각을 남겼어요.\n잃어버리지 않게 백업할까요?",
    body: "코멘트와 하이라이트는 이 기기에만 저장돼 있어요. 구글 로그인으로 연결하면 계속 보관돼요.",
  },
};

/** 하단 시트(로그인·코멘트)와 토스트. 앱 폭(430px)에 맞춰 고정 배치한다. */
export function Overlays() {
  const { sheet, closeSheet, login, saveComment, updateNote, notes, toast } = useStore();
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
            {COPY[sheet.reason].title}
          </h2>
          <p className="m-0 text-body-md text-on-surface-muted">{COPY[sheet.reason].body}</p>
          <Button
            variant="accent"
            onClick={login}
            className="mt-3 h-[52px] gap-3 rounded-pill text-body-md font-semibold"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface">
              <IconGoogle size={16} />
            </span>
            Google로 계속하기
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
