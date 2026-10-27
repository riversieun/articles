"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { sendFeedbackRemote } from "@/lib/remote";
import { loginEnabled } from "@/lib/flags";
import { supabaseEnabled } from "@/lib/supabase";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { IconAvatar, IconBack } from "@/components/icons";
import { goBackInApp } from "@/lib/nav";
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

const ROW =
  "flex min-h-16 w-full items-center justify-between gap-3 border-0 bg-transparent px-5 text-left text-body-md font-medium text-on-surface";
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

export default function MyPage() {
  const router = useRouter();
  const { ready, loggedIn, profile, showKo, toggleKo, login, logout, deleteAccount, showToast } = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [fbOpen, setFbOpen] = useState(false);
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
    setFbOpen(false);
    showToast("피드백을 보냈어요. 운영자가 확인할게요");
  };

  const goBack = () => goBackInApp(router);

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

      {ready && (loggedIn || loginEnabled) && (
        <section className="flex flex-col items-center gap-3 px-5 py-4">
          {loggedIn ? (
            <>
              <ProfileAvatar size={80} />
              <span className="max-w-full truncate text-body-md text-on-surface">{profile.email}</span>
            </>
          ) : (
            <>
              <IconAvatar size={80} />
              <GoogleLoginButton label="Google로 로그인하기" onClick={() => login("profile")} className="mt-1 px-8" />
              <p className="m-0 text-center text-body-sm text-on-surface-muted">
                로그인하면 다른 기기에서도 내 기록을 볼 수 있어요.
              </p>
            </>
          )}
        </section>
      )}

      <ul className="m-0 mt-4 flex list-none flex-col p-0">
        {ready && (
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
        <li>
          <Link href="/privacy" className={cn(ROW, "no-underline")}>
            <span>개인정보처리방침</span>
          </Link>
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
