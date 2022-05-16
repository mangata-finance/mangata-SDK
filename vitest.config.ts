import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["./test/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    testTimeout: 3600000,
    hookTimeout: 3600000,
    threads: false,
    reporters: ["verbose"]
  }
});
