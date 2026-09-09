import CountryPage from "@/app/_components/country-page";
import config from "@/data/countries/de/config.json";
import works from "@/data/countries/de/works.json";

export default function GermanyPage() {
  return <CountryPage config={config} works={works} destinationNumber={1} />;
}
