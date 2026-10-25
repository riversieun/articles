"use client";

import { useState } from "react";
import { CommentBubble } from "@/components/CommentBubble";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { IconAvatar, IconBookmark } from "@/components/icons";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProfileAvatar } from "@/components/ProfileAvatar";

/** 서비스 전용 컴포넌트 데모. 누르는 동작이 필요해서 클라이언트 컴포넌트로 둔다. */
export function ServiceDemos() {
  const [on, setOn] = useState(true);
  const [bubble, setBubble] = useState(false);
  const [confirm, setConfirm] = useState(false);
  return (
    <div className="flex flex-col gap-6">
      <Demo label="Toggle — 눌러서 켜고 끄기">
        <button
          role="switch"
          aria-checked={on}
          onClick={() => setOn((v) => !v)}
          className="flex h-11 items-center gap-2 border-0 bg-transparent px-2 text-label-md font-medium text-on-surface"
        >
          <span>번역 켜기</span>
          <ToggleSwitch on={on} />
        </button>
      </Demo>

      <Demo label="Textarea — 기본 / 포커스(테두리만 진해짐)">
        <Textarea rows={3} placeholder="느낀 점, 내 일에 적용해볼 점은?" aria-label="기본" />
      </Demo>

      <Demo label="Comment bubble — 누르면 수정·삭제 팝오버">
        <div className="pt-14">
          <CommentBubble
            text="좋은 지적"
            open={bubble}
            onToggle={() => setBubble((v) => !v)}
            onEdit={() => setBubble(false)}
            onDelete={() => setBubble(false)}
          />
        </div>
      </Demo>

      <Demo label="Confirm delete dialog — 모든 삭제 확인에 같은 문구">
        <Button variant="destructive" onClick={() => setConfirm(true)}>
          삭제 확인 열기
        </Button>
        <ConfirmDeleteDialog open={confirm} onOpenChange={setConfirm} onConfirm={() => {}} />
      </Demo>

      <Demo label="Save icon — 저장 전(회색 선) / 저장 후(검정 채움)">
        <div className="flex items-center gap-4">
          <span className="text-on-surface-muted">
            <IconBookmark size={22} />
          </span>
          <span className="text-on-surface">
            <IconBookmark size={22} filled />
          </span>
        </div>
      </Demo>

      <Demo label="Profile avatar — 로그인 전 32 / 로그인 후 32 · 80">
        <div className="flex items-center gap-4">
          <IconAvatar size={32} />
          <ProfileAvatar size={32} />
          <ProfileAvatar size={80} />
        </div>
      </Demo>
    </div>
  );
}

function Demo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="m-0 text-label-md font-semibold text-on-surface-muted">{label}</h3>
      {children}
    </div>
  );
}
