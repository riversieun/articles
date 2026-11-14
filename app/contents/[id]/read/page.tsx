import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lib } from "@/lib/content";
import { Reader } from "@/components/Reader";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return lib.arts.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const art = lib.byId[id];
  return art ? { title: `${art.titleKo} · crumbit`, description: art.summary } : {};
}

/** 문장 단위 영어·한국어 병기 리더. 리디자인 v2에서 상세 화면이 요약형으로 바뀌어 이곳으로 옮겨 두었다. */
export default async function ReadPage({ params }: Props) {
  const { id } = await params;
  if (!lib.byId[id]) notFound();
  return <Reader aid={id} />;
}
