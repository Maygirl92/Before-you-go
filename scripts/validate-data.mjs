import deConfig from "../data/countries/de/config.json" with { type: "json" };
import deWorks from "../data/countries/de/works.json" with { type: "json" };
import ukConfig from "../data/countries/uk/config.json" with { type: "json" };
import ukWorks from "../data/countries/uk/works.json" with { type: "json" };
import { assertCountryData, formatQuotaReport } from "../lib/validation.mjs";

const mode = process.env.VALIDATION_MODE || "production";
const countries = [
  [deConfig, deWorks],
  [ukConfig, ukWorks]
];

for (const [config, works] of countries) {
  const report = assertCountryData(config, works, mode);
  console.log(formatQuotaReport(report));
}
