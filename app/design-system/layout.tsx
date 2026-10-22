import { notFound } from "next/navigation";

// 컴포넌트 확인용 페이지라 개발 중(npm run dev)에만 열고, 배포 빌드에서는 404로 응답한다.
export default function DesignSystemLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production") notFound();
  return children;
}
