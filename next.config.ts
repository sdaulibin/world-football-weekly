import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 纯静态导出：next build 产物输出到 out/ 目录，可部署到任意静态托管
  output: "export",
  trailingSlash: true,
  // 静态导出无图片优化服务：本站以文字排版为主，图片原样输出
  images: { unoptimized: true },
};

export default nextConfig;
