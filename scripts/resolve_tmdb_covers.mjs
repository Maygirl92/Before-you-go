import fs from "node:fs/promises";

const token = process.env.TMDB_API_TOKEN;
if (!token) {
  console.error("TMDB_API_TOKEN is required. Add it to .env.local, then run npm run covers:tmdb.");
  process.exit(1);
}

const dataUrl = new URL("../data/works.json", import.meta.url);
const reportUrl = new URL("../data/cover-match-report.json", import.meta.url);
const works = JSON.parse(await fs.readFile(dataUrl, "utf8"));
const report = JSON.parse(await fs.readFile(reportUrl, "utf8"));

const clean = (value = "") => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();

async function search(work) {
  const type = work.medium_sub === "series" ? "tv" : "movie";
  const url = new URL(`https://api.themoviedb.org/3/search/${type}`);
  url.searchParams.set("query", work.title_original);
  url.searchParams.set("language", "de-DE");
  url.searchParams.set(type === "tv" ? "first_air_date_year" : "primary_release_year", String(work.year));
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } });
  if (!response.ok) throw new Error(`TMDB request failed (${response.status}) for ${work.id}`);
  const data = await response.json();
  const expected = clean(work.title_original);
  const candidates = (data.results || []).filter((item) => item.poster_path).map((item) => {
    const title = item.original_title || item.original_name || item.title || item.name || "";
    const translated = item.title || item.name || "";
    const date = item.release_date || item.first_air_date || "";
    const year = Number(date.slice(0, 4));
    const exact = clean(title) === expected || clean(translated) === expected;
    const contains = clean(title).includes(expected) || expected.includes(clean(title));
    const score = (exact ? 100 : contains ? 65 : 0) + (year === work.year ? 25 : 0);
    return { ...item, matched_title: title, matched_year: year, score };
  }).sort((a, b) => b.score - a.score);
  const match = candidates[0];
  if (!match || match.score < 90) return { status: "review", source: "TMDB", candidates: candidates.slice(0, 3) };
  return {
    status: "matched",
    source: "TMDB",
    cover: `https://image.tmdb.org/t/p/w500${match.poster_path}`,
    source_url: `https://www.themoviedb.org/${type}/${match.id}`,
    matched_title: match.matched_title,
    matched_year: match.matched_year,
    score: match.score
  };
}

let applied = 0;
for (const work of works.filter((item) => item.medium === "screen")) {
  const match = await search(work);
  report[work.id] = match;
  if (match.status === "matched") {
    work.cover = match.cover;
    work.cover_source = match.source;
    work.cover_source_url = match.source_url;
    applied += 1;
  }
  console.log(`${work.id}: ${match.status}`);
}

await fs.writeFile(reportUrl, `${JSON.stringify(report, null, 2)}\n`);
await fs.writeFile(dataUrl, `${JSON.stringify(works, null, 2)}\n`);
console.log(`Applied ${applied} TMDB posters.`);
