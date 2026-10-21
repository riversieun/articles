import mixpanel from "mixpanel-browser";
import * as amplitude from "@amplitude/analytics-browser";
import { lib } from "./content";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const AMPLITUDE_KEY = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY;
let started = false;

/** 로그인 진입 경로. Login Button Clicked / Login Completed 의 trigger 값. */
export type LoginTrigger = "app_bar" | "guest_notice" | "mypage" | "reader_end_banner" | "backup_prompt";

/** 글 단위 이벤트에 공통으로 붙이는 속성. 값은 콘텐츠 데이터에서 가져온다. */
export function articleProps(aid: string) {
  const a = lib.byId[aid];
  return { article_id: aid, source: a?.src, content_type: a?.kind };
}

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

/** 로그인 상태가 바뀔 때마다 호출: 이후 모든 이벤트에 is_guest가 붙는다. (Mixpanel은 register, Amplitude는 사용자 속성) */
export function setGuestState(guest: boolean) {
  if (!initAnalytics()) return;
  if (MIXPANEL_TOKEN) mixpanel.register({ is_guest: guest });
  if (AMPLITUDE_KEY) amplitude.identify(new amplitude.Identify().set("is_guest", guest));
}

/** 로그아웃 시 호출: 다음 사용자와 섞이지 않게 두 도구의 사용자를 초기화한다. */
export function resetUser() {
  if (!initAnalytics()) return;
  if (MIXPANEL_TOKEN) mixpanel.reset();
  if (AMPLITUDE_KEY) amplitude.reset();
  setGuestState(true); // reset()이 공통 속성도 지우므로 게스트 상태로 다시 등록
}
