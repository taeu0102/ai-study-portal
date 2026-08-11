import fs from "node:fs/promises";
import path from "node:path";

const endpoint = "https://commons.wikimedia.org/w/api.php";
const outputDir = path.resolve("portfolio-city", "seoul-reference");
const limit = 100;

const searches = [
  "Seoul aerial view filetype:bitmap",
  "Seoul aerial photograph filetype:bitmap",
  "Aerial view Seoul Han River filetype:bitmap",
  "Seoul panorama filetype:bitmap",
  "Seoul cityscape filetype:bitmap",
  "Seoul skyline filetype:bitmap",
  "Han River Seoul panorama filetype:bitmap",
  "N Seoul Tower panorama Seoul filetype:bitmap",
  "Lotte World Tower view Seoul filetype:bitmap",
  "Seoul satellite map filetype:bitmap",
  "Yeouido Seoul aerial filetype:bitmap",
  "Jamsil Seoul skyline filetype:bitmap",
];

const categories = [
  "Category:Aerial photographs of Seoul",
  "Category:Cityscapes of Seoul",
  "Category:Panoramics of Seoul",
  "Category:Skylines in Seoul",
  "Category:Han River in Seoul",
  "Category:Views from N Seoul Tower",
  "Category:Views from Lotte World Tower",
  "Category:Yeouido",
  "Category:Jamsil-dong",
];

const relevanceTerms = [
  "seoul",
  "서울",
  "han river",
  "hangang",
  "한강",
  "namsan",
  "남산",
  "yeouido",
  "여의도",
  "gangnam",
  "강남",
  "jamsil",
  "잠실",
  "lotte world tower",
  "n seoul tower",
  "cityscape",
  "panorama",
  "skyline",
];

const allowedLicenseTerms = [
  "cc0",
  "cc by",
  "cc-by",
  "cc by-sa",
  "cc-by-sa",
  "public domain",
  "pd",
];

const excludedTerms = [
  "adex",
  "aerospace",
  "defense exhibition",
  "airpower",
  "air force",
  "aircraft",
  "airline",
  "airlines",
  "airport",
  "airbus",
  "boeing",
  "kf-21",
  "incheon",
  "liaoning",
  "kizimen",
  "dangjin",
  "thermal power plant",
  "camp casey",
  "newcomers",
  "kocis",
  "ministry of culture",
  "official flickr account",
  "available only for publication",
  "distortion to the original meaning",
  "hangang bus",
  "workers on april",
  "clean the outer walls",
  "wildfire",
  "wildfires",
  "southeastern korea",
  "uh-60",
  "bambi bucket",
  "water drop",
  "apache",
  "helicopter pilots",
  "aviation brigade",
  "u.s. army",
  "usfk",
  "korean peninsula",
  "northeastern china",
  "museums of seoul",
  "staircase",
  "cheonggyecheon",
  "cheong gye cheon",
  "google earth",
  "street | satellite",
  "nasa modis",
  "korea 2004-",
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function stripHtml(value = "") {
  return String(value)
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function csvCell(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function titleToName(title) {
  return title.replace(/^File:/, "").replace(/\.[a-z0-9]+$/i, "");
}

function titleToCommonsUrl(title) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(title).replace(/%20/g, "_")}`;
}

function getMeta(imageInfo, key) {
  return stripHtml(imageInfo?.extmetadata?.[key]?.value || "");
}

function isAllowedLicense(imageInfo) {
  const license = `${getMeta(imageInfo, "LicenseShortName")} ${getMeta(imageInfo, "UsageTerms")} ${getMeta(imageInfo, "LicenseUrl")}`.toLowerCase();
  return allowedLicenseTerms.some((term) => license.includes(term));
}

function isRelevant(page, imageInfo) {
  const text = `${page.title} ${getMeta(imageInfo, "ImageDescription")} ${getMeta(imageInfo, "ObjectName")}`.toLowerCase();
  if (excludedTerms.some((term) => text.includes(term))) return false;
  return relevanceTerms.some((term) => text.includes(term));
}

function scoreItem(page, imageInfo) {
  const text = `${page.title} ${getMeta(imageInfo, "ImageDescription")} ${getMeta(imageInfo, "ObjectName")}`.toLowerCase();
  let score = 0;
  if (/aerial|helicopter|satellite|from (the )?sky|view from above|seen from above|from above|항공/.test(text)) score += 75;
  if (/panorama|panoramic/.test(text)) score += 32;
  if (/cityscape|skyline|전경/.test(text)) score += 24;
  if (/han river|hangang|한강/.test(text)) score += 14;
  if (/n seoul tower|namsan|남산|lotte world tower|yeouido|jamsil|gangnam/.test(text)) score += 14;
  if (imageInfo.width >= 1800) score += 8;
  if (imageInfo.width / Math.max(imageInfo.height, 1) >= 1.55) score += 6;
  if (imageInfo.width < 700 || imageInfo.height < 400) score -= 20;
  return score;
}

function classifyItem(page, imageInfo) {
  const text = `${page.title} ${getMeta(imageInfo, "ImageDescription")} ${getMeta(imageInfo, "ObjectName")}`.toLowerCase();
  if (/satellite/.test(text)) return "위성/지도";
  if (/aerial|helicopter|from (the )?sky|view from above|seen from above|from above|항공/.test(text)) return "항공뷰";
  if (/panorama|panoramic/.test(text)) return "파노라마";
  if (/han river|hangang|한강/.test(text)) return "한강 축";
  if (/tower|namsan|남산|skyline|cityscape/.test(text)) return "고지대 전경";
  return "도시 전경";
}

async function api(params, attempt = 1) {
  const url = `${endpoint}?${new URLSearchParams({
    format: "json",
    origin: "*",
    ...params,
  })}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "CodexSeoulReferenceCollector/1.0 (portfolio-city reference board)",
    },
  });
  if (res.status === 429 || res.status >= 500) {
    if (attempt >= 5) throw new Error(`${res.status} ${url}`);
    const retryAfter = Number(res.headers.get("retry-after") || 0);
    await sleep(Math.max(retryAfter * 1000, 2000 * attempt));
    return api(params, attempt + 1);
  }
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  await sleep(850);
  return res.json();
}

