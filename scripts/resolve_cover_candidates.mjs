import fs from "node:fs/promises";

const works = JSON.parse(await fs.readFile(new URL("../data/works.json", import.meta.url), "utf8"));
const userAgent = "BeforeYouGo/1.0 (local curation tool)";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const clean = (value = "") => value
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^\p{L}\p{N}]+/gu, " ")
  .trim();

async function getJson(url) {
  const response = await fetch(url, { headers: { "User-Agent": userAgent, Accept: "application/json" } });
  if (!response.ok) return null;
  return response.json();
}

async function resolveBook(work) {
  const url = new URL("https://openlibrary.org/search.json");
  url.searchParams.set("title", work.title_original);
  url.searchParams.set("fields", "key,title,author_name,first_publish_year,cover_i,edition_key,isbn");
  url.searchParams.set("limit", "12");
  const data = await getJson(url);
  const expected = clean(work.title_original);
  const candidates = (data?.docs || []).filter((item) => item.cover_i).map((item) => {
    const title = clean(item.title);
    const exact = title === expected;
    const contains = title.includes(expected) || expected.includes(title);
    const yearGap = Math.abs((item.first_publish_year || work.year) - work.year);
    const score = (exact ? 100 : contains ? 55 : 0) + Math.max(0, 20 - yearGap);
    return { ...item, score };
  }).sort((a, b) => b.score - a.score);
  const match = candidates[0];
  if (!match || match.score < 60) return { status: "unmatched", source: "Open Library", candidates: candidates.slice(0, 3) };
  return {
    status: match.score >= 100 ? "matched" : "review",
    source: "Open Library",
    cover: `https://covers.openlibrary.org/b/id/${match.cover_i}-L.jpg`,
    source_url: `https://openlibrary.org${match.key}`,
    matched_title: match.title,
    matched_year: match.first_publish_year,
    score: match.score
  };
}

function musicReleaseTitle(work) {
  const original = clean(work.title_original);
  const creator = clean(work.creator.split(/[/(]/)[0]);
  return original === creator || creator.startsWith(original) || original.startsWith(creator)
    ? work.title_zh
    : work.title_original.replace(/（[^）]+）|\([^)]*\)/g, "").trim();
}

async function resolveMusic(work) {
  const releaseTitle = musicReleaseTitle(work);
  const artist = work.creator.split(/\s*\/\s*|\s*\(/)[0];
  const query = `releasegroup:\"${releaseTitle}\" AND artist:\"${artist}\"`;
  const url = new URL("https://musicbrainz.org/ws/2/release-group/");
  url.searchParams.set("query", query);
  url.searchParams.set("fmt", "json");
  url.searchParams.set("limit", "8");
  const data = await getJson(url);
  const expected = clean(releaseTitle);
  const candidates = (data?.["release-groups"] || []).map((item) => ({
    id: item.id,
    title: item.title,
    first_release_date: item["first-release-date"],
    score: Number(item.score || 0),
    exact: clean(item.title) === expected
  })).sort((a, b) => Number(b.exact) - Number(a.exact) || b.score - a.score);

  for (const candidate of candidates.slice(0, 4)) {
    if (!candidate.exact && candidate.score < 90) continue;
    await wait(350);
    const art = await getJson(`https://coverartarchive.org/release-group/${candidate.id}`);
    const image = art?.images?.find((item) => item.front && item.approved) || art?.images?.find((item) => item.front) || art?.images?.[0];
    const cover = image?.thumbnails?.["500"] || image?.thumbnails?.["1200"] || image?.image;
    if (cover) return {
      status: candidate.exact ? "matched" : "review",
      source: "Cover Art Archive",
      cover: cover.replace(/^http:/, "https:"),
      source_url: `https://musicbrainz.org/release-group/${candidate.id}`,
      matched_title: candidate.title,
      matched_year: candidate.first_release_date,
      score: candidate.score
    };
  }
  return { status: "unmatched", source: "Cover Art Archive", release_title: releaseTitle, candidates: candidates.slice(0, 3) };
}

const reportUrl = new URL("../data/cover-match-report.json", import.meta.url);
let report = {};
try {
  report = JSON.parse(await fs.readFile(reportUrl, "utf8"));
} catch {}

for (const work of works) {
  if (report[work.id]) continue;
  try {
    if (work.medium === "book") {
      report[work.id] = await resolveBook(work);
      await wait(180);
    } else if (work.medium === "music") {
      report[work.id] = await resolveMusic(work);
      await wait(900);
    } else {
      report[work.id] = { status: "needs_tmdb_key", source: "TMDB", title: work.title_original, year: work.year };
    }
  } catch (error) {
    report[work.id] = { status: "network_error", source: work.medium === "book" ? "Open Library" : "Cover Art Archive", message: error.message };
  }
  process.stdout.write(`${work.id}: ${report[work.id].status}\n`);
  await fs.writeFile(reportUrl, `${JSON.stringify(report, null, 2)}\n`);
}

await fs.writeFile(reportUrl, `${JSON.stringify(report, null, 2)}\n`);
