/**
 * 로그인 문제를 따라가기 위한 임시 기록. 최근 60줄만 localStorage 에 남긴다.
 * 토큰·코드·이메일은 남기지 않는다. 확인 방법: 개발자 도구 콘솔에서 `copy(localStorage.getItem("articles:authlog"))`
 */
const KEY = "articles:authlog";

export function logAuth(msg: string) {
  try {
    const lines = (localStorage.getItem(KEY) ?? "").split("\n").filter(Boolean);
    lines.push(`${new Date().toISOString().slice(11, 23)} ${msg}`);
    localStorage.setItem(KEY, lines.slice(-60).join("\n"));
  } catch {
    /* 무시 */
  }
  console.info("[auth]", msg);
}
