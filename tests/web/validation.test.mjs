import test from "node:test";
import assert from "node:assert/strict";
import deConfig from "../../data/countries/de/config.json" with { type: "json" };
import deWorks from "../../data/countries/de/works.json" with { type: "json" };
import ukConfig from "../../data/countries/uk/config.json" with { type: "json" };
import ukWorks from "../../data/countries/uk/works.json" with { type: "json" };
import { assertCountryData, buildQuotaReport, displayTitle, validateCountryData } from "../../lib/validation.mjs";

test("both country packages pass the v2.1 schema", () => {
  assert.deepEqual(validateCountryData(deConfig, deWorks), []);
  assert.deepEqual(validateCountryData(ukConfig, ukWorks), []);
});

test("nullable Chinese titles fall back to the original title", () => {
  const work = ukWorks.find((item) => item.title_zh === null);
  assert.ok(work);
  assert.equal(displayTitle(work), work.title_original);
});

test("one theme tag is legal while zero is rejected", () => {
  const oneTag = structuredClone(deWorks.find((item) => item.theme_tags.length === 1));
  assert.deepEqual(validateCountryData(deConfig, [oneTag]), []);
  oneTag.theme_tags = [];
  assert.match(validateCountryData(deConfig, [oneTag]).join("\n"), /theme_tags 必须有 1–4 个值/);
});

test("sub-tags do not need to belong to a work's parent themes", () => {
  const work = structuredClone(deWorks[0]);
  work.theme_tags = ["浪漫主义与风景"];
  assert.deepEqual(validateCountryData(deConfig, [work]), []);
});

test("poetry and original-only are accepted", () => {
  assert.ok(deWorks.some((work) => work.medium_sub === "poetry"));
  assert.ok(ukWorks.some((work) => work.cn_edition.status === "original_only"));
  assert.deepEqual(validateCountryData(deConfig, deWorks), []);
  assert.deepEqual(validateCountryData(ukConfig, ukWorks), []);
});

test("UK null capital cap is skipped and known gaps remain visible", () => {
  const report = buildQuotaReport(ukConfig, ukWorks);
  assert.equal(report.rows.some((row) => row.label === "伦敦"), false);
  assert.ok(report.gaps.some((row) => row.label === "总数"));
  assert.equal(report.enforced, false);
  assert.doesNotThrow(() => assertCountryData(ukConfig, ukWorks, "production"));
});

test("an enforced production quota gap fails", () => {
  const config = structuredClone(ukConfig);
  config.quotas._enforced = true;
  assert.throws(() => assertCountryData(config, ukWorks, "production"), /生产构建因配额缺口停止/);
  assert.doesNotThrow(() => assertCountryData(config, ukWorks, "development"));
});
