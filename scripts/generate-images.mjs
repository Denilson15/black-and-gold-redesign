/*
 * Generates the social share image and favicon set into /public.
 *
 *   npm run images
 *
 * Renders small HTML templates in headless Chromium (via
 * playwright-core) so the images use the site's real fonts and colors.
 * Run it again after changing the business name or brand colors.
 * Set CHROME_PATH if Chromium isn't found automatically.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright-core";

const root = new URL("../", import.meta.url);
const pub = (name) => new URL(`public/${name}`, root);

const fileData = (path) =>
    readFileSync(new URL(path, root)).toString("base64");
const sansFont = fileData(
    "node_modules/@fontsource-variable/jost/files/" +
        "jost-latin-wght-normal.woff2",
);
// The shop's own logo files (from its current website).
const badge = fileData("src/assets/shop/logo-badge.png");
const mark = fileData("src/assets/shop/logo-mark.webp");

const GOLD = "#fcb125";
const INK = "#000000";
const MUTED = "#b3b3b3";

const baseCss = `
    @font-face {
        font-family: Jost;
        src: url(data:font/woff2;base64,${sansFont}) format("woff2");
        font-weight: 100 900;
    }
    * { margin: 0; box-sizing: border-box; }
    body { background: ${INK}; font-family: Jost; }
`;

const ogHtml = `<!doctype html><html><head><style>${baseCss}
    body {
        width: 1200px; height: 630px; padding: 0 90px;
        display: flex; align-items: center; gap: 72px;
        border-bottom: 14px solid ${GOLD};
    }
    img { width: 300px; height: auto; }
    h1 {
        font-weight: 400; font-size: 76px; line-height: 1.05;
        letter-spacing: 0.12em; text-transform: uppercase; color: #fff;
    }
    p {
        margin-top: 28px; font-size: 30px; color: ${MUTED};
        letter-spacing: 0.04em;
    }
</style></head><body>
    <img src="data:image/png;base64,${badge}" alt="">
    <div>
        <h1>Precision cuts in Hayward</h1>
        <p>846 B St, Hayward, CA · Book online</p>
    </div>
</body></html>`;

const iconHtml = (size) => `<!doctype html><html><head><style>${baseCss}
    body {
        width: ${size}px; height: ${size}px; display: flex;
        align-items: center; justify-content: center;
    }
    img { width: ${Math.round(size * 0.9)}px; }
</style></head><body>
    <img src="data:image/webp;base64,${mark}" alt="">
</body></html>`;

/* Packs PNG images into a .ico container (PNG-in-ICO, Vista+). */
function buildIco(pngs) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(pngs.length, 4);
    let offset = 6 + 16 * pngs.length;
    const entries = pngs.map(({ size, data }) => {
        const entry = Buffer.alloc(16);
        entry.writeUInt8(size >= 256 ? 0 : size, 0);
        entry.writeUInt8(size >= 256 ? 0 : size, 1);
        entry.writeUInt16LE(1, 4);
        entry.writeUInt16LE(32, 6);
        entry.writeUInt32LE(data.length, 8);
        entry.writeUInt32LE(offset, 12);
        offset += data.length;
        return entry;
    });
    return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

const browser = await chromium.launch(
    process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {},
);
const page = await browser.newPage();

async function render(html, width, height) {
    await page.setViewportSize({ width, height });
    await page.setContent(html);
    await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((i) => i.decode()));
    });
    return page.screenshot({ type: "png" });
}

writeFileSync(pub("og-image.png"), await render(ogHtml, 1200, 630));

const icons = {};
for (const size of [16, 32, 48, 180, 192, 512]) {
    icons[size] = await render(iconHtml(size), size, size);
}
writeFileSync(pub("apple-touch-icon.png"), icons[180]);
writeFileSync(pub("icon-192.png"), icons[192]);
writeFileSync(pub("icon-512.png"), icons[512]);
writeFileSync(
    pub("favicon.ico"),
    buildIco([16, 32, 48].map((size) => ({ size, data: icons[size] }))),
);

await browser.close();
console.log("Wrote og-image.png, favicon.ico and app icons to /public.");
