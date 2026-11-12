"use client";

import { useState } from "react";
import { RiCloseLine } from "@remixicon/react";
import { track } from "@/lib/analytics";
import { sendFeedbackRemote } from "@/lib/remote";
import { supabaseEnabled } from "@/lib/supabase";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const FB_KEY = "articles:proto:feedback";
const FB_KINDS = ["만족한 점", "개선할 점", "기능 요청", "오류 제보", "기타"] as const;
/** Feedback Sent 의 kind 값 (피드백 본문은 보내지 않는다) */
const FB_KIND_KEY: Record<(typeof FB_KINDS)[number], string> = {
  "만족한 점": "satisfied",
  "개선할 점": "improvement",
  "기능 요청": "feature_request",
  "오류 제보": "bug_report",
  "기타": "other",
};

/** 피드백 다이얼로그. 프로필과 아티클 상세 하단의 "피드백 보내기"가 같이 쓴다. */
export function FeedbackDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { showToast } = useStore();
  const [fbKind, setFbKind] = useState<(typeof FB_KINDS)[number]>(FB_KINDS[0]);
  const [fbText, setFbText] = useState("");

  // Supabase 연결 시 feedback 표에 저장한다. (운영자는 대시보드에서 확인) 키가 없으면 이 브라우저에만 보관한다.
  const sendFeedback = async () => {
    const text = fbText.trim();
    if (!text) return;
    if (supabaseEnabled) {
      try {
        await sendFeedbackRemote(fbKind, text);
      } catch {
        showToast("피드백을 보내지 못했어요. 잠시 후 다시 시도해주세요");
        return; // 입력한 내용은 그대로 둔다
      }
    } else {
      try {
        const list = JSON.parse(localStorage.getItem(FB_KEY) ?? "[]") as unknown[];
        list.push({ kind: fbKind, text, at: Date.now() });
        localStorage.setItem(FB_KEY, JSON.stringify(list));
      } catch {
        /* 저장소를 못 써도 흐름은 계속 */
      }
    }
    track("Feedback Sent", { kind: FB_KIND_KEY[fbKind] });
    setFbText("");
    onOpenChange(false);
    showToast("피드백을 보냈어요. 운영자가 확인할게요");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader className="gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="text-headline font-bold tracking-headline">피드백 보내기</DialogTitle>
            <DialogClose render={<Button variant="ghost" size="icon-sm" className="shrink-0 bg-secondary" />}>
              <RiCloseLine />
              <span className="sr-only">닫기</span>
            </DialogClose>
          </div>
          <DialogDescription className="text-body-md text-on-surface-muted">
            의견을 자유롭게 남겨주세요.
            <br />
            서비스 개선에 반영하겠습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-2">
          <span id="fb-kind-label" className="text-label-sm font-medium text-on-surface-muted">
            유형
          </span>
          <div className="flex flex-wrap gap-2" role="group" aria-labelledby="fb-kind-label">
            {FB_KINDS.map((k) => (
              <Button
                key={k}
                variant={fbKind === k ? "default" : "secondary"}
                aria-pressed={fbKind === k}
                onClick={() => setFbKind(k)}
                className="px-4"
              >
                {k}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="fb-input" className="text-label-sm font-medium text-on-surface-muted">
            내용
          </label>
          <Textarea
            id="fb-input"
            rows={4}
            value={fbText}
            onChange={(e) => setFbText(e.target.value)}
            placeholder="의견을 자유롭게 작성해주세요"
          />
        </div>
        <DialogFooter className="-mt-2">
          <Button size="lg" onClick={sendFeedback} disabled={!fbText.trim()} className="h-12">
            보내기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
