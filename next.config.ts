import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 서버를 같은 와이파이의 폰·다른 브라우저에서 열 때(http://<내 IP>:3001) 필요하다. 개발 서버에서만 쓰이고 배포에는 영향이 없다.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
};

export default nextConfig;
