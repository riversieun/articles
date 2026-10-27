/** 카카오톡 안에서만 쓸 수 있는 "기본 브라우저로 열기" 주소. 다른 앱은 이런 방법이 없어 사용자가 메뉴에서 직접 열어야 한다. */
export function canOpenExternal(app: string) {
  return /KAKAOTALK/i.test(app);
}

export function openExternal() {
  window.location.href = `kakaotalk://web/openExternal?url=${encodeURIComponent(window.location.href)}`;
}

/** 현재 주소를 복사한다. 앱 안 브라우저가 클립보드를 막으면 직접 복사할 수 있게 주소를 보여 준다. */
export async function copyLink(): Promise<boolean> {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    window.prompt("링크를 복사해 주세요", url);
    return false;
  }
}
