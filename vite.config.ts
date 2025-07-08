import { defineConfig } from "vite";
import monkey from "vite-plugin-monkey";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: "src/main.ts",
      userscript: {
        icon: "https://www.touchgal.us/favicon.ico",
        namespace: "https://github.com/dccif",
        name: "TouchGal VNDB链接转换器",
        description: "自动将TouchGal网站上的VNDB ID转换为可点击的链接",
        version: "1.0.1",
        author: "dccif",
        license: "MIT",
        match: ["https://www.touchgal.io/*", "https://www.touchgal.us/*"],
        grant: "none",
        "run-at": "document-idle",
      },
    }),
  ],
});
