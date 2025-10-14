import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()], 
    envDir: path.resolve(process.cwd()),

  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "client", "src"),
      "@shared": path.resolve(process.cwd(), "shared"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
  root: path.resolve(process.cwd(), "client"),
  build: {
    outDir: path.resolve(process.cwd(), "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.ts': 'tsx',
        '.tsx': 'tsx',
      },
    },
    // *** ADD THIS NEW 'exclude' PROPERTY ***
    exclude: [
      // Common culprits that might have untranspiled JSX/TSX:
      '@shadcn/ui', // If you're using shadcn/ui components
      'react-icons', // Sometimes causes issues
      // Add other specific library names here if they emerge as the culprit
    ],
  },

  esbuild: {
    loader: 'jsx',
    include: /.*\.(jsx|js|ts|tsx)$/,
  },
});