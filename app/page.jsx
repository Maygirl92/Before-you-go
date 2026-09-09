"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import destinations from "@/data/destinations.json";
import deConfig from "@/data/countries/de/config.json";
import deWorks from "@/data/countries/de/works.json";
import ukConfig from "@/data/countries/uk/config.json";
import ukWorks from "@/data/countries/uk/works.json";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const activeCountries = {
  de: { config: deConfig, works: deWorks },
  uk: { config: ukConfig, works: ukWorks }
};

function CountryTile({ destination, selected, onSelect, onEnter }) {
  const country = activeCountries[destination.id];
  const active = Boolean(country);
  const face = country?.config.destination.signature.face || country?.config.palette.country_inactive || "#EDEBE5";
  const side = country?.config.destination.signature.side || country?.config.palette.map_fold || "#F5F3ED";

  return <button
    type="button"
    className={`country-tile tile-${destination.position} shape-${destination.shape} ${active ? "is-active" : "is-inactive"} ${selected ? "is-selected" : ""}`}
    style={{ "--country-face": face, "--country-side": side }}
    disabled={!active}
    aria-pressed={active ? selected : undefined}
    onPointerEnter={(event) => event.pointerType === "mouse" && active && onSelect(destination.id)}
    onFocus={() => active && onSelect(destination.id)}
    onClick={() => {
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) onEnter(destination.id);
      else onSelect(destination.id);
    }}
  >
    <span className="country-side" aria-hidden="true" />
    <span className="country-face" aria-hidden="true" />
    <span className="country-label"><strong>{destination.name_zh}</strong><em>{destination.name_original}</em></span>
  </button>;
}

function DestinationBrief({ country }) {
  const { config, works } = country;
  const intro = Object.entries(config.destination.intro || {}).filter(([, text]) => text);
  return <section className="destination-brief" aria-live="polite">
    <div className="brief-heading">
      <p>DESTINATION</p>
      <h2>{config.destination.name_zh} <em>{config.destination.name_original}</em></h2>
    </div>
    {intro.length > 0 && <div className="brief-intro">
      {intro.map(([label, text]) => <section key={label}><h3>{label}</h3><p>{text}</p></section>)}
    </div>}
    <div className="brief-footer">
      <div className="brief-themes">{config.facets.theme_main.map((theme) => <span key={theme.label} style={{ backgroundColor: theme.fill, color: theme.ink }}>{theme.label}</span>)}</div>
      <a href={`${basePath}/${config.destination.id}/`}>进入{config.destination.name_zh} · {works.length} 部作品</a>
    </div>
  </section>;
}

export default function Home() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState("de");
  const selectedCountry = useMemo(() => activeCountries[selectedId] || activeCountries.de, [selectedId]);
  const enterCountry = (id) => router.push(`/${id}`);

  return <main className="map-page">
    <header className="map-header">
      <a className="wordmark" href={`${basePath}/`}>{deConfig.brand.wordmark}</a>
      <p>{deConfig.brand.slogan_zh}</p>
    </header>

    <section className="map-section" aria-labelledby="map-title">
      <div className="map-title-row">
        <div><p>BEFORE YOU GO · EUROPE</p><h1 id="map-title">选择目的地</h1></div>
        <span>02 / 09 已开放</span>
      </div>
      <div className="europe-map" aria-label="欧洲目的地地图">
        {destinations.map((destination) => <CountryTile
          key={destination.id}
          destination={destination}
          selected={selectedId === destination.id}
          onSelect={setSelectedId}
          onEnter={enterCountry}
        />)}
      </div>
    </section>

    <DestinationBrief country={selectedCountry} />
  </main>;
}
