"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

/** 앱이 뜨면 바로 분석 도구를 초기화한다. (Amplitude 자동 수집이 첫 화면부터 동작하도록) */
export function AmplitudeInit() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return null;
}
