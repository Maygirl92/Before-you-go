import fs from "node:fs/promises";

const destination = process.argv[2] || "de";
if (!/^[a-z]{2,3}$/.test(destination)) throw new Error("Destination must be a short lowercase slug.");
const dataUrl = new URL(`../data/countries/${destination}/works.json`, import.meta.url);
const works = JSON.parse(await fs.readFile(dataUrl, "utf8"));
const report = JSON.parse(await fs.readFile(new URL(`../data/countries/${destination}/cover-match-report.json`, import.meta.url), "utf8"));
let overrides = {};
try {
  overrides = JSON.parse(await fs.readFile(new URL(`../data/countries/${destination}/cover-overrides.json`, import.meta.url), "utf8"));
} catch {}
const matches = { ...report, ...overrides };

let applied = 0;
for (const work of works) {
  const match = matches[work.id];
  if (match?.status !== "matched" || !match.cover) continue;
  work.cover = match.cover;
  work.cover_source = match.source;
  work.cover_source_url = match.source_url;
  applied += 1;
}

await fs.writeFile(dataUrl, `${JSON.stringify(works, null, 2)}\n`);
console.log(`Applied ${applied} verified covers.`);
