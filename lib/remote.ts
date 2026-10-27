import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { logAuth } from "./authlog";
import type { Note } from "./types";

/**
 * 사용자 기록을 Supabase 에 보내고 받아오는 층.
 * 화면은 항상 로컬 상태를 먼저 바꾸고(낙관적 갱신), 서버로 보낼 일은 "보낼 편지함(outbox)"에 쌓는다.
 * 네트워크가 끊겨도 편지함은 localStorage 에 남아 있다가 다음에 순서대로 전송된다.
 * 익명 사용자는 첫 기록을 보낼 때 만든다. (방문만 하는 사람·검색 로봇이 사용자로 쌓이지 않게)
 */
export type Op =
  | { t: "hl"; sid: string; aid: string; on: boolean }
  | { t: "note"; note: Note }
  | { t: "noteDel"; id: string }
  | { t: "saved"; aid: string; on: boolean }
  | { t: "ko"; on: boolean };

export type Pulled = {
  hl: Record<string, true>;
  notes: Note[];
  savedA: Record<string, true>;
  /** 서버에 설정 행이 없으면 undefined (로컬 값을 그대로 둔다) */
  showKo?: boolean;
};

const OUTBOX_KEY = "articles:outbox:v1";

const readOutbox = (): Op[] => {
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) ?? "[]") as Op[];
  } catch {
    return [];
  }
};
const writeOutbox = (ops: Op[]) => {
  try {
    if (ops.length) localStorage.setItem(OUTBOX_KEY, JSON.stringify(ops));
    else localStorage.removeItem(OUTBOX_KEY);
  } catch {
    /* 저장소를 못 써도 이번 접속 동안은 메모리 상태로 동작 */
  }
};

export const enqueue = (...ops: Op[]) => writeOutbox([...readOutbox(), ...ops]);
export const outboxSize = () => readOutbox().length;
export const clearOutbox = () => writeOutbox([]);

/** 현재 상태 전체를 편지함에 넣는다. (처음 연결할 때 기존 기록 가져오기, 다른 계정으로 합칠 때) 같은 기록은 덮어쓰기라 여러 번 보내도 중복되지 않는다. */
export function seedOutbox(s: { hl: Record<string, true>; notes: Note[]; savedA: Record<string, true>; showKo: boolean }, aidOf: (sid: string) => string | undefined) {
  const ops: Op[] = [];
  for (const sid of Object.keys(s.hl)) {
    const aid = aidOf(sid);
    if (aid) ops.push({ t: "hl", sid, aid, on: true });
  }
  for (const note of s.notes) ops.push({ t: "note", note });
  for (const aid of Object.keys(s.savedA)) ops.push({ t: "saved", aid, on: true });
  if (!s.showKo) ops.push({ t: "ko", on: false });
  enqueue(...ops);
}

let creating: Promise<User> | null = null;

/** 로그인 세션이 있으면 그 사용자, 없으면 익명 사용자를 만들어 돌려준다. */
export function ensureUser(): Promise<User> {
  creating ??= (async () => {
    const sb = supabase();
    const { data } = await sb.auth.getSession();
    if (data.session) return data.session.user;
    const res = await sb.auth.signInAnonymously();
    if (res.error || !res.data.user) throw res.error ?? new Error("익명 세션을 만들지 못했어요");
    return res.data.user;
  })().finally(() => {
    creating = null;
  });
  return creating;
}

/**
 * 서버가 요청을 받고 거절한 오류(제약·권한)는 다시 보내도 같은 결과라 버려서 편지함이 막히지 않게 한다.
 * 네트워크 오류와 로그인 만료(PGRST3xx)는 던져서 나중에 다시 보낸다.
 */
function check(error: { code?: string; message: string } | null) {
  if (!error) return;
  if (error.code && !error.code.startsWith("PGRST3")) {
    console.warn("[remote] 서버가 거절해서 건너뜀:", error.code, error.message);
    return;
  }
  throw new Error(error.message);
}

async function apply(uid: string, op: Op) {
  const sb = supabase();
  switch (op.t) {
    case "hl":
      return check(
        (op.on
          ? await sb.from("highlights").upsert({ user_id: uid, sentence_id: op.sid, article_id: op.aid })
          : await sb.from("highlights").delete().eq("user_id", uid).eq("sentence_id", op.sid)
        ).error,
      );
    case "note":
      return check(
        (
          await sb.from("notes").upsert({
            user_id: uid,
            id: op.note.id,
            article_id: op.note.aid,
            sentence_id: op.note.sid,
            body: op.note.text,
            created_at: new Date(op.note.at).toISOString(),
          })
        ).error,
      );
    case "noteDel":
      return check((await sb.from("notes").delete().eq("user_id", uid).eq("id", op.id)).error);
    case "saved":
      return check(
        (op.on
          ? await sb.from("saved_articles").upsert({ user_id: uid, article_id: op.aid })
          : await sb.from("saved_articles").delete().eq("user_id", uid).eq("article_id", op.aid)
        ).error,
      );
    case "ko":
      return check((await sb.from("user_settings").upsert({ user_id: uid, show_ko: op.on })).error);
  }
}

let flushing: Promise<boolean> | null = null;

/** 편지함을 앞에서부터 하나씩 보낸다. 모두 보냈으면 true, 중간에 막히면 false(남은 것은 다음에). */
export function flush(): Promise<boolean> {
  flushing ??= (async () => {
    if (!readOutbox().length) return true;
    try {
      const user = await ensureUser();
      for (;;) {
        const [op] = readOutbox();
        if (!op) return true;
        await apply(user.id, op);
        writeOutbox(readOutbox().slice(1));
      }
    } catch {
      return false;
    }
  })().finally(() => {
    flushing = null;
  });
  return flushing;
}

