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

const fontData = (path) =>
    readFileSync(new URL(`node_modules/${path}`, root)).toString("base64");
const displayFont = fontData(
    "@fontsource-variable/big-shoulders-display/files/" +
        "big-shoulders-display-latin-wght-normal.woff2",
);
const sansFont = fontData(
    "@fontsource-variable/instrument-sans/files/" +
        "instrument-sans-latin-wght-normal.woff2",
);

const GOLD = "#ffc500";
const SHADE = "#7a5d00";
const INK = "#000000";
const MUTED = "#a6a6a6";

const baseCss = `
    @font-face {
        font-family: Display;
        src: url(data:font/woff2;base64,${displayFont}) format("woff2");
        font-weight: 100 900;
    }
    @font-face {
        font-family: Sans;
        src: url(data:font/woff2;base64,${sansFont}) format("woff2");
        font-weight: 400 700;
    }
    * { margin: 0; box-sizing: border-box; }
    body { background: ${INK}; }
    .gilded {
        color: ${GOLD};
        text-shadow:
            0.006em 0.006em 0 ${SHADE},
            0.012em 0.012em 0 ${SHADE},
            0.018em 0.018em 0 ${SHADE},
            0.024em 0.024em 0 ${SHADE},
            0.03em 0.03em 0 ${SHADE},
            0.036em 0.036em 0 ${SHADE},
            0.042em 0.042em 0 ${SHADE},
            0.048em 0.048em 0 ${SHADE};
    }
`;

const ogHtml = `<!doctype html><html><head><style>${baseCss}
    body {
        width: 1200px; height: 630px; padding: 72px 80px;
        display: flex; flex-direction: column; justify-content: space-between;
        border-bottom: 12px solid ${GOLD};
    }
    .name {
        font: 800 34px/1 Display; letter-spacing: 0.06em;
        text-transform: uppercase; color: ${GOLD};
    }
    h1 { font: 900 150px/0.9 Display; }
    .meta { font: 500 32px/1.3 Sans; color: ${MUTED}; }
    .meta strong { color: #ededed; font-weight: 600; }
</style></head><body>
    <div class="name">Black &amp; Gold East Bay</div>
    <h1 class="gilded">Precision cuts<br>in Hayward</h1>
    <p class="meta"><strong>846 B St, Hayward, CA</strong>
        &nbsp;&nbsp;Book online with your barber</p>
</body></html>`;

const iconHtml = (size) => `<!doctype html><html><head><style>${baseCss}
    body {
        width: ${size}px; height: ${size}px; display: flex;
        align-items: center; justify-content: center;
    }
    span { font: 900 ${Math.round(size * 0.5)}px/1 Display; }
</style></head><body><span class="gilded">B&amp;G</span></body></html>`;

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
    await page.evaluate(() => document.fonts.ready);
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
