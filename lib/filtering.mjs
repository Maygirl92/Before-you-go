export const FACET_KEYS = ["medium", "theme_main", "lens", "region", "time_cost"];

export function matchesFacet(work, key, selections) {
  if (!selections?.length) return true;
  const values = key === "region" ? work.regions : key === "theme_main" ? work.theme_main : [work[key]];
  return selections.some((selection) => values.includes(selection));
}

export function filterWorks(works, active) {
  return works.filter((work) => FACET_KEYS.every((key) => matchesFacet(work, key, active[key])));
}

export function optionCount(works, active, key, option) {
  const withoutOwnFacet = { ...active, [key]: [] };
  return filterWorks(works, withoutOwnFacet).filter((work) => matchesFacet(work, key, [option])).length;
}

export function parseFilters(searchParams) {
  const aliases = { theme_main: "theme", time_cost: "time" };
  return Object.fromEntries(FACET_KEYS.map((key) => {
    const raw = searchParams.get(aliases[key] || key) || "";
    return [key, raw.split(",").filter(Boolean)];
  }));
}

export function serialiseFilters(active) {
  const aliases = { theme_main: "theme", time_cost: "time" };
  const params = new URLSearchParams();
  FACET_KEYS.forEach((key) => active[key]?.length && params.set(aliases[key] || key, active[key].join(",")));
  return params.toString();
}

export function sortWorks(works, mode) {
  const timeRank = { "one-evening": 0, "several-evenings": 1, "long-haul": 2 };
  return [...works].sort((a, b) => {
    if (mode === "time") {
      const aRank = a.medium === "music" ? 3 : (timeRank[a.time_cost] ?? 3);
      const bRank = b.medium === "music" ? 3 : (timeRank[b.time_cost] ?? 3);
      return aRank - bRank || a.sort_order - b.sort_order;
    }
    if (mode === "year") return b.year - a.year || a.sort_order - b.sort_order;
    if (mode === "recent") {
      return String(b.published_at || "").localeCompare(String(a.published_at || "")) || a.sort_order - b.sort_order;
    }
    return a.sort_order - b.sort_order;
  });
}
