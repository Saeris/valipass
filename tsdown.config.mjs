import { defineConfig } from "tsdown";

export default defineConfig({
  entry: [`./src/index.ts`],
  clean: true,
  format: [`esm`],
  dts: true,
  outDir: `./dist`
});
