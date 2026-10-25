"use client";

import { cn } from "@/lib/utils";
import { IconPenLine, IconTrashLine } from "./icons";
import { MenuBtn } from "./MenuBtn";

/** 코멘트 말풍선 모양. 팝오버가 없는 곳(아카이브 카드)에서는 이 클래스만 가져다 쓴다. */
export const BUBBLE_CLASS =
  "rounded-[4px_14px_14px_14px] bg-accent-sub-strong px-3 py-2 text-label-md font-medium text-on-surface";

/** 문장에 남긴 코멘트 말풍선. 누르면 위에 "수정 · 삭제" 팝오버가 뜬다. 본문과 아카이브가 같이 쓴다. */
export function CommentBubble({
  text,
  open,
  onToggle,
  onEdit,
  onDelete,
  className,
}: {
  text: string;
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}) {
  return (
    <div data-bubble="" className={cn("relative flex", className)}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-label="코멘트 수정 또는 삭제"
        className={cn(BUBBLE_CLASS, "pointer-events-auto border-0 text-left")}
      >
        {text}
      </button>
      {open && (
        <div className="pop pointer-events-auto absolute bottom-full left-0 z-[3] mb-1 flex items-center rounded-pill bg-primary px-1.5 whitespace-nowrap shadow-[0_12px_28px_rgba(17,17,17,0.28)]">
          <MenuBtn icon={<IconPenLine size={18} />} label="수정" onClick={onEdit} />
          <span aria-hidden="true" className="block h-5 w-px bg-surface/30" />
          <MenuBtn icon={<IconTrashLine size={18} />} label="삭제" onClick={onDelete} />
        </div>
      )}
    </div>
  );
}