/** 서버에 있는 내 기록 전부. (한 표당 PostgREST 기본 한도 1000행) */
export async function pull(uid: string): Promise<Pulled> {
  const sb = supabase();
  const [hl, notes, saved, settings] = await Promise.all([
    sb.from("highlights").select("sentence_id").eq("user_id", uid),
    sb.from("notes").select("id, article_id, sentence_id, body, created_at").eq("user_id", uid),
    sb.from("saved_articles").select("article_id").eq("user_id", uid),
    sb.from("user_settings").select("show_ko").eq("user_id", uid).maybeSingle(),
  ]);
  for (const r of [hl, notes, saved, settings]) if (r.error) throw new Error(r.error.message);
  return {
    hl: Object.fromEntries((hl.data ?? []).map((r) => [r.sentence_id as string, true as const])),
    notes: (notes.data ?? [])
      .map((r) => ({
        id: r.id as string,
        aid: r.article_id as string,
        sid: r.sentence_id as string,
        text: r.body as string,
        at: new Date(r.created_at as string).getTime(),
      }))
      .sort((a, b) => a.at - b.at),
    savedA: Object.fromEntries((saved.data ?? []).map((r) => [r.article_id as string, true as const])),
    showKo: settings.data ? (settings.data.show_ko as boolean) : undefined,
  };
}

/**
 * 구글 로그인을 시작한다. 이미 익명 사용자면 그 사용자에 구글 계정을 연결(linkIdentity)해서
 * user_id 를 그대로 둔다. (기록 승계) 구글 화면으로 이동하므로 이 함수 뒤의 코드는 실행되지 않는다.
 * forceSignIn: 그 구글 계정이 이미 다른 사용자에 연결돼 있어 연결이 거절된 뒤에는 연결을 또 시도하지 말고
 * 그 계정으로 그냥 로그인해야 한다. (익명 세션이 남아 있어도)
 */
export async function startGoogleLogin(forceSignIn = false): Promise<void> {
  // 구글 화면이 끝없이 반복되는 것을 막는다. 정상 흐름은 2분 안에 많아야 2번(연결 → 로그인).
  try {
    const now = Date.now();
    const recent = (JSON.parse(sessionStorage.getItem("articles:login-attempts") ?? "[]") as number[]).filter((t) => now - t < 120000);
    recent.push(now);
    sessionStorage.setItem("articles:login-attempts", JSON.stringify(recent));
    if (recent.length > 3) {
      logAuth("로그인 시도가 짧은 시간에 반복돼 중단");
      throw new Error("로그인 시도가 반복돼 중단했어요");
    }
  } catch (e) {
    if (e instanceof Error && e.message.startsWith("로그인 시도")) throw e;
  }
  const sb = supabase();
  const redirectTo = window.location.origin + window.location.pathname;
  const { data } = await sb.auth.getSession();
  // 이 기기에서 구글 로그인을 한 적이 있으면 이미 연결된 계정일 가능성이 커서, 연결을 시도하지 않고 바로 로그인한다.
  // (이 경우 이 기기의 기록은 로그인 뒤 합쳐서 올린다)
  let seen = false;
  try {
    seen = localStorage.getItem("articles:google-seen") === "1";
  } catch {
    /* 무시 */
  }
  const link = !!data.session?.user.is_anonymous && !forceSignIn && !seen;
  logAuth(`구글로 이동: ${link ? "연결(link)" : "로그인(signIn)"}, 현재 세션=${data.session ? (data.session.user.is_anonymous ? "익명" : "구글") : "없음"}, forceSignIn=${forceSignIn}, 이전 구글 로그인=${seen}`);
  // 브라우저에 구글 계정이 하나만 로그인돼 있으면 구글이 선택 화면 없이 그 계정으로 바로 진행한다.
  // 다른 계정으로 로그인하려는 사람이 의도와 다른 계정으로 들어가지 않게 항상 계정 선택 화면을 띄운다.
  const options = { redirectTo, queryParams: { prompt: "select_account" } };
  const res = link
    ? await sb.auth.linkIdentity({ provider: "google", options })
    : await sb.auth.signInWithOAuth({ provider: "google", options });
  if (res.error) throw res.error;
}

export const signOutLocal = () => supabase().auth.signOut({ scope: "local" });

/** 서버 함수 delete_my_account()가 내 계정과 기록(연결된 표 전부)을 지운다. */
export async function deleteMyAccount() {
  const sb = supabase();
  const { error } = await sb.rpc("delete_my_account");
  if (error) throw new Error(error.message);
  await sb.auth.signOut({ scope: "local" });
}

export async function sendFeedbackRemote(kind: string, body: string) {
  const user = await ensureUser();
  const { error } = await supabase().from("feedback").insert({ user_id: user.id, kind, body });
  if (error) throw new Error(error.message);
}

/** 구글이 앱 안 브라우저(웹뷰)에서의 로그인을 막기 때문에 미리 알아본다. */
export function inAppBrowserName(): string | null {
  if (typeof navigator === "undefined") return null;
  // 개발 서버에서만: 주소에 ?inapp=1 을 붙이면 앱 안 브라우저처럼 동작해 안내 시트를 확인할 수 있다. (배포 빌드에는 들어가지 않는다)
  if (process.env.NODE_ENV !== "production" && new URLSearchParams(window.location.search).has("inapp")) return "DEV";
  const ua = navigator.userAgent;
  const m = ua.match(/Instagram|FBAN|FBAV|KAKAOTALK|NAVER\(inapp|DaumApps|Line\//i);
  return m ? m[0] : null;
}
