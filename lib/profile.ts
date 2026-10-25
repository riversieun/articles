/**
 * 프로토타입용 가짜 구글 프로필. 실제로는 Supabase Auth(Google) 사용자 정보를 쓴다.
 * image: 구글 계정 프로필 사진 URL(user_metadata.avatar_url). 지금은 자리표시 이미지.
 */
export const MOCK_PROFILE = {
  name: "디자인 러너",
  email: "designer@example.com",
  initial: "디",
  image: "/mock-profile.svg",
};
