import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    logLevel: "silent",
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: "terser",
    sourcemap: true,
    rollupOptions: {
      preserveEntrySignatures: "strict",
      input: "src/App.tsx",
      output: {
        entryFileNames: "lib.min.js",
        format: "amd",
        dir: "dist-amd",
        manualChunks: undefined,
        exports: "named",
      },
      treeshake: {
        moduleSideEffects: "no-external", // Preserves side effects and exports
      },
    },

    terserOptions: {
      mangle: false,
      compress: {
        keep_fnames: true, // Ensures function names are kept even in compressed output
      },
    },
  },
});
