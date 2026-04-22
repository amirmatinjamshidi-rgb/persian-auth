import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: { resolve: true, compilerOptions: { incremental: false } },
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
  clean: true,
  target: "es2020",
  external: ["react", "react-dom", "zod"],
  banner: { js: '"use client";' },
  loader: { ".css": "copy" },
  outDir: "dist",
});
