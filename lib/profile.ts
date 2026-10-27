import type { User } from "@supabase/supabase-js";

export type Profile = { email: string; image: string; initial: string };

/**
 * Supabase 키가 없을 때(프로토타입 모드) 쓰는 가짜 구글 프로필.
 * image: 구글 계정 프로필 사진 URL. 지금은 자리표시 이미지.
 */
export const MOCK_PROFILE: Profile = {
  email: "designer@example.com",
  initial: "디",
  image: "/mock-profile.svg",
};

/**
 * 구글 로그인 사용자 정보에서 화면에 쓸 값만 뽑는다. 사진은 저장하지 않고 구글이 주는 주소로 표시만 한다. (PRD F-75)
 * 익명 사용자에 구글 계정을 연결(linkIdentity)하면 이름·사진이 user_metadata 가 아니라
 * 연결된 계정 정보(identities)에만 들어 있어서 그쪽도 읽는다.
 */
export function profileFromUser(user: User): Profile {
  type Meta = { avatar_url?: string; picture?: string; full_name?: string; name?: string; email?: string };
  const fromIdentity = user.identities?.find((i) => i.provider === "google")?.identity_data as Meta | undefined;
  const meta: Meta = { ...fromIdentity, ...(user.user_metadata as Meta) };
  const email = user.email ?? fromIdentity?.email ?? "";
  const label = meta.full_name ?? meta.name ?? email;
  return {
    email,
    image: meta.avatar_url ?? meta.picture ?? "",
    initial: Array.from(label)[0]?.toUpperCase() ?? "",
  };
}
