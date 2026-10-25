"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MOCK_PROFILE } from "@/lib/profile";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RiCloseLine } from "@remixicon/react";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IconBack } from "@/components/icons";

const ROW =
  "flex min-h-16 w-full items-center justify-between gap-3 border-0 bg-transparent px-5 text-left text-body-md font-medium text-on-surface";
const FB_KEY = "articles:proto:feedback";
const FB_KINDS = ["만족한 점", "개선할 점", "기능 요청", "오류 제보", "기타"] as const;

export default function MyPage() {
  const router = useRouter();
  const { ready, loggedIn, showKo, toggleKo, logout, deleteAccount, showToast } = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [fbOpen, setFbOpen] = useState(false);
  const [fbKind, setFbKind] = useState<(typeof FB_KINDS)[number]>(FB_KINDS[0]);
  const [fbText, setFbText] = useState("");

  // 프로토타입: 실제 전송 대신 이 브라우저에 보관한다. (서비스에서는 Supabase feedback 테이블 → 어드민에서 확인)
  const sendFeedback = () => {
    const text = fbText.trim();
    if (!text) return;
    try {
      const list = JSON.parse(localStorage.getItem(FB_KEY) ?? "[]") as unknown[];
      list.push({ kind: fbKind, text, at: Date.now() });
      localStorage.setItem(FB_KEY, JSON.stringify(list));
    } catch {
      /* 저장소를 못 써도 흐름은 계속 */
    }
    setFbText("");
    setFbOpen(false);
    showToast("피드백을 보냈어요. 운영자가 확인할게요");
  };

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <div className="min-h-dvh pb-10">
      <div className="sticky top-0 z-30 flex h-14 items-center gap-1 bg-surface pr-5 pl-1">
        <button
          onClick={goBack}
          aria-label="뒤로 가기"
          className="flex size-11 items-center justify-center border-0 bg-transparent text-on-surface"
        >
          <IconBack />
        </button>
        <h1 className="m-0 text-headline font-bold tracking-headline">프로필</h1>
      </div>

      {ready && loggedIn && (
        <section className="flex flex-col items-center gap-3 px-5 py-4">
          <ProfileAvatar size={80} />
          <span className="max-w-full truncate text-body-md text-on-surface">{MOCK_PROFILE.email}</span>
        </section>
      )}

      <ul className="m-0 mt-4 flex list-none flex-col p-0">
        {ready && loggedIn && (
          <li>
            <button
              role="switch"
              aria-checked={showKo}
              onClick={() => toggleKo()}
              className={ROW}
            >
              <span>번역 항상 켜기</span>
              <ToggleSwitch on={showKo} />
            </button>
          </li>
        )}
        <li>
          <button onClick={() => setFbOpen(true)} className={ROW}>
            <span>피드백 보내기</span>
          </button>
        </li>
        {ready && loggedIn && (
          <>
            <li>
              <button
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className={ROW}
              >
                <span>로그아웃</span>
              </button>
            </li>
            <li>
              <button onClick={() => setConfirmDelete(true)} className={cn(ROW, "text-danger")}>
                <span>계정 삭제</span>
              </button>
            </li>
          </>
        )}
      </ul>

      <Dialog open={fbOpen} onOpenChange={setFbOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader className="gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <DialogTitle className="text-headline font-bold tracking-headline">
                피드백 보내기
              </DialogTitle>
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

      <ConfirmDeleteDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        onConfirm={() => {
          deleteAccount();
          router.push("/");
        }}
      />
    </div>
  );
}
