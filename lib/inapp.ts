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
