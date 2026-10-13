/*
 * robots.txt, generated at build time.
 * Concept mode blocks every crawler so the pitch build never shows up
 * in search or competes with the shop's real site.
 */
import type { APIRoute } from "astro";
import { CONCEPT_MODE } from "../content/site";

export const GET: APIRoute = ({ site }) => {
    const sitemapUrl = new URL("/sitemap-index.xml", site).href;
    const body = CONCEPT_MODE
        ? ["# Concept preview: not for indexing.", "User-agent: *",
            "Disallow: /"].join("\n")
        : ["User-agent: *", "Allow: /", "", `Sitemap: ${sitemapUrl}`]
              .join("\n");

    return new Response(`${body}\n`, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
};
