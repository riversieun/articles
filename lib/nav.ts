/**
 * 이 페이지를 연 뒤 앱 안에서 화면을 옮긴 횟수.
 * 구글 로그인에서 돌아오면 페이지가 새로 열려 0 으로 돌아가므로,
 * 뒤로 가기가 구글 계정 선택 화면 같은 앱 밖 기록으로 가지 않게 거를 수 있다.
 */
let moves = 0;

export const markNavigation = () => {
  moves += 1;
};

/** 앱 안에 돌아갈 화면이 있으면 router.back(), 없으면 홈으로. */
export function goBackInApp(router: { back: () => void; push: (href: string) => void }) {
  if (moves > 0) router.back();
  else router.push("/");
}
