/*
 * Post-build checks on the generated HTML in /dist.
 * Runs as part of `npm run build`, so a broken page fails the build
 * instead of shipping.
 *
 * Checks every page for: one h1, a unique title and meta description,
 * a canonical link, valid JSON-LD, an alt attribute on every image,
 * internal links that resolve, and booking links that point at Blismo.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const BLISMO = "https://blismo.com/s/black-and-gold-eastbay/appointments";

function htmlFiles(dir) {
    return readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (statSync(path).isDirectory()) {
            return htmlFiles(path);
        }
        return name.endsWith(".html") ? [path] : [];
    });
}

const errors = [];
const titles = new Map();
const descriptions = new Map();
const fail = (page, message) => errors.push(`${page}: ${message}`);

/** Does an internal href map to a built file? */
function resolves(href) {
    const path = href.split(/[?#]/)[0];
    if (path === "" || path === "/") {
        return existsSync(join(dist, "index.html"));
    }
    const target = join(dist, path);
    return (
        existsSync(join(target, "index.html")) ||
        (existsSync(target) && statSync(target).isFile())
    );
}

const pages = htmlFiles(dist);
if (pages.length === 0) {
    fail("dist", "no HTML pages found; did the build run?");
}

for (const file of pages) {
    const page = "/" + relative(dist, file);
    const html = readFileSync(file, "utf8");

    const h1Count = (html.match(/<h1[\s>]/g) ?? []).length;
    if (h1Count !== 1) {
        fail(page, `expected exactly 1 <h1>, found ${h1Count}`);
    }

    const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
    if (!title) {
        fail(page, "missing <title>");
    } else {
        titles.set(title, [...(titles.get(title) ?? []), page]);
    }

    const description = html.match(
        /<meta name="description" content="([^"]*)"/,
    )?.[1];
    if (!description) {
        fail(page, "missing or empty meta description");
    } else {
        descriptions.set(description, [
            ...(descriptions.get(description) ?? []),
            page,
        ]);
    }

    if (!/<link rel="canonical" href="[^"]+"/.test(html)) {
        fail(page, "missing canonical link");
    }

    for (const [, json] of html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    )) {
        try {
            JSON.parse(json);
        } catch {
            fail(page, "invalid JSON-LD");
        }
    }

    // Every image needs an alt attribute. An empty one (alt="") marks a
    // decorative image, like the logo beside the shop's name.
    for (const [tag] of html.matchAll(/<img\b[^>]*>/g)) {
        if (!/\salt(=|\s|>)/.test(tag)) {
            fail(page, `image without alt attribute: ${tag.slice(0, 80)}`);
        }
    }

    for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
        if (href.startsWith("/") && !resolves(href)) {
            fail(page, `broken internal link: ${href}`);
        }
        if (href.includes("blismo.com") && !href.startsWith(BLISMO)) {
            fail(page, `unexpected booking link: ${href}`);
        }
        if (href.includes("employeeId=") && !/employeeId=\d+$/.test(href)) {
            fail(page, `malformed barber booking link: ${href}`);
        }
    }

    if (!html.includes(`href="${BLISMO}"`)) {
        fail(page, "no Book now link to Blismo");
    }
}

for (const [title, where] of titles) {
    if (where.length > 1) {
        fail(where.join(", "), `duplicate title "${title}"`);
    }
}
for (const [, where] of descriptions) {
    if (where.length > 1) {
        fail(where.join(", "), "duplicate meta description");
    }
}

for (const required of ["robots.txt", "sitemap-index.xml", "og-image.png"]) {
    if (!existsSync(join(dist, required))) {
        fail(required, "missing from build output");
    }
}

if (errors.length > 0) {
    console.error(`Site check failed (${errors.length}):`);
    for (const error of errors) {
        console.error(`  - ${error}`);
    }
    process.exit(1);
}
console.log(`Site check passed: ${pages.length} pages.`);
