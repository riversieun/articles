import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** 키가 없으면 false. 이때 앱은 예전 프로토타입처럼 localStorage 만으로 동작한다. */
export const supabaseEnabled = !!(URL && KEY);

let client: SupabaseClient | undefined;

/** 브라우저에서 쓰는 Supabase 클라이언트(공개 anon 키). 접근 제한은 DB의 RLS 정책이 맡는다. */
export function supabase(): SupabaseClient {
  if (!URL || !KEY) throw new Error("Supabase 환경변수가 없습니다");
  client ??= createClient(URL, KEY, { auth: { flowType: "pkce" } });
  return client;
}
