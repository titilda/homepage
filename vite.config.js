import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { parse } from "jsonc-parser";

function jsonc() {
  return {
    name: "jsonc",
    transform(code, id) {
      if (!id.endsWith(".jsonc")) return null;
      const data = parse(code, [], { allowTrailingComma: true });
      return { code: `export default ${JSON.stringify(data)}`, map: null };
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), jsonc()],
});
