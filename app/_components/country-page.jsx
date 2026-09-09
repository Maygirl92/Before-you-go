"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FACET_KEYS, filterWorks, optionCount, parseFilters, serialiseFilters, sortWorks } from "@/lib/filtering.mjs";
import { displayTitle } from "@/lib/validation.mjs";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const allowedSortModes = new Set(["recommended", "time", "year", "recent"]);

function buildFacetMeta(config) {
  return [
    ["medium", "媒介类型", config.facets.medium, "id"],
    ["theme_main", "理解主题", config.facets.theme_main, "label"],
    ["lens", "创作视角", config.facets.lens, "id"],
    ["region", "地区", config.facets.region, "label"],
    ["time_cost", "时间成本", config.facets.time_cost, "id"]
  ];
}

function normaliseFilters(raw, facetMeta) {
  return Object.fromEntries(FACET_KEYS.map((key) => {
    const facet = facetMeta.find(([facetKey]) => facetKey === key);
    const allowed = new Set(facet[2].map((option) => option[facet[3]]));
    return [key, raw[key].filter((value) => allowed.has(value))];
  }));
}

function filterLabel(facetMeta, key, value) {
  const facet = facetMeta.find(([facetKey]) => facetKey === key);
  if (!facet) return value;
  const [, , options, identifier] = facet;
  return options.find((option) => option[identifier] === value)?.label || value;
}

function Facet({ facet, active, works, onChange }) {
  const [key, label, options, identifier] = facet;
  return <div className="facet-row">
    <h2>{label}</h2>
    <div className="facet-options">
      {options.map((option) => {
        const value = option[identifier];
        const count = optionCount(works, active, key, value);
        const selected = active[key].includes(value);
        return <button
          key={value}
          type="button"
          className={selected ? "selected" : ""}
          aria-pressed={selected}
          disabled={!selected && count === 0}
          onClick={() => onChange(key, value)}
        >
          {option.label} <span>({count})</span>
        </button>;
      })}
    </div>
  </div>;
}

function Tags({ tags, tagMap }) {
  return <div className="tags">{tags.map((tag) => {
    const colour = tagMap.get(tag);
    return <span key={tag} style={{ backgroundColor: colour?.fill, color: colour?.ink }}>{tag}</span>;
  })}</div>;
}

function Cover({ work, tagMap }) {
  if (work.cover) return <img className={`cover cover-${work.medium}`} src={work.cover} alt="" />;
  const colour = tagMap.get(work.theme_tags[0]);
  return <div className="cover cover-fallback" style={{ backgroundColor: colour?.fill, color: colour?.ink }}>
    <span>{displayTitle(work)}</span>
  </div>;
}

function Card({ work, tagMap, originalOnlyLabel }) {
  const [expanded, setExpanded] = useState(false);
  const title = displayTitle(work);
  const originalOnly = work.cn_edition.status === "original_only";

  return <article className={`work-card ${expanded ? "is-expanded" : ""}`}>
    <button className="card-summary" type="button" aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>
      <Cover work={work} tagMap={tagMap} />
      <span className="card-main">
        <span className="kicker">
          <span>{work.medium_sub_label}{work.time_cost_label ? ` · ${work.time_cost_label}` : ""}</span>
          {originalOnly && <span className="original-only-badge">{originalOnlyLabel}</span>}
        </span>
        <span className="work-title">{title}</span>
        {work.title_zh && work.title_original !== title && <em className="original-title">{work.title_original}</em>}
        <span className="creator-line">{work.creator} · {work.year} · {work.creator_country}</span>
        <Tags tags={work.theme_tags} tagMap={tagMap} />
      </span>
      <span className="lens-badge">{work.lens_label}</span>
      <span className="expand-mark" aria-hidden="true">{expanded ? "−" : "+"}</span>
    </button>

    <div className={`card-detail-shell ${expanded ? "open" : ""}`} aria-hidden={!expanded}>
      <div className="card-detail-overflow">
        <div className="card-detail">
          <div className="detail-meta">
            <span>{work.creator_country}</span><span>{work.year}</span><span>{work.creator}</span>{work.extent && <span>{work.extent}</span>}
            {originalOnly && <span className="original-only-detail">{originalOnlyLabel}</span>}
          </div>
          <div className="mobile-detail-tags"><Tags tags={work.theme_tags} tagMap={tagMap} /></div>
          <div className="detail-grid">
            <section><h3>简介</h3><p>{work.summary}</p></section>
            <section><h3>值得之处</h3><p>{work.worth}</p></section>
            {work.on_the_ground && <section><h3>对应之处</h3><p>{work.on_the_ground}</p></section>}
            {work.tier_reason && <section className="wide"><h3>为什么放在这个梯队</h3><p>{work.tier_reason}</p></section>}
          </div>
        </div>
      </div>
    </div>
  </article>;
}

function CoverCredits({ coverSources }) {
  if (coverSources.size === 0) return null;
  return <footer className="cover-credits">
    <span>封面来源：</span>
    {coverSources.has("Open Library") && <a href="https://openlibrary.org" target="_blank" rel="noreferrer">Open Library</a>}
    {coverSources.has("AbeBooks") && <a href="https://www.abebooks.com" target="_blank" rel="noreferrer">AbeBooks</a>}
    {coverSources.has("读书馆") && <a href="https://www.dushuguan.com" target="_blank" rel="noreferrer">读书馆</a>}
    {coverSources.has("理想国") && <a href="https://www.ilixiangguo.com" target="_blank" rel="noreferrer">理想国</a>}
    {coverSources.has("Cover Art Archive") && <a href="https://coverartarchive.org" target="_blank" rel="noreferrer">Cover Art Archive</a>}
    {coverSources.has("TMDB") && <><a href="https://www.themoviedb.org" target="_blank" rel="noreferrer">TMDB</a><span>This product uses the TMDB API but is not endorsed or certified by TMDB.</span></>}
  </footer>;
}

