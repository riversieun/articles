"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MOCK_PROFILE } from "@/lib/profile";
import { useStore } from "@/lib/store";
import { IconBack } from "@/components/icons";

const FB_KEY = "articles:proto:feedback";
const FB_KINDS = ["불편한 점", "아이디어", "번역·표현 오류", "기타"] as const;

export default function MyPage() {
  const router = useRouter();
  const {
    ready,
    loggedIn,
    showKo,
    notes,
    hl,
    savedX,
    savedA,
    toggleKo,
    openLogin,
    logout,
    loadSample,
    resetAll,
    showToast,
  } = useStore();

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
    showToast("피드백을 보냈어요. 운영자가 확인할게요");
  };

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  const stats = [
    ["저장한 표현", Object.keys(savedX).length],
    ["내 기록", notes.length + Object.keys(hl).filter((sid) => !notes.some((n) => n.sid === sid)).length],
    ["저장한 글", Object.keys(savedA).length],
  ] as const;

  return (
    <div className="min-h-dvh pb-10">
      <div className="sticky top-0 z-30 flex h-14 items-center gap-1 bg-paper pr-5 pl-1">
        <button
          onClick={goBack}
          aria-label="뒤로 가기"
          className="flex size-11 items-center justify-center border-0 bg-transparent text-ink"
        >
          <IconBack />
        </button>
        <h1 className="m-0 text-[17px] font-bold">마이페이지</h1>
      </div>

      {ready && !loggedIn && (
        <div className="mx-5 mt-2 flex flex-col items-start gap-2 rounded-[20px] bg-panel px-5 py-6">
          <h2 className="m-0 text-lg leading-[1.4] font-bold tracking-[-0.02em]">로그인하면 기록이 계정에 남아요</h2>
          <p className="m-0 text-[14.5px] leading-[1.65] text-sub">
            로그인 없이도 읽고 기록할 수 있어요. 구글 로그인으로 연결하면 기록이 백업되고 다른 기기에서도
            이어 볼 수 있어요.
          </p>
          <button
            onClick={openLogin}
            className="mt-2.5 h-12 rounded-3xl border-0 bg-lime px-[22px] text-[15px] font-semibold text-ink"
          >
            Google로 계속하기
          </button>
        </div>
      )}

      {ready && loggedIn && (
        <div className="flex flex-col gap-6 px-5 pt-2">
          <section className="flex items-center gap-4 rounded-[20px] bg-panel p-5">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-lime text-2xl font-bold text-ink">
              {MOCK_PROFILE.initial}
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate text-lg leading-[1.35] font-bold">{MOCK_PROFILE.name}</span>
              <span className="truncate text-sm text-sub">{MOCK_PROFILE.email}</span>
              <span className="mt-1 text-[12.5px] text-sub">
                Google 계정으로 연결됨
              </span>
            </div>
          </section>

          <section className="grid grid-cols-3 gap-2">
            {stats.map(([label, n]) => (
              <div key={label} className="flex flex-col gap-1 rounded-2xl bg-panel px-3.5 py-3.5">
                <span className="text-xl leading-none font-bold">{n}</span>
                <span className="text-[12.5px] text-sub">{label}</span>
              </div>
            ))}
          </section>

          <section className="flex flex-col">
            <h2 className="m-0 mb-1.5 text-[12.5px] font-bold">설정</h2>
            <div className="flex flex-col rounded-2xl bg-panel">
              <button
                role="switch"
                aria-checked={showKo}
                onClick={toggleKo}
                className="flex min-h-14 items-center justify-between gap-3 border-0 bg-transparent px-4 text-left text-[15px] font-medium text-ink"
              >
                <span>한글 번역 기본 표시</span>
                <span
                  aria-hidden="true"
                  className={`relative block h-[22px] w-[38px] shrink-0 rounded-[11px] transition-colors ${
                    showKo ? "bg-ink" : "bg-off"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 block size-[18px] rounded-full bg-white transition-[left] ${
                      showKo ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </span>
              </button>
            </div>
          </section>

          <section className="rounded-2xl bg-panel px-4 py-3.5 text-[12.5px] leading-[1.6] text-sub">
            <div className="font-semibold text-ink">프로토타입 도구</div>
            <div className="mt-2 flex gap-2">
              <button
                onClick={loadSample}
                className="h-11 rounded-[22px] border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink"
              >
                샘플 기록 채우기
              </button>
              <button
                onClick={resetAll}
                className="h-11 rounded-[22px] border border-line-strong bg-white px-3.5 text-[13px] font-medium text-ink"
              >
                기록 초기화
              </button>
            </div>
          </section>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="h-[50px] rounded-[25px] border-[1.5px] border-ink bg-transparent text-[15px] font-semibold text-ink"
          >
            로그아웃
          </button>
        </div>
      )}

      <section className="mx-5 mt-6 flex flex-col gap-3 rounded-[20px] bg-panel px-4 pt-5 pb-4">
        <div className="flex flex-col gap-1">
          <h2 className="m-0 text-[17px] leading-[1.4] font-bold tracking-[-0.02em]">운영자에게 피드백 보내기</h2>
          <p className="m-0 text-[13.5px] leading-[1.6] text-sub">
            번역이 어색하거나 불편한 점, 바라는 기능을 알려 주세요. 로그인하지 않아도 보낼 수 있어요.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="피드백 종류">
          {FB_KINDS.map((k) => (
            <button
              key={k}
              aria-pressed={fbKind === k}
              onClick={() => setFbKind(k)}
              className={`h-11 rounded-[22px] border px-4 text-sm font-medium ${
                fbKind === k ? "border-ink bg-ink text-white" : "border-line-strong bg-white text-ink"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
        <label htmlFor="fb-input" className="sr-only">
          피드백 내용
        </label>
        <textarea
          id="fb-input"
          rows={4}
          value={fbText}
          onChange={(e) => setFbText(e.target.value)}
          placeholder="어떤 점이 궁금하거나 아쉬웠는지 적어 주세요"
          className="box-border w-full resize-none rounded-2xl border-[1.5px] border-ink bg-white px-3.5 py-3 text-[15px] leading-[1.6] text-ink"
        />
        <button
          onClick={sendFeedback}
          disabled={!fbText.trim()}
          className="h-[50px] rounded-[25px] border-0 bg-ink text-[15px] font-semibold text-white disabled:opacity-40"
        >
          피드백 보내기
        </button>
      </section>
    </div>
  );
}
