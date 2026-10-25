"use client";

import { useState } from "react";
import { MOCK_PROFILE } from "@/lib/profile";

/** 로그인한 구글 계정의 프로필 사진. 사진이 없거나 못 불러오면 이니셜 원으로 대신한다. */
export function ProfileAvatar({ size }: { size: number }) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };

  if (!MOCK_PROFILE.image || failed) {
    return (
      <span
        aria-hidden="true"
        style={style}
        className="flex shrink-0 items-center justify-center rounded-full bg-lime text-body-md font-bold text-on-accent"
      >
        {MOCK_PROFILE.initial}
      </span>
    );
  }
  return (
    // 구글 프로필 사진은 외부 주소라 레퍼러를 보내지 않는다
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={MOCK_PROFILE.image}
      alt=""
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      style={style}
      className="shrink-0 rounded-full object-cover"
    />
  );
}