async function queryPages(params) {
  const pages = [];
  let cont;
  do {
    const data = await api({ ...params, ...(cont || {}) });
    pages.push(...Object.values(data.query?.pages || {}));
    cont = data.continue;
  } while (cont && pages.length < 140);
  return pages;
}

async function searchPages(search) {
  return queryPages({
    action: "query",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: search,
    gsrlimit: "50",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "640",
  });
}

async function categoryPages(category) {
  return queryPages({
    action: "query",
    generator: "categorymembers",
    gcmtitle: category,
    gcmtype: "file",
    gcmnamespace: "6",
    gcmlimit: "50",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "640",
  });
}

function normalizePage(page, source) {
  const imageInfo = page.imageinfo?.[0];
  if (!imageInfo?.thumburl || !imageInfo?.url) return null;
  if (!String(imageInfo.mime || "").startsWith("image/")) return null;
  if (!isAllowedLicense(imageInfo)) return null;
  if (!isRelevant(page, imageInfo)) return null;

  const title = page.title;
  const description = getMeta(imageInfo, "ImageDescription");
  return {
    title,
    name: getMeta(imageInfo, "ObjectName") || titleToName(title),
    type: classifyItem(page, imageInfo),
    score: scoreItem(page, imageInfo),
    width: imageInfo.width,
    height: imageInfo.height,
    thumbUrl: imageInfo.thumburl,
    originalUrl: imageInfo.url,
    commonsUrl: titleToCommonsUrl(title),
    description,
    artist: getMeta(imageInfo, "Artist") || "Unknown",
    credit: getMeta(imageInfo, "Credit"),
    license: getMeta(imageInfo, "LicenseShortName") || getMeta(imageInfo, "UsageTerms"),
    licenseUrl: getMeta(imageInfo, "LicenseUrl"),
    date: getMeta(imageInfo, "DateTimeOriginal") || getMeta(imageInfo, "DateTime"),
    source,
  };
}

