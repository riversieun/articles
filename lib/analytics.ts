import mixpanel from "mixpanel-browser";

const TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
let started = false;

function start(): boolean {
  if (!TOKEN || typeof window === "undefined") return false;
  if (!started) {
    mixpanel.init(TOKEN, {
      autocapture: false,
      track_pageview: false,
      persistence: "localStorage",
      debug: process.env.NODE_ENV !== "production",
    });
    started = true;
  }
  return true;
}

/** 토큰이 없으면(.env.local 미설정) 조용히 무시한다. 코멘트·생각 본문 같은 유저 텍스트는 보내지 않는다. */
export function track(event: string, props?: Record<string, unknown>) {
  if (!start()) return;
  mixpanel.track(event, props);
}
