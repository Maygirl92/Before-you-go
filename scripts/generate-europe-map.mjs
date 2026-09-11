import fs from "node:fs/promises";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import atlas from "world-atlas/countries-50m.json" with { type: "json" };

const countries = [
  ["008", "AL"], ["020", "AD"], ["040", "AT"], ["112", "BY"],
  ["056", "BE"], ["070", "BA"], ["100", "BG"], ["191", "HR"],
  ["196", "CY"], ["203", "CZ"], ["208", "DK"], ["233", "EE"],
  ["246", "FI"], ["250", "FR"], ["276", "DE"], ["300", "GR"],
  ["348", "HU"], ["352", "IS"], ["372", "IE"], ["380", "IT"],
  ["428", "LV"], ["438", "LI"], ["440", "LT"], ["442", "LU"],
  ["470", "MT"], ["498", "MD"], ["492", "MC"], ["499", "ME"],
  ["528", "NL"], ["807", "MK"], ["578", "NO"], ["616", "PL"],
  ["620", "PT"], ["642", "RO"], ["643", "RU"], ["674", "SM"],
  ["688", "RS"], ["703", "SK"], ["705", "SI"], ["724", "ES"],
  ["752", "SE"], ["756", "CH"], ["792", "TR"], ["804", "UA"],
  ["826", "GB"], ["336", "VA"]
];

const response = await fetch("https://api.worldbank.org/v2/country/all/indicator/SP.POP.TOTL?date=2024&format=json&per_page=400");
if (!response.ok) throw new Error(`World Bank population request failed: ${response.status}`);
const [, rows] = await response.json();
const populationByIso2 = new Map(rows.map((row) => [row.country.id, row.value]));
const countryFeatures = feature(atlas, atlas.objects.countries).features;
const featureById = new Map(countryFeatures.map((country) => [String(country.id).padStart(3, "0"), country]));
const projection = geoMercator()
  .center([15, 54])
  .scale(520)
  .translate([550, 300])
  .clipExtent([[18, 18], [1082, 582]]);
const path = geoPath(projection);
const thresholds = [0, 2_000_000, 5_000_000, 10_000_000, 30_000_000, 60_000_000];
const populationTier = (population) => thresholds.reduce((tier, minimum, index) => population >= minimum ? index : tier, 0);

const outputCountries = countries.flatMap(([mapId, iso2]) => {
  const country = featureById.get(mapId);
  const population = populationByIso2.get(iso2);
  if (!country || population == null) return [];
  const d = path(country);
  if (!d) return [];
  const [labelX, labelY] = path.centroid(country);
  return [{
    map_id: mapId,
    iso2,
    name: country.properties.name,
    population,
    population_tier: populationTier(population),
    label: [Math.round(labelX * 10) / 10, Math.round(labelY * 10) / 10],
    d
  }];
});

const output = {
  width: 1100,
  height: 600,
  projection: "Mercator, clipped to the European view",
  geometry_source: "Natural Earth via world-atlas countries-50m",
  geometry_source_url: "https://www.naturalearthdata.com/downloads/50m-cultural-vectors/",
  population_source: "World Bank SP.POP.TOTL",
  population_source_url: "https://data.worldbank.org/indicator/SP.POP.TOTL",
  population_year: 2024,
  generated_at: new Date().toISOString(),
  countries: outputCountries
};

await fs.writeFile(new URL("../data/europe-map.json", import.meta.url), `${JSON.stringify(output, null, 2)}\n`);
console.log(`Generated ${outputCountries.length} European country shapes.`);
