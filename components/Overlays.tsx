"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { lib } from "@/lib/content";
import { useStore, type PromptReason } from "@/lib/store";
import { Button } from "@/components/ui/button";

const COPY: Record<PromptReason, { title: string; body: string }> = {
  manual: {
    title: "로그인하면 기록이\n내 아카이브에 남아요",
    body: "로그인 없이도 계속 쓸 수 있어요. 지금 기록은 이 기기에만 저장돼 있고, 구글 로그인으로 연결하면 백업되어 다른 기기에서도 이어 볼 수 있어요.",
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
  const hasTabBar = ["/", "/expressions", "/archive"].includes(pathname);

  const commentSid = sheet?.type === "comment" ? sheet.sid : "";
  const editId = sheet?.type === "comment" ? sheet.editId : "";
  // 새 코멘트는 빈 입력으로, 수정은 기존 내용으로 시작
  useEffect(() => {
    setDraft(editId ? (notes.find((n) => n.id === editId)?.text ?? "") : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentSid, editId]);

  const quote = commentSid ? lib.sent[commentSid]?.plain : "";
  const empty = !draft.trim();
  const commentTitle = !editId ? "이 문장에 코멘트 남기기" : commentSid ? "코멘트 수정" : "읽고 난 생각 수정";

  return (
    <>
      {sheet?.type === "login" && (
        <Sheet onClose={closeSheet} labelledBy="login-title">
          <h2 id="login-title" className="m-0 text-[21px] leading-[1.4] font-bold tracking-[-0.02em] whitespace-pre-line">
            {COPY[sheet.reason].title}
          </h2>
          <p className="m-0 text-[14.5px] leading-[1.7] text-sub">{COPY[sheet.reason].body}</p>
          <Button
            variant="accent"
            onClick={login}
            className="mt-3 h-[52px] rounded-[26px] text-[15.5px] font-semibold"
          >
            Google로 계속하기
          </Button>
          <button onClick={closeSheet} className="h-12 border-0 bg-transparent text-[14.5px] font-medium text-sub">
            나중에 할게요
          </button>
        </Sheet>
      )}

      {sheet?.type === "comment" && (
        <Sheet onClose={closeSheet} labelledBy="comment-title">
          <h2 id="comment-title" className="m-0 text-[19px] leading-[1.4] font-bold tracking-[-0.02em]">
            {commentTitle}
          </h2>
          {quote && (
            <p lang="en" className="m-0 font-serif text-[17px] leading-[1.6]">
              <span className="rounded-[3px] box-decoration-clone bg-lilac-strong px-[3px] py-px">{quote}</span>
            </p>
          )}
          <label htmlFor="comment-input" className="mt-1 text-[13.5px] font-semibold">
            내 생각
          </label>
          <textarea
            id="comment-input"
            rows={4}
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="이 문장을 읽고 든 생각을 적어 보세요"
            className="box-border w-full resize-none rounded-[16px] border-[1.5px] border-ink bg-white px-3.5 py-3 text-[15px] leading-[1.6] text-ink"
          />
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={closeSheet}
              className="h-[50px] rounded-[25px] border-[1.5px] border-ink bg-white text-[15px] font-semibold text-ink"
            >
              취소
            </button>
            <button
              onClick={() => (editId ? updateNote(editId, draft) : saveComment(commentSid, draft))}
              disabled={empty}
              className="h-[50px] rounded-[25px] border-0 bg-ink text-[15px] font-semibold text-white disabled:opacity-40"
            >
              {editId ? "수정 완료" : "코멘트 저장"}
            </button>
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
          <div className="rounded-[24px] bg-ink px-[18px] py-[13px] text-sm leading-normal font-medium text-white shadow-[0_12px_28px_rgba(17,17,17,0.28)]">
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
        className="pop absolute inset-0 h-full w-full cursor-default border-0 bg-ink/50 p-0"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="up relative flex flex-col gap-2.5 rounded-t-[26px] bg-white px-5 pt-7 pb-6"
      >
        {children}
      </div>
    </div>
  );
}
