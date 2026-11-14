import { Suspense } from "react";
import { Feed } from "@/components/Feed";

export default function ExplorePage() {
  return (
    <Suspense>
      <Feed />
    </Suspense>
  );
}
