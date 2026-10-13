// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

/*
 * The site's public URL, used for canonical links, the sitemap and
 * social share images. Netlify sets URL automatically at build time, so
 * the concept preview points at itself and never at the owner's real
 * domain. At handoff, Netlify's URL becomes the real domain.
 */
const site = process.env.URL ?? "http://localhost:4321";

// Short names for the two font files preloaded in BaseLayout.astro.
/** @param {string} pkg @param {string} file */
const fontFile = (pkg, file) =>
    fileURLToPath(
        new URL(
            `./node_modules/@fontsource-variable/${pkg}/files/${file}`,
            import.meta.url,
        ),
    );

export default defineConfig({
    site,
    trailingSlash: "always",
    integrations: [
        // Generates sitemap-index.xml for every page at build time.
        sitemap({ filter: (page) => !page.includes("/404") }),
    ],
    vite: {
        // Tailwind v4 runs as a Vite plugin; tokens live in global.css.
        plugins: [tailwindcss()],
        resolve: {
            // Regex aliases so the "?url" suffix is kept on the import.
            alias: [
                {
                    find: /^@font\/display(\?.*)?$/,
                    replacement:
                        fontFile(
                            "big-shoulders-display",
                            "big-shoulders-display-latin-wght-normal.woff2",
                        ) + "$1",
                },
                {
                    find: /^@font\/sans(\?.*)?$/,
                    replacement:
                        fontFile(
                            "instrument-sans",
                            "instrument-sans-latin-wght-normal.woff2",
                        ) + "$1",
                },
            ],
        },
    },
});
