import assert from "node:assert/strict";
import test from "node:test";
import mapConfig from "../../data/map-config.json" with { type: "json" };
import europeMap from "../../data/europe-map.json" with { type: "json" };
import destinations from "../../data/destinations.json" with { type: "json" };
import deConfig from "../../data/countries/de/config.json" with { type: "json" };
import ukConfig from "../../data/countries/uk/config.json" with { type: "json" };
import { clampMapPan, dragMapPan, mapPanLimits } from "../../lib/map-viewport.mjs";

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

test("maximum zoom separates every rendered country label", () => {
  const destinationsById = new Map(destinations.map((destination) => [destination.map_id, destination]));
  const scale = mapConfig.zoom.scales.at(-1);
  const boxes = europeMap.countries.map((country) => {
    const destination = destinationsById.get(country.map_id);
    const label = destination?.name_zh || country.name_zh;
    const [offsetX, offsetY] = destination?.label_offset || [0, 0];
    return {
      label,
      x: country.label[0] * scale + offsetX,
      y: country.label[1] * scale + offsetY,
      width: [...label].length * 11 + 7,
      height: 15
    };
  });

  for (let index = 0; index < boxes.length; index += 1) {
    for (let comparison = index + 1; comparison < boxes.length; comparison += 1) {
      const first = boxes[index];
      const second = boxes[comparison];
      const overlapsX = Math.abs(first.x - second.x) < (first.width + second.width) / 2;
      const overlapsY = Math.abs(first.y - second.y) < (first.height + second.height) / 2;
      assert.equal(overlapsX && overlapsY, false, `${first.label} overlaps ${second.label}`);
    }
  }
});

test("map panning works at every zoom and remains bounded", () => {
  assert.deepEqual(mapPanLimits(1100, 600, 1), { x: 36, y: 24 });
  assert.deepEqual(clampMapPan({ x: 100, y: -100 }, 1100, 600, 1), { x: 36, y: -24 });
  assert.deepEqual(
    dragMapPan({
      origin: { x: 0, y: 0 },
      delta: { x: 50, y: -25 },
      viewport: { width: 550, height: 300 },
      map: { width: 1100, height: 600 },
      scale: 2
    }),
    { x: 100, y: -50 }
  );
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