function CountryPageContent({ config, works, destinationNumber }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const facetMeta = useMemo(() => buildFacetMeta(config), [config]);
  const tagMap = useMemo(() => new Map(config.theme_tags.map((tag) => [tag.label, tag])), [config]);
  const rawFilters = useMemo(() => parseFilters(params), [params]);
  const active = useMemo(() => normaliseFilters(rawFilters, facetMeta), [rawFilters, facetMeta]);
  const requestedSort = params.get("sort") || "recommended";
  const hasPublishedDates = works.some((work) => work.published_at);
  const sortMode = allowedSortModes.has(requestedSort) && (requestedSort !== "recent" || hasPublishedDates) ? requestedSort : "recommended";
  const filtered = useMemo(() => filterWorks(works, active), [works, active]);
  const [collapsedTiers, setCollapsedTiers] = useState(() => new Set(["if-you-have-time", "after-you-return"]));
  const coverSources = useMemo(() => new Set(works.map((work) => work.cover_source).filter(Boolean)), [works]);
  const originalOnlyLabel = config.cn_edition_status.find((status) => status.id === "original_only")?.label || "仅原文";

  const updateUrl = (next, nextSort = sortMode) => {
    const query = new URLSearchParams(serialiseFilters(next));
    if (nextSort !== "recommended") query.set("sort", nextSort);
    router.replace(query.size ? `${pathname}?${query}` : pathname, { scroll: false });
  };
  const toggleFilter = (key, value) => updateUrl({
    ...active,
    [key]: active[key].includes(value) ? active[key].filter((item) => item !== value) : [...active[key], value]
  });
  const removeFilter = (key, value) => updateUrl({ ...active, [key]: active[key].filter((item) => item !== value) });
  const changeSort = (event) => updateUrl(active, event.target.value);
  const toggleTier = (tierId) => setCollapsedTiers((current) => {
    const next = new Set(current);
    if (next.has(tierId)) next.delete(tierId);
    else next.add(tierId);
    return next;
  });
  const activeEntries = FACET_KEYS.flatMap((key) => active[key].map((value) => [key, value]));
  const musicExcluded = active.time_cost.length ? works.filter((work) => work.medium === "music").length : 0;

  return <main className="page-shell">
    <header className="site-header">
      <div><a className="wordmark" href={`${basePath}/`}>{config.brand.wordmark}</a><p>{config.brand.slogan_zh}</p></div>
      <a className="map-link" href={`${basePath}/`}>← 欧洲地图</a>
    </header>

    <section className="destination-hero">
      <p className="eyebrow">DESTINATION · {String(destinationNumber).padStart(2, "0")}</p>
      <h1>{config.destination.name_zh} <em>{config.destination.name_original}</em></h1>
    </section>

    <section className="filter-panel" aria-label="作品筛选">
      {facetMeta.map((facet) => <Facet key={facet[0]} facet={facet} active={active} works={works} onChange={toggleFilter} />)}
    </section>

    {activeEntries.length > 0 && <div className="active-filters">
      <span>已选</span>
      {activeEntries.map(([key, value]) => <button key={`${key}-${value}`} type="button" onClick={() => removeFilter(key, value)}>{filterLabel(facetMeta, key, value)} ×</button>)}
      <button className="clear-all" type="button" onClick={() => router.replace(pathname, { scroll: false })}>清除全部</button>
    </div>}

    <div className="results-toolbar">
      <h2>显示 {works.length} 部作品中的 {filtered.length} 部</h2>
      <label><span className="sr-only">排序</span><select value={sortMode} onChange={changeSort}>
        <option value="recommended">推荐顺序</option>
        <option value="time">时间成本从短到长</option>
        <option value="year">按年份</option>
        <option value="recent" disabled={!hasPublishedDates}>最近新增</option>
      </select></label>
    </div>

    {filtered.length === 0 ? <div className="empty-state"><p>没有符合当前筛选条件的作品。</p><button type="button" onClick={() => router.replace(pathname)}>清除筛选</button></div> : <div className="tier-list">
      {config.tiers.map((tier) => {
        const section = sortWorks(filtered.filter((work) => work.tier === tier.id), sortMode);
        if (!section.length) return null;
        const collapsed = collapsedTiers.has(tier.id);
        const sectionId = `tier-${tier.id}`;
        return <section className="tier-section" key={tier.id}>
          <header className="tier-header">
            <h2>{tier.label} <span>· {section.length} 部</span></h2>
            <button
              className="tier-toggle"
              type="button"
              aria-expanded={!collapsed}
              aria-controls={sectionId}
              onClick={() => toggleTier(tier.id)}
            >
              {collapsed ? "展开" : "收起"}<span aria-hidden="true">⌄</span>
            </button>
          </header>
          <div
            id={sectionId}
            className={`tier-content ${collapsed ? "is-collapsed" : ""}`}
            aria-hidden={collapsed}
            inert={collapsed ? true : undefined}
          >
            <div className="tier-content-overflow">
              <div className="cards">{section.map((work) => <Card key={work.id} work={work} tagMap={tagMap} originalOnlyLabel={originalOnlyLabel} />)}</div>
            </div>
          </div>
        </section>;
      })}
    </div>}

    {musicExcluded > 0 && <p className="music-note">另有 {musicExcluded} 项音乐不参与时间筛选 · 展开查看</p>}
    <CoverCredits coverSources={coverSources} />
  </main>;
}

export default function CountryPage(props) {
  return <Suspense fallback={<main className="page-shell" />}><CountryPageContent {...props} /></Suspense>;
}
