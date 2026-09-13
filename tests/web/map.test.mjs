import assert from "node:assert/strict";
import test from "node:test";
import mapConfig from "../../data/map-config.json" with { type: "json" };
import europeMap from "../../data/europe-map.json" with { type: "json" };
import destinations from "../../data/destinations.json" with { type: "json" };
import deConfig from "../../data/countries/de/config.json" with { type: "json" };
import ukConfig from "../../data/countries/uk/config.json" with { type: "json" };

test("the Europe map contains every planned destination", () => {
  const mapIds = new Set(europeMap.countries.map((country) => country.map_id));
  assert.equal(europeMap.countries.length, 45);
  assert.deepEqual(destinations.filter((destination) => !mapIds.has(destination.map_id)), []);
});

test("population tiers are ordered and assigned to every map country", () => {
  const minimums = mapConfig.population.tiers.map((tier) => tier.min);
  assert.deepEqual(minimums, [...minimums].sort((a, b) => a - b));
  for (const country of europeMap.countries) {
    assert.ok(country.population > 0);
    assert.ok(country.population_tier >= 0 && country.population_tier < minimums.length);
    assert.match(country.d, /^M/);
  }
});

test("map labels progress from six large countries to every country", () => {
  assert.deepEqual(mapConfig.zoom.scales, [...mapConfig.zoom.scales].sort((a, b) => a - b));
  assert.deepEqual(
    mapConfig.zoom.label_min_population,
    [...mapConfig.zoom.label_min_population].sort((a, b) => b - a)
  );

  const visibleCounts = mapConfig.zoom.scales.map((_, level) => (
    europeMap.countries.filter((country) => country.label_zoom <= level).length
  ));
  assert.equal(visibleCounts[0], 6);
  assert.ok(visibleCounts.every((count, index) => index === 0 || count > visibleCounts[index - 1]));
  assert.equal(visibleCounts.at(-1), europeMap.countries.length);
  for (const country of europeMap.countries) {
    assert.ok(country.name_zh);
    assert.ok(country.label_zoom >= 0 && country.label_zoom < mapConfig.zoom.scales.length);
  }
});

test("Germany and the UK share a face colour and the common grey side", () => {
  assert.equal(deConfig.destination.signature.face, ukConfig.destination.signature.face);
  assert.equal(deConfig.destination.signature.face, mapConfig.population.tiers.at(-1).fill);
  assert.equal(deConfig.destination.signature.side, mapConfig.palette.side);
  assert.equal(ukConfig.destination.signature.side, mapConfig.palette.side);
});
