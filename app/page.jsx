"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import destinations from "@/data/destinations.json";
import europeMap from "@/data/europe-map.json";
import mapConfig from "@/data/map-config.json";
import deConfig from "@/data/countries/de/config.json";
import deWorks from "@/data/countries/de/works.json";
import ukConfig from "@/data/countries/uk/config.json";
import ukWorks from "@/data/countries/uk/works.json";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const activeCountries = {
  de: { config: deConfig, works: deWorks },
  uk: { config: ukConfig, works: ukWorks }
};
const destinationByMapId = new Map(destinations.map((destination) => [destination.map_id, destination]));

function CountryShape({ country, selected, onSelect, onEnter }) {
  const destination = destinationByMapId.get(country.map_id);
  const activeCountry = destination && activeCountries[destination.id];
  const active = Boolean(activeCountry);
  const planned = Boolean(destination);
  const [offsetX, offsetY] = destination?.label_offset || [0, 0];
  const labelX = country.label[0] + offsetX;
  const labelY = country.label[1] + offsetY;
  const populationColour = mapConfig.population.tiers[country.population_tier].fill;
  const face = activeCountry?.config.destination.signature.face || populationColour;
  const darkFace = country.population_tier >= 4;

  const handleClick = () => {
    if (!active) return;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) onEnter(destination.id);
    else onSelect(destination.id);
  };

  return <g
    className={`map-country ${active ? "is-active" : ""} ${planned ? "is-planned" : "is-context"} ${selected ? "is-selected" : ""}`}
    role={active ? "button" : undefined}
    tabIndex={active ? 0 : undefined}
    aria-label={active ? `${destination.name_zh}，已开放` : undefined}
    aria-pressed={active ? selected : undefined}
    aria-disabled={planned && !active ? true : undefined}
    onPointerEnter={(event) => event.pointerType === "mouse" && active && onSelect(destination.id)}
    onFocus={() => active && onSelect(destination.id)}
    onClick={handleClick}
    onKeyDown={(event) => {
      if (active && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        onEnter(destination.id);
      }
    }}
  >
    {active && <path className="map-country-side" d={country.d} />}
    <g className="map-country-lift">
      <path
        className="map-country-face"
        d={country.d}
        style={{ fill: face }}
      />
      {planned && <g
        className={`map-country-label ${darkFace ? "on-dark" : "on-light"}`}
        transform={`translate(${labelX} ${labelY})`}
      >
        {active && <rect className="map-country-label-bg" x="-46" y="-17" width="92" height="37" rx="10" />}
        <text textAnchor="middle">
          <tspan className="map-country-name" x="0" y="0">{destination.name_zh}</tspan>
          <tspan className="map-country-original" x="0" dy="13">{destination.name_original}</tspan>
        </text>
      </g>}
    </g>
  </g>;
}

function PopulationLegend() {
  return <div className="population-legend">
    <div className="population-scale" aria-label="人口越少颜色越浅，人口越多颜色越深">
      <span>人口较少</span>
      <div>{mapConfig.population.tiers.map((tier) => <i key={tier.min} style={{ backgroundColor: tier.fill }} title={tier.label} />)}</div>
      <span>人口较多</span>
    </div>
    <div className="active-key"><i />已开放</div>
    <a href={mapConfig.population.source_url} target="_blank" rel="noreferrer">{mapConfig.population.year} · {mapConfig.population.source_label}</a>
  </div>;
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

  return <main
    className="map-page"
    style={{
      "--map-field": mapConfig.palette.field,
      "--map-page": mapConfig.palette.page,
      "--map-boundary": mapConfig.palette.boundary,
      "--map-side": mapConfig.palette.side,
      "--map-apricot": mapConfig.palette.apricot,
      "--map-apricot-pale": mapConfig.palette.apricot_pale,
      "--map-label": mapConfig.palette.label,
      "--map-label-on-dark": mapConfig.palette.label_on_dark
    }}
  >
    <header className="map-header">
      <a className="wordmark" href={`${basePath}/`}>{deConfig.brand.wordmark}</a>
      <p>{deConfig.brand.slogan_zh}</p>
    </header>

    <section className="map-section" aria-labelledby="map-title">
      <div className="map-title-row">
        <div><p>BEFORE YOU GO · EUROPE</p><h1 id="map-title">选择目的地</h1></div>
        <span>02 / 09 已开放</span>
      </div>
      <div className="europe-map">
        <svg
          className="europe-map-svg"
          viewBox={`0 0 ${europeMap.width} ${europeMap.height}`}
          role="img"
          aria-label="欧洲目的地地图，国家颜色表示2024年人口规模"
        >
          {europeMap.countries.map((country) => <CountryShape
            key={country.map_id}
            country={country}
            selected={destinationByMapId.get(country.map_id)?.id === selectedId}
            onSelect={setSelectedId}
            onEnter={enterCountry}
          />)}
        </svg>
        <PopulationLegend />
      </div>
    </section>

    <DestinationBrief country={selectedCountry} />
  </main>;
}
