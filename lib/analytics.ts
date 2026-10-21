import mixpanel from "mixpanel-browser";
import * as amplitude from "@amplitude/analytics-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const AMPLITUDE_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
let started = false;

/** 브라우저에서 한 번만 두 도구를 초기화한다. 키가 없는 쪽은 조용히 건너뛴다. */
export function initAnalytics(): boolean {
  if (typeof window === "undefined") return false;
  if (!started) {
    started = true;
    if (MIXPANEL_TOKEN) {
      mixpanel.init(MIXPANEL_TOKEN, {
        autocapture: false,
        track_pageview: false,
        persistence: "localStorage",
        debug: process.env.NODE_ENV !== "production",
      });
    }
    if (AMPLITUDE_KEY) {
      amplitude.init(AMPLITUDE_KEY, {
        flushQueueSize: 1, // 이벤트마다 바로 전송 (기본값은 30개 또는 1초 단위로 묶어서 전송)
        flushIntervalMillis: 500,
        autocapture: {
          pageViews: true,
          sessions: true,
          formInteractions: true,
          fileDownloads: true,
          elementInteractions: true, // 클릭은 기본값이 꺼짐이라 명시
        },
      });
    }
  }
  return !!(MIXPANEL_TOKEN || AMPLITUDE_KEY);
}

/** 같은 이름·속성으로 Mixpanel과 Amplitude에 보낸다. 코멘트·생각 본문 같은 유저 텍스트는 보내지 않는다. */
export function track(event: string, props?: Record<string, unknown>) {
  if (!initAnalytics()) return;
  if (MIXPANEL_TOKEN) mixpanel.track(event, props);
  if (AMPLITUDE_KEY) amplitude.track(event, props);
}

/** 로그인(Supabase) 후 호출: 두 도구에 같은 사용자 ID를 넣는다. 이메일 대신 내부 ID(user.id)를 쓴다. */
export function identifyUser(userId: string) {
  if (!initAnalytics()) return;
  if (MIXPANEL_TOKEN) mixpanel.identify(userId);
  if (AMPLITUDE_KEY) amplitude.setUserId(userId);
}

/** 로그아웃 시 호출: 다음 사용자와 섞이지 않게 두 도구의 사용자를 초기화한다. */
export function resetUser() {
  if (!initAnalytics()) return;
  if (MIXPANEL_TOKEN) mixpanel.reset();
  if (AMPLITUDE_KEY) amplitude.reset();
}
