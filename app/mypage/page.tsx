"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginEnabled } from "@/lib/flags";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";
import { IconAvatar, IconBack } from "@/components/icons";
import { goBackInApp } from "@/lib/nav";
import { useStore } from "@/lib/store";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { ToggleSwitch } from "@/components/ToggleSwitch";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";

const ROW =
  "flex min-h-16 w-full items-center justify-between gap-3 border-0 bg-transparent px-5 text-left text-body-md font-medium text-on-surface";

export default function MyPage() {
  const router = useRouter();
  const { ready, loggedIn, profile, showKo, toggleKo, login, logout, deleteAccount } = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [fbOpen, setFbOpen] = useState(false);

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

      <FeedbackDialog open={fbOpen} onOpenChange={setFbOpen} />

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
