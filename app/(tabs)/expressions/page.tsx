import { redirect } from "next/navigation";

/** 저장한 표현은 아카이브 탭으로 합쳐졌다. 옛 주소로 들어오면 아카이브로 보낸다. */
export default function ExpressionsPage() {
  redirect("/archive");
}
