import CountryPage from "@/app/_components/country-page";
import config from "@/data/countries/uk/config.json";
import works from "@/data/countries/uk/works.json";

export default function UnitedKingdomPage() {
  return <CountryPage config={config} works={works} destinationNumber={2} />;
}
