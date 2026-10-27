/**
 * 구글 로그인 화면을 보여줄지. 환경변수 NEXT_PUBLIC_LOGIN_ENABLED 가 "false" 일 때만 숨긴다.
 * 숨겨도 기록은 그대로 저장된다(로그인 없이 쓰는 서비스). 기본값은 켜짐이라 로컬·Preview 는 로그인 버전이다.
 * 이미 로그인된 세션은 숨겨도 그대로 프로필·로그아웃·계정 삭제가 보인다. 빌드할 때 값이 박히므로 바꾸면 다시 배포해야 한다.
 */
export const loginEnabled = process.env.NEXT_PUBLIC_LOGIN_ENABLED !== "false";
