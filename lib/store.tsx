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
import { setGuestState, track, type LoginTrigger } from "./analytics";
import type { Note } from "./types";

/**
 * 프로토타입용 클라이언트 스토어.
 * 실제 서비스에서는 Supabase 익명 세션(user_id)에 저장되는 데이터이며,
 * 여기서는 localStorage 로 "게스트 기록"을 흉내 낸다. (PRD F-71)
 */
type Persisted = {
  /** 구글 로그인(백업) 여부. 프로토타입에서는 실제 인증 없이 플래그만 바뀐다. */
  loggedIn: boolean;
  showKo: boolean;
  hl: Record<string, true>;
  notes: Note[];
  savedX: Record<string, true>;
  savedA: Record<string, true>;
  /** 이미 보여준 "기록 백업" 제안 (각 1회) */
  prompted: Record<string, true>;
};

const EMPTY: Persisted = {
  loggedIn: false,
  showKo: true,
  hl: {},
  notes: [],
  savedX: {},
  savedA: {},
  prompted: {},
};

const KEY = "articles:proto:v1";

export type PromptReason = "manual" | "expr3" | "comment";
/** 자동으로 뜬 "기록 백업" 제안의 분석용 trigger 값 */
const PROMPT_TRIGGER = { expr3: "expressions_3", comment: "first_comment" } as const;
export type Sheet =
  | { type: "login"; reason: PromptReason; trigger: LoginTrigger }
  | { type: "comment"; sid: string; editId: string }
  | null;

type Ctx = Persisted & {
  ready: boolean;
  sheet: Sheet;
  toast: string;
  hasRecords: boolean;
  openLogin: (trigger: LoginTrigger) => void;
  closeSheet: () => void;
  login: () => void;
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
  toggleX: (xid: string) => void;
  saveAllX: (aid: string) => void;
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
  const ref = useRef<Persisted>(EMPTY);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const next = { ...EMPTY, ...(JSON.parse(raw) as Partial<Persisted>) };
        ref.current = next;
        setState(next);
      }
    } catch {
      /* 저장소를 못 읽어도 빈 상태로 동작 */
    }
    setReady(true);
  }, []);

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

  /** 게스트에게 가치가 쌓인 시점에 한 번만 "기록 백업"을 제안한다. (PRD F-72) */
  const maybePrompt = useCallback(
    (next: Persisted, key: Exclude<PromptReason, "manual">): Persisted => {
      if (next.loggedIn || next.prompted[key]) return next;
      track("Backup Prompt Shown", { trigger: PROMPT_TRIGGER[key] });
      setSheet({ type: "login", reason: key, trigger: "backup_prompt" });
      return { ...next, prompted: { ...next.prompted, [key]: true } };
    },
    [],
  );

  const value = useMemo<Ctx>(() => {
    return {
      ...state,
      ready,
      sheet,
      toast,
      hasRecords:
        state.notes.length > 0 ||
        Object.keys(state.hl).length > 0 ||
        Object.keys(state.savedX).length > 0 ||
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
      login: () => {
        const trigger = sheet?.type === "login" ? sheet.trigger : "unknown";
        // 자동 제안 시트는 시트 안의 "Google로 계속하기"가 로그인 버튼이다. (직접 연 시트는 진입 버튼에서 이미 보냄)
        if (trigger === "backup_prompt") track("Login Button Clicked", { trigger });
        setGuestState(false); // Login Completed부터 is_guest=false
        // TODO(Supabase): 익명 사용자에 구글 계정을 연결(linkIdentity)할 때 기존 구글 계정에 게스트 데이터를 병합했다면 merged: true 로 보낸다.
        //   이 자리에서 identifyUser(user.id)도 호출한다. 지금은 목업이라 병합 여부를 알 수 없어 false.
        track("Login Completed", { trigger, merged: false });
        commit({ ...ref.current, loggedIn: true });
        setSheet(null);
        showToast("구글 계정에 기록을 연결했어요 (프로토타입: 실제 인증 없음)");
      },
      logout: () => {
        track("Logout");
        // TODO(Supabase): signOut 이후 resetUser()를 호출한다. (Logout 이벤트를 먼저 보낸 뒤)
        commit({ ...ref.current, loggedIn: false });
        showToast("로그아웃했어요");
      },
      deleteAccount: () => {
        track("Account Deleted");
        // TODO(Supabase): 서버에서 계정과 기록을 삭제한 뒤 signOut + resetUser()를 호출한다.
        commit({ ...EMPTY });
        showToast("계정을 삭제했어요");
      },
      toggleKo: (aid) => {
        track("Translation Toggled", { ...(aid ? { article_id: aid } : {}), on: !ref.current.showKo });
        commit({ ...ref.current, showKo: !ref.current.showKo });
      },
      toggleHl: (sid) => {
        const hl = { ...ref.current.hl };
        const on = !hl[sid];
        track("Highlight Toggled", { article_id: lib.sent[sid].aid, on });
        if (on) hl[sid] = true;
        else delete hl[sid];
        commit({ ...ref.current, hl });
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
        commit({
          ...ref.current,
          notes: ref.current.notes.map((n) => (n.id === id ? { ...n, text: t } : n)),
        });
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
      },
      addThought: (aid, text) => {
        const t = text.trim();
        if (!t) return;
        const cur = ref.current;
        track("Thought Added", { article_id: aid });
        commit({ ...cur, notes: [...cur.notes, { id: newId(), aid, sid: "", text: t, at: Date.now() }] });
        showToast("생각을 남겼어요. 아카이브에서 다시 볼 수 있어요");
      },
      removeNote: (id) => {
        const target = ref.current.notes.find((n) => n.id === id);
        track("Note Deleted", {
          ...(target ? { article_id: target.aid, note_type: target.sid ? "comment" : "thought" } : {}),
        });
        commit({ ...ref.current, notes: ref.current.notes.filter((n) => n.id !== id) });
        showToast("삭제했어요");
      },
      toggleX: (xid) => {
        const savedX = { ...ref.current.savedX };
        const on = !savedX[xid];
        track("Expression Saved Toggled", { article_id: lib.expr[xid]?.aid, expression_id: xid, on });
        if (on) savedX[xid] = true;
        else delete savedX[xid];
        let next: Persisted = { ...ref.current, savedX };
        if (on) showToast("표현을 저장했어요. 표현 탭에서 복습할 수 있어요");
        if (on && Object.keys(savedX).length >= 3) next = maybePrompt(next, "expr3");
        commit(next);
      },
      saveAllX: (aid) => {
        const savedX = { ...ref.current.savedX };
        for (const x of lib.byId[aid].xs) savedX[x.id] = true;
        let next: Persisted = { ...ref.current, savedX };
        showToast("이 글의 표현을 모두 저장했어요");
        if (Object.keys(savedX).length >= 3) next = maybePrompt(next, "expr3");
        commit(next);
      },
      toggleA: (aid) => {
        const savedA = { ...ref.current.savedA };
        const on = !savedA[aid];
        track("Article Saved Toggled", { article_id: aid, on });
        if (on) savedA[aid] = true;
        else delete savedA[aid];
        commit({ ...ref.current, savedA });
        if (on) showToast("글을 저장했어요. 아카이브에서 볼 수 있어요");
      },
    };
  }, [state, ready, sheet, toast, commit, showToast, maybePrompt]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
