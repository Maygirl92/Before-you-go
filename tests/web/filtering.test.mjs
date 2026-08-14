import test from "node:test";
import assert from "node:assert/strict";
import { filterWorks, optionCount, parseFilters, serialiseFilters, sortWorks } from "../../lib/filtering.mjs";

const works = [
  { id: "a", medium: "screen", theme_main: ["历史与记忆"], lens: "local", regions: ["柏林"], time_cost: "one-evening" },
  { id: "b", medium: "book", theme_main: ["社会与日常"], lens: "outsider", regions: ["柏林", "萨克森"], time_cost: "long-haul" },
  { id: "c", medium: "music", theme_main: ["历史与记忆"], lens: "local", regions: ["萨克森"], time_cost: null }
];
const active = { medium: [], theme_main: [], lens: [], region: [], time_cost: [] };

test("within facets OR and across facets AND", () => {
  const result = filterWorks(works, { ...active, medium: ["screen", "music"], region: ["萨克森"] });
  assert.deepEqual(result.map((work) => work.id), ["c"]);
});

test("facet count ignores its own current selections", () => {
  assert.equal(optionCount(works, { ...active, medium: ["screen"] }, "medium", "book"), 1);
});

test("URL state round trips", () => {
  const query = serialiseFilters({ ...active, region: ["柏林", "萨克森"], time_cost: ["one-evening"] });
  assert.deepEqual(parseFilters(new URLSearchParams(query)), { ...active, region: ["柏林", "萨克森"], time_cost: ["one-evening"] });
});

test("year sorting is newest first and time sorting leaves music last", () => {
  assert.deepEqual(sortWorks(works.map((work, index) => ({ ...work, year: 2000 + index, sort_order: index + 1 })), "year").map((work) => work.id), ["c", "b", "a"]);
  assert.deepEqual(sortWorks(works.map((work, index) => ({ ...work, sort_order: index + 1 })), "time").map((work) => work.id), ["a", "b", "c"]);
});
