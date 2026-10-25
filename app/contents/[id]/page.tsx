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

export default async function ContentPage({ params }: Props) {
  const { id } = await params;
  if (!lib.byId[id]) notFound();
  return <Reader aid={id} />;
}
