import { defineConfig } from "vite";

export default defineConfig({
  base: "/", // 이거 꼭 넣어야 함!!!
  build: {
    outDir: "dist", // 기본값이지만 명시
    assetsDir: "assets",
  },
});
