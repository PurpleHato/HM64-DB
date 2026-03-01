import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
export default defineConfig(() => ({
    plugins: [react()],
    base: "/HM64-DB/",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 3000,
        clearScreen: false,
    },
    build: {
        outDir: 'build',
        emptyOutDir: true,
    },
    envPrefix: ["VITE_"],
}));
