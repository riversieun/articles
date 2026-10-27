"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { lib } from "./content";
import { identifyUser, resetUser, setGuestState, track, type LoginTrigger } from "./analytics";
import { MOCK_PROFILE, profileFromUser, type Profile } from "./profile";
import {
  clearOutbox,
  deleteMyAccount,
  enqueue,
  flush,
  inAppBrowserName,
  outboxSize,
  pull,
  seedOutbox,
  signOutLocal,
  startGoogleLogin,
  type Op,
  type Pulled,
} from "./remote";
import { logAuth } from "./authlog";
import { loginEnabled } from "./flags";
import { supabase, supabaseEnabled } from "./supabase";
import type { Note } from "./types";
import type { Session } from "@supabase/supabase-js";

/**
 * 클라이언트 스토어. 화면은 이 로컬 상태를 먼저 바꾸고(localStorage 에도 저장),
 * Supabase 가 연결돼 있으면 같은 변경을 lib/remote.ts 의 편지함에 쌓아 서버로 보낸다. (PRD F-71)
 * 키(NEXT_PUBLIC_SUPABASE_*)가 없으면 예전 프로토타입처럼 localStorage 만 쓰고 로그인은 가짜로 동작한다.
 */
type Persisted = {
  /** 프로토타입 모드(Supabase 키 없음)에서만 쓰는 가짜 로그인 플래그. 연결 후에는 실제 세션으로 정한다. */
  loggedIn: boolean;
  showKo: boolean;
  hl: Record<string, true>;
  notes: Note[];
  savedA: Record<string, true>;
  /** 이미 보여준 "기록 백업" 제안 (각 1회) */
  prompted: Record<string, true>;
};

const EMPTY: Persisted = {
  loggedIn: false,
  showKo: true,
  hl: {},
  notes: [],
  savedA: {},
  prompted: {},
};

const KEY = "articles:proto:v1";
/** 이 기기에서 마지막으로 동기화한 사용자 id. 바뀌면(첫 연결·다른 계정으로 로그인) 로컬 기록을 서버로 합친다. */
const UID_KEY = "articles:uid:v1";
/** 구글 화면으로 나가기 전에 남기는 값(돌아온 뒤 Login Completed 를 보내기 위해). 탭을 닫으면 사라지도록 sessionStorage. */
const TRIGGER_KEY = "articles:login-trigger";
const MERGE_KEY = "articles:login-merge";
/** 이 기기에서 구글 로그인을 한 적이 있다는 표시. 있으면 다음 로그인은 "연결" 없이 바로 그 계정으로 로그인한다. (구글 계정 선택 화면이 두 번 나오지 않게) */
const GOOGLE_SEEN_KEY = "articles:google-seen";

type Auth = { loggedIn: boolean; profile: Profile };
const GUEST: Auth = { loggedIn: false, profile: { email: "", image: "", initial: "" } };

const lsGet = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const lsSet = (k: string, v: string | null) => {
  try {
    if (v === null) localStorage.removeItem(k);
    else localStorage.setItem(k, v);
  } catch {
    /* 무시 */
  }
};
const ssGet = (k: string) => {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
};
const ssSet = (k: string, v: string | null) => {
  try {
    if (v === null) sessionStorage.removeItem(k);
    else sessionStorage.setItem(k, v);
  } catch {
    /* 무시 */
  }
};

export type PromptReason = "manual" | "comment";
/** 자동으로 뜬 "기록 백업" 제안의 분석용 trigger 값 */
const PROMPT_TRIGGER = { comment: "first_comment" } as const;
export type Sheet =
  | { type: "login"; reason: PromptReason; trigger: LoginTrigger }
  | { type: "comment"; sid: string; editId: string }
  | null;

