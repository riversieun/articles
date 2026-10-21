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
import { track } from "./analytics";
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
export type Sheet =
  | { type: "login"; reason: PromptReason }
  | { type: "comment"; sid: string; editId: string }
  | null;

type Ctx = Persisted & {
  ready: boolean;
  sheet: Sheet;
  toast: string;
  hasRecords: boolean;
  openLogin: () => void;
  closeSheet: () => void;
  login: () => void;
  logout: () => void;
  toggleKo: () => void;
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
  loadSample: () => void;
  resetAll: () => void;
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
    (next: Persisted, key: PromptReason): Persisted => {
      if (next.loggedIn || next.prompted[key]) return next;
      setSheet({ type: "login", reason: key });
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
      openLogin: () => {
        track("Login Button Clicked");
        setSheet({ type: "login", reason: "manual" });
      },
      closeSheet: () => setSheet(null),
      login: () => {
        track("Login Completed");
        commit({ ...ref.current, loggedIn: true });
        setSheet(null);
        showToast("구글 계정에 기록을 연결했어요 (프로토타입: 실제 인증 없음)");
      },
      logout: () => {
        commit({ ...ref.current, loggedIn: false });
        showToast("로그아웃했어요");
      },
      toggleKo: () => {
        track("Translation Toggled", { on: !ref.current.showKo });
        commit({ ...ref.current, showKo: !ref.current.showKo });
      },
      toggleHl: (sid) => {
        const hl = { ...ref.current.hl };
        const on = !hl[sid];
        track("Highlight Toggled", { article_id: lib.sent[sid].aid, on });
        if (on) hl[sid] = true;
        else delete hl[sid];
        commit({ ...ref.current, hl });
        showToast(on ? "문장을 하이라이트했어요" : "하이라이트를 해제했어요");
      },
      openComment: (sid) => setSheet({ type: "comment", sid, editId: "" }),
      editNote: (id) => {
        const n = ref.current.notes.find((it) => it.id === id);
        if (n) setSheet({ type: "comment", sid: n.sid, editId: id });
      },
      updateNote: (id, text) => {
        const t = text.trim();
        if (!t) return;
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
        track("Note Deleted");
        commit({ ...ref.current, notes: ref.current.notes.filter((n) => n.id !== id) });
        showToast("삭제했어요");
      },
      toggleX: (xid) => {
        const savedX = { ...ref.current.savedX };
        const on = !savedX[xid];
        track("Expression Saved Toggled", { expression_id: xid, on });
        if (on) savedX[xid] = true;
        else delete savedX[xid];
        let next: Persisted = { ...ref.current, savedX };
        showToast(on ? "표현을 저장했어요. 표현 탭에서 복습할 수 있어요" : "표현 저장을 해제했어요");
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
        showToast(on ? "글을 저장했어요. 아카이브에서 볼 수 있어요" : "글 저장을 해제했어요");
      },
      loadSample: () => {
        const now = Date.now();
        commit({
          ...ref.current,
          hl: { "a1-s2": true },
          notes: [
            {
              id: "seed1",
              aid: "a1",
              sid: "a1-s2",
              text: "온보딩 플로우를 새로 만들기 전에, 지금 있는 빈 화면부터 다시 살펴보자.",
              at: now - 2000,
            },
            {
              id: "seed2",
              aid: "a2",
              sid: "",
              text: "우리 서비스에서 새로움을 써도 되는 단 한 곳은 어디일까? 다음 리뷰 때 팀에 물어보기.",
              at: now - 1000,
            },
          ],
          savedX: { "a1-x3": true, "a1-x4": true, "a2-x1": true },
          savedA: { a3: true },
        });
        showToast("샘플 기록을 채웠어요");
      },
      resetAll: () => {
        commit({ ...EMPTY });
        showToast("기록을 모두 지웠어요");
      },
    };
  }, [state, ready, sheet, toast, commit, showToast, maybePrompt]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