function buildHtml(items) {
  const cards = items
    .map((item, index) => `
      <article class="card">
        <a href="${item.commonsUrl}" target="_blank" rel="noopener">
          <img src="${item.thumbUrl}" alt="${escapeHtml(item.name)}" loading="lazy" />
        </a>
        <div class="meta">
          <div class="row">
            <strong>${String(index + 1).padStart(2, "0")}</strong>
            <span>${escapeHtml(item.type)}</span>
          </div>
          <h2>${escapeHtml(item.name)}</h2>
          <p>${escapeHtml(item.description || "서울 항공/전경 레퍼런스")}</p>
          <dl>
            <div><dt>크기</dt><dd>${item.width}x${item.height}</dd></div>
            <div><dt>라이선스</dt><dd>${escapeHtml(item.license)}</dd></div>
            <div><dt>작가</dt><dd>${escapeHtml(item.artist)}</dd></div>
          </dl>
          <div class="links">
            <a href="${item.commonsUrl}" target="_blank" rel="noopener">Commons</a>
            <a href="${item.originalUrl}" target="_blank" rel="noopener">Original</a>
          </div>
        </div>
      </article>`)
    .join("\n");

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Seoul Aerial Reference Board</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #1d241f;
        --muted: #667263;
        --line: #d6decc;
        --surface: #fbfaf2;
        --panel: #ffffff;
        --green: #2f6f55;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, "Segoe UI", "Noto Sans KR", Arial, sans-serif;
        color: var(--ink);
        background: #eef3e7;
      }
      header {
        position: sticky;
        top: 0;
        z-index: 5;
        display: grid;
        grid-template-columns: auto 1fr auto;
        gap: 18px;
        align-items: center;
        padding: 18px 28px;
        border-bottom: 1px solid var(--line);
        background: rgba(251, 250, 242, 0.94);
        backdrop-filter: blur(10px);
      }
      .back {
        display: inline-flex;
        align-items: center;
        min-height: 38px;
        padding: 0 14px;
        border: 1px solid var(--line);
        border-radius: 8px;
        color: var(--green);
        text-decoration: none;
        font-weight: 800;
      }
      .eyebrow {
        margin: 0 0 5px;
        color: #4d7762;
        font-size: 12px;
        font-weight: 900;
        letter-spacing: 0;
      }
      h1 {
        margin: 0;
        font-size: 30px;
        line-height: 1.1;
      }
      .summary {
        color: var(--muted);
        font-weight: 700;
      }
      main {
        width: min(1540px, calc(100vw - 48px));
        margin: 24px auto 48px;
      }
      .note {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 10px;
        margin-bottom: 18px;
      }
      .note div {
        min-height: 74px;
        padding: 14px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--surface);
      }
      .note strong {
        display: block;
        margin-bottom: 5px;
        color: var(--green);
        font-size: 13px;
      }
      .note span {
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
        line-height: 1.45;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        gap: 14px;
      }
      .card {
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        box-shadow: 0 12px 26px rgba(36, 50, 34, 0.08);
      }
      .card img {
        display: block;
        width: 100%;
        aspect-ratio: 16 / 10;
        object-fit: cover;
        background: #dce8d7;
      }
      .meta {
        padding: 12px;
      }
      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: var(--green);
        font-size: 12px;
        font-weight: 900;
      }
      .row span {
        padding: 3px 7px;
        border-radius: 999px;
        background: #e8f0df;
      }
      h2 {
        min-height: 42px;
        margin: 0 0 8px;
        font-size: 15px;
        line-height: 1.35;
      }
      p {
        display: -webkit-box;
        min-height: 38px;
        margin: 0 0 10px;
        overflow: hidden;
        color: var(--muted);
        font-size: 12px;
        font-weight: 700;
        line-height: 1.5;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      dl {
        display: grid;
        gap: 5px;
        margin: 0 0 10px;
        font-size: 11px;
      }
      dl div {
        display: grid;
        grid-template-columns: 54px 1fr;
        gap: 7px;
      }
      dt {
        color: var(--muted);
        font-weight: 800;
      }
      dd {
        min-width: 0;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 800;
      }
      .links {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
      }
      .links a {
        min-height: 32px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--line);
        border-radius: 7px;
        color: var(--green);
        text-decoration: none;
        font-size: 12px;
        font-weight: 900;
      }
      @media (max-width: 1180px) {
        .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .note { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 760px) {
        header { grid-template-columns: 1fr; padding: 16px; }
        main { width: min(100% - 24px, 720px); margin-top: 14px; }
        h1 { font-size: 24px; }
        .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .note { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <header>
      <a class="back" href="../">Portfolio City</a>
      <div>
        <p class="eyebrow">SEOUL AERIAL REFERENCE</p>
        <h1>서울 항공/전경 레퍼런스 100</h1>
      </div>
      <div class="summary">Wikimedia Commons 공개 라이선스 기준</div>
    </header>
    <main>
      <section class="note" aria-label="수집 기준">
        <div><strong>목적</strong><span>Portfolio City의 서울형 지도, 한강 축, 도심 밀도, 산지 배치를 다시 잡기 위한 시각 자료입니다.</span></div>
        <div><strong>범위</strong><span>항공뷰를 우선하고, 부족한 부분은 고지대 파노라마와 도시 전경으로 보완했습니다.</span></div>
        <div><strong>사용</strong><span>이미지는 참고용 보드입니다. 원본 사용 시 각 카드의 Commons 라이선스와 작가 표기를 확인하세요.</span></div>
        <div><strong>출처</strong><span>각 카드의 Commons/Original 링크에서 파일 페이지와 원본 이미지를 확인할 수 있습니다.</span></div>
      </section>
      <section class="grid" aria-label="서울 항공 및 전경 이미지 목록">
${cards}
      </section>
    </main>
  </body>
</html>
`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function main() {
  const byTitle = new Map();

  for (const category of categories) {
    try {
      const pages = await categoryPages(category);
      for (const page of pages) {
        const item = normalizePage(page, category);
        if (item && (!byTitle.has(item.title) || item.score > byTitle.get(item.title).score)) {
          byTitle.set(item.title, item);
        }
      }
      console.log(`${category}: ${pages.length} pages, ${byTitle.size} selected candidates`);
    } catch (error) {
      console.warn(`${category}: ${error.message}`);
    }
  }

  for (const search of searches) {
    try {
      const pages = await searchPages(search);
      for (const page of pages) {
        const item = normalizePage(page, `search: ${search}`);
        if (item && (!byTitle.has(item.title) || item.score > byTitle.get(item.title).score)) {
          byTitle.set(item.title, item);
        }
      }
      console.log(`${search}: ${pages.length} pages, ${byTitle.size} selected candidates`);
    } catch (error) {
      console.warn(`${search}: ${error.message}`);
    }
  }

  const selected = [...byTitle.values()]
    .sort((a, b) => b.score - a.score || b.width * b.height - a.width * a.height)
    .slice(0, limit)
    .map((item, index) => ({ id: index + 1, ...item }));

  if (selected.length < limit) {
    throw new Error(`Only ${selected.length} usable images found`);
  }

  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, "seoul-aerial-references.json"), `${JSON.stringify(selected, null, 2)}\n`, "utf8");

  const csvHeader = [
    "id",
    "type",
    "name",
    "title",
    "width",
    "height",
    "commonsUrl",
    "originalUrl",
    "thumbUrl",
    "license",
    "licenseUrl",
    "artist",
    "date",
    "source",
  ];
  const csvRows = [
    csvHeader.join(","),
    ...selected.map((item) => csvHeader.map((key) => csvCell(item[key])).join(",")),
  ];
  await fs.writeFile(path.join(outputDir, "seoul-aerial-references.csv"), `${csvRows.join("\n")}\n`, "utf8");
  await fs.writeFile(path.join(outputDir, "index.html"), buildHtml(selected), "utf8");

  const readme = `# Seoul Aerial Reference Board

Wikimedia Commons 공개 라이선스 메타데이터를 기준으로 서울 항공뷰, 고지대 전경, 파노라마, 스카이라인, 한강 축 레퍼런스 ${selected.length}장을 선별했습니다.

- Board: ./index.html
- Metadata JSON: ./seoul-aerial-references.json
- Metadata CSV: ./seoul-aerial-references.csv

이 보드는 Portfolio City의 서울형 지도와 아트 방향을 잡기 위한 시각 참고 자료입니다. 원본 이미지를 실제 산출물에 사용할 때는 각 카드의 Commons 페이지에서 라이선스, 작가 표기, 사용 조건을 다시 확인해야 합니다.
`;
  await fs.writeFile(path.join(outputDir, "README.md"), readme, "utf8");
  console.log(`Wrote ${selected.length} references to ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