type Ctx = Persisted & {
  ready: boolean;
  profile: Profile;
  sheet: Sheet;
  toast: string;
  hasRecords: boolean;
  openLogin: (trigger: LoginTrigger) => void;
  closeSheet: () => void;
  login: (trigger?: LoginTrigger) => void;
  logout: () => void;
  deleteAccount: () => void;
  toggleKo: (aid?: string) => void;
  toggleHl: (sid: string) => void;
  openComment: (sid: string) => void;
  editNote: (id: string) => void;
  updateNote: (id: string, text: string) => void;
  saveComment: (sid: string, text: string) => void;
  addThought: (aid: string, text: string) => void;
  removeNote: (id: string) => void;
  toggleA: (aid: string) => void;
  showToast: (msg: string) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function useStore() {
  const v = useContext(StoreCtx);
  if (!v) throw new Error("useStore must be used inside <StoreProvider>");
  return v;
}

let seq = 0;
const newId = () => `n${Date.now().toString(36)}${(seq++).toString(36)}`;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<Persisted>(EMPTY);
  const [ready, setReady] = useState(false);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [toast, setToast] = useState("");
  const [auth, setAuth] = useState<Auth>(GUEST);
  const ref = useRef<Persisted>(EMPTY);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const commit = useCallback((next: Persisted) => {
    ref.current = next;
    setState(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* 무시 */
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    clearTimeout(timer.current);
    setToast(msg);
    timer.current = setTimeout(() => setToast(""), 2400);
  }, []);

  /** 서버로 보낼 변경을 편지함에 넣고 바로 전송을 시도한다. 키가 없으면 아무것도 하지 않는다. */
  const send = useCallback((...ops: Op[]) => {
    if (!supabaseEnabled) return;
    enqueue(...ops);
    void flush();
  }, []);

  /** 서버의 기록을 로컬 상태에 반영한다. 그 사이 새로 쌓인 변경이 있으면 건너뛰고 다음 동기화에 맡긴다. */
  const applyPulled = useCallback(
    (p: Pulled) => {
      if (outboxSize() > 0) return;
      commit({ ...ref.current, hl: p.hl, notes: p.notes, savedA: p.savedA, showKo: p.showKo ?? ref.current.showKo });
    },
    [commit],
  );

  /**
   * 로그인 세션이 바뀔 때마다: 화면용 로그인 상태를 정하고, 기록을 서버와 맞춘다.
   * 맞추는 순서 = (처음 연결이거나 사용자가 바뀌었으면 로컬 기록을 편지함에 담기) → 편지함 전송 → 서버 기록 받아오기.
   * 로컬 기록과 서버 기록은 합집합이라 구글 계정을 다른 기기에서 쓰던 경우에도 기록이 합쳐진다. (PRD F-73)
   */
  const syncSession = useCallback(
    async (session: Session | null) => {
      const user = session?.user ?? null;
      const loggedIn = !!user && !user.is_anonymous;
      logAuth(`세션 반영: ${user ? (user.is_anonymous ? "익명" : "구글") : "없음"} ${user?.id.slice(0, 8) ?? ""}`);
      setAuth(loggedIn ? { loggedIn, profile: profileFromUser(user) } : GUEST);
      if (!user) return;

      if (loggedIn) {
        lsSet(GOOGLE_SEEN_KEY, "1");
        identifyUser(user.id);
        const trigger = ssGet(TRIGGER_KEY);
        if (trigger) {
          const merged = ssGet(MERGE_KEY) === "1";
          ssSet(TRIGGER_KEY, null);
          ssSet(MERGE_KEY, null);
          setGuestState(false); // Login Completed부터 is_guest=false
          track("Login Completed", { trigger, merged });
          showToast("구글 계정에 기록을 연결했어요");
        }
      }

      if (lsGet(UID_KEY) !== user.id) {
        const cur = ref.current;
        logAuth(`사용자 바뀜 → 로컬 기록 올리기: 하이라이트 ${Object.keys(cur.hl).length}, 노트 ${cur.notes.length}, 저장 ${Object.keys(cur.savedA).length}`);
        seedOutbox(cur, (sid) => lib.sent[sid]?.aid);
        lsSet(UID_KEY, user.id);
      }
      if (!(await flush())) {
        logAuth("전송 막힘(나중에 다시)");
        return; // 네트워크가 막히면 다음 기회(online·화면 복귀)에 다시
      }
      try {
        const pulled = await pull(user.id);
        logAuth(`서버 기록: 하이라이트 ${Object.keys(pulled.hl).length}, 노트 ${pulled.notes.length}, 저장 ${Object.keys(pulled.savedA).length}`);
        applyPulled(pulled);
      } catch {
        /* 못 받아와도 로컬 기록으로 계속 쓴다 */
      }
    },
    [applyPulled, showToast],
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        // v0.4에서 삭제된 표현 저장(savedX)과 "표현 3개" 백업 제안 기록(prompted.expr3)은 버린다.
        // 하이라이트·코멘트·생각·저장한 글은 그대로 둔다. 다음 저장 때 localStorage에서도 사라진다.
        const { savedX: _dropped, ...saved } = JSON.parse(raw) as Partial<Persisted> & { savedX?: unknown };
        const { expr3: _expr3, ...prompted } = (saved.prompted ?? {}) as Record<string, true>;
        const next = { ...EMPTY, ...saved, prompted };
        ref.current = next;
        setState(next);
      }
    } catch {
      /* 저장소를 못 읽어도 빈 상태로 동작 */
    }
    if (!supabaseEnabled) {
      setReady(true);
      return;
    }

    let alive = true;
    const sb = supabase();
    // 콜백 안에서 바로 Supabase 를 부르면 막힐 수 있어 한 박자 뒤로 미룬다.
    logAuth(`페이지 열림 ${window.location.pathname}${window.location.search ? " (주소에 파라미터 있음: " + [...new URLSearchParams(window.location.search).keys()].join(",") + ")" : ""}${window.location.hash ? " (해시 있음)" : ""}`);
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      logAuth(`인증 이벤트 ${_event}`);
      setTimeout(() => alive && void syncSession(session), 0);
    });

    (async () => {
      // 이미 연결된 구글 계정을 다시 연결하려다 돌아온 경우: 그 계정으로 로그인해서 기록을 합친다.
      const q = new URLSearchParams(window.location.search);
      const h = new URLSearchParams(window.location.hash.slice(1));
      const errCode = q.get("error_code") ?? h.get("error_code");
      if (errCode) logAuth(`돌아온 주소의 오류: ${errCode}`);
      if (errCode === "identity_already_exists") {
        window.history.replaceState(null, "", window.location.pathname);
        ssSet(MERGE_KEY, "1");
        try {
          await startGoogleLogin(true); // 연결이 아니라 그 계정으로 로그인
          return;
        } catch (e) {
          console.error("[login] 기존 구글 계정으로 로그인하지 못함", e);
          logAuth(`기존 구글 계정으로 로그인 실패: ${e instanceof Error ? e.message : String(e)}`);
        }
        ssSet(MERGE_KEY, null);
        ssSet(TRIGGER_KEY, null);
        showToast("구글 계정을 연결하지 못했어요. 잠시 후 다시 시도해주세요");
      }
      try {
        const { data } = await sb.auth.getSession();
        const user = data.session?.user;
        const loggedIn = !!user && !user.is_anonymous;
        if (alive) setAuth(loggedIn ? { loggedIn, profile: profileFromUser(user) } : GUEST);
      } catch {
        /* 세션을 못 읽어도 게스트로 동작 */
      }
      if (alive) setReady(true);
    })();

    // 오프라인 동안 쌓인 변경은 연결이 돌아오거나 화면으로 다시 돌아왔을 때 보낸다.
    const retry = () => void flush();
    window.addEventListener("online", retry);
    document.addEventListener("visibilitychange", retry);
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
      window.removeEventListener("online", retry);
      document.removeEventListener("visibilitychange", retry);
    };
  }, [syncSession, showToast]);

  /** 게스트에게 가치가 쌓인 시점에 한 번만 "기록 백업"을 제안한다. (PRD F-72) */
  const maybePrompt = useCallback(
    (next: Persisted, key: Exclude<PromptReason, "manual">): Persisted => {
      if (!loginEnabled || next.loggedIn || next.prompted[key]) return next;
      track("Backup Prompt Shown", { trigger: PROMPT_TRIGGER[key] });
      setSheet({ type: "login", reason: key, trigger: "backup_prompt" });
      return { ...next, prompted: { ...next.prompted, [key]: true } };
    },
    [],
  );

  const value = useMemo<Ctx>(() => {
    return {
      ...state,
      loggedIn: supabaseEnabled ? auth.loggedIn : state.loggedIn,
      profile: supabaseEnabled ? auth.profile : MOCK_PROFILE,
      ready,
      sheet,
      toast,
      hasRecords:
        state.notes.length > 0 ||
        Object.keys(state.hl).length > 0 ||
        Object.keys(state.savedA).length > 0,
      showToast,
      openLogin: (trigger) => {
        track("Login Button Clicked", { trigger });
        setSheet({ type: "login", reason: "manual", trigger });
      },
      closeSheet: () => {
        if (sheet?.type === "login" && sheet.reason !== "manual") {
          track("Backup Prompt Dismissed", { trigger: PROMPT_TRIGGER[sheet.reason] });
        }
        setSheet(null);
      },
      login: (direct) => {
        const trigger = direct ?? (sheet?.type === "login" ? sheet.trigger : "unknown");
        // 버튼이 곧 로그인인 경우(백업 제안 시트, 프로필 페이지)는 여기서 Login Button Clicked 를 보낸다.
        if (direct || trigger === "backup_prompt") track("Login Button Clicked", { trigger });

        if (!supabaseEnabled) {
          // 프로토타입 모드: 실제 인증 없이 로그인 상태만 흉내 낸다.
          setGuestState(false); // Login Completed부터 is_guest=false
          track("Login Completed", { trigger, merged: false });
          commit({ ...ref.current, loggedIn: true });
          setSheet(null);
          showToast("구글 계정에 기록을 연결했어요 (프로토타입: 실제 인증 없음)");
          return;
        }

        // 구글은 앱 안 브라우저에서의 로그인을 막는다. 구글 화면으로 보내기 전에 안내한다.
        const inApp = inAppBrowserName();
        if (inApp) {
          setSheet(null);
          showToast("이 앱 안에서는 구글 로그인이 막혀 있어요. 메뉴에서 '다른 브라우저로 열기'를 눌러주세요");
          return;
        }
        ssSet(TRIGGER_KEY, trigger);
        ssSet(MERGE_KEY, null); // 이전 시도에서 남은 표시가 이번 로그인에 섞이지 않게
        setSheet(null);
        startGoogleLogin().catch((e) => {
          console.error("[login] 구글 로그인을 시작하지 못함", e);
          ssSet(TRIGGER_KEY, null);
          showToast("로그인을 시작하지 못했어요. 잠시 후 다시 시도해주세요");
        });
      },
      logout: () => {
        logAuth("로그아웃 버튼");
        track("Logout");
        if (!supabaseEnabled) {
          commit({ ...ref.current, loggedIn: false });
          showToast("로그아웃했어요");
          return;
        }
        // 기록은 계정에 있으니 이 기기에서는 지운다. (다음 사람이 보지 않게) 번역 설정과 백업 제안 기록은 남긴다.
        // 아직 못 보낸 변경이 있으면 2초까지만 기다려 먼저 보낸다.
        const wait = outboxSize() > 0 ? Promise.race([flush(), new Promise((r) => setTimeout(r, 2000))]) : Promise.resolve();
        void wait.then(() => {
          clearOutbox();
          lsSet(UID_KEY, null);
          commit({ ...EMPTY, showKo: ref.current.showKo, prompted: ref.current.prompted });
          void signOutLocal();
          resetUser();
          showToast("로그아웃했어요");
        });
      },
      deleteAccount: () => {
        track("Account Deleted");
        if (!supabaseEnabled) {
          commit({ ...EMPTY });
          showToast("계정을 삭제했어요");
          return;
        }
        deleteMyAccount()
          .then(() => {
            clearOutbox();
            lsSet(UID_KEY, null);
            commit({ ...EMPTY });
            resetUser();
            showToast("계정을 삭제했어요");
          })
          .catch(() => showToast("계정을 삭제하지 못했어요. 잠시 후 다시 시도해주세요"));
      },
      toggleKo: (aid) => {
        const on = !ref.current.showKo;
        track("Translation Toggled", { ...(aid ? { article_id: aid } : {}), on });
        commit({ ...ref.current, showKo: on });
        send({ t: "ko", on });
      },
      toggleHl: (sid) => {
        const hl = { ...ref.current.hl };
        const on = !hl[sid];
        const aid = lib.sent[sid].aid;
        track("Highlight Toggled", { article_id: aid, on });
        if (on) hl[sid] = true;
        else delete hl[sid];
        commit({ ...ref.current, hl });
        send({ t: "hl", sid, aid, on });
      },
      openComment: (sid) => setSheet({ type: "comment", sid, editId: "" }),
      editNote: (id) => {
        const n = ref.current.notes.find((it) => it.id === id);
        if (n) setSheet({ type: "comment", sid: n.sid, editId: id });
      },
      updateNote: (id, text) => {
        const t = text.trim();
        if (!t) return;
        const target = ref.current.notes.find((n) => n.id === id);
        if (target) track("Note Edited", { article_id: target.aid, note_type: target.sid ? "comment" : "thought" });
        const notes = ref.current.notes.map((n) => (n.id === id ? { ...n, text: t } : n));
        commit({ ...ref.current, notes });
        const edited = notes.find((n) => n.id === id);
        if (edited) send({ t: "note", note: edited });
        setSheet(null);
        showToast("수정했어요");
      },
      saveComment: (sid, text) => {
        const t = text.trim();
        if (!t) return;
        const cur = ref.current;
        const note: Note = { id: newId(), aid: lib.sent[sid].aid, sid, text: t, at: Date.now() };
        const first = !cur.notes.some((n) => n.sid);
        track("Comment Saved", { article_id: note.aid });
        setSheet(null);
        let next: Persisted = { ...cur, notes: [...cur.notes, note] };
        showToast("코멘트를 남겼어요. 글 아래 내 생각에 모여요");
        if (first) next = maybePrompt(next, "comment");
        commit(next);
        send({ t: "note", note });
      },
      addThought: (aid, text) => {
        const t = text.trim();
        if (!t) return;
        const cur = ref.current;
        track("Thought Added", { article_id: aid });
        const note: Note = { id: newId(), aid, sid: "", text: t, at: Date.now() };
        commit({ ...cur, notes: [...cur.notes, note] });
        send({ t: "note", note });
        showToast("생각을 남겼어요. 아카이브에서 다시 볼 수 있어요");
      },
      removeNote: (id) => {
        const target = ref.current.notes.find((n) => n.id === id);
        track("Note Deleted", {
          ...(target ? { article_id: target.aid, note_type: target.sid ? "comment" : "thought" } : {}),
        });
        commit({ ...ref.current, notes: ref.current.notes.filter((n) => n.id !== id) });
        send({ t: "noteDel", id });
        showToast("삭제했어요");
      },
      toggleA: (aid) => {
        const savedA = { ...ref.current.savedA };
        const on = !savedA[aid];
        track("Article Saved Toggled", { article_id: aid, on });
        if (on) savedA[aid] = true;
        else delete savedA[aid];
        commit({ ...ref.current, savedA });
        send({ t: "saved", aid, on });
        if (on) showToast("글을 저장했어요. 아카이브에서 볼 수 있어요");
      },
    };
  }, [state, auth, ready, sheet, toast, commit, showToast, maybePrompt, send]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
